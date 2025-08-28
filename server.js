require("dotenv").config();
const http = require("http");
const { neon } = require("@neondatabase/serverless");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sql = neon(process.env.DATABASE_URL);

const protect = async (req) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const sessions = await sql`SELECT * FROM sessions WHERE token = ${token} AND expires_at > NOW()`;
      if (sessions.length === 0) {
        return null; // Token not found or expired
      }
      req.userId = decoded.userId;
      return true;
    } catch (error) {
      console.error("Auth error:", error);
      return null;
    }
  }
  return null;
};

const requestHandler = async (req, res) => {
  try {
    // Public routes
    if (req.url === "/api/users" && req.method === "GET") {
      const users = await sql`SELECT * FROM users`;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users));
    } 
    else if (req.url === "/api/register" && req.method === "POST") {
      let body = "";
      req.on("data", chunk => body += chunk.toString());
      req.on("end", async () => {
        const { email, password } = JSON.parse(body);
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        try {
          const result = await sql`
            INSERT INTO users (email, password_hash, salt)
            VALUES (${email}, ${password_hash}, ${salt})
            RETURNING id, email
          `;
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "User registered successfully", user: result[0] }));
        } catch (dbError) {
          console.error("Server failed to register user:", dbError);
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("Registration error: " + dbError.message);
        }
      });
    }
    else if (req.url === "/api/login" && req.method === "POST") {
      let body = "";
      req.on("data", chunk => body += chunk.toString());
      req.on("end", async () => {
        const { email, password } = JSON.parse(body);
        const users = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (users.length === 0) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("Invalid credentials");
          return;
        }
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("Invalid credentials");
          return;
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        await sql`
          INSERT INTO sessions (user_id, token, expires_at)
          VALUES (${user.id}, ${token}, NOW() + INTERVAL '24 hours')
          ON CONFLICT (token) DO UPDATE SET expires_at = NOW() + INTERVAL '24 hours', created_at = NOW()
        `;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Logged in successfully", token, user: { id: user.id, email: user.email } }));
      });
    }
    // Protected routes
    else if (req.url.startsWith("/api/settings")) {
      if (!(await protect(req))) {
        res.writeHead(401, { "Content-Type": "text/plain" });
        res.end("Not authorized, token failed");
        return;
      }
      const userId = req.userId; // Use userId from authenticated request
      if (req.method === "GET") {
        console.log(`Server: GET /api/settings - Fetching settings for userId: ${userId}`);
        const result = await sql`SELECT settings FROM user_settings WHERE user_id = ${userId}`;
        const settings = result.length > 0 ? result[0].settings : null;
        console.log("Server fetched settings from DB for userId:", userId, "Settings:", settings);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(settings));
      } 
      else if (req.method === "POST") {
        let body = "";
        req.on("data", chunk => body += chunk.toString());
        req.on("end", async () => {
          const settings = JSON.parse(body);
          console.log(`Server: POST /api/settings - Receiving settings for userId: ${userId}, Settings:`, settings);
          try {
            await sql`
              INSERT INTO user_settings (user_id, settings)
              VALUES (${userId}, ${JSON.stringify(settings)})
              ON CONFLICT (user_id) DO UPDATE
              SET settings = ${JSON.stringify(settings)}
            `;
            console.log("Server successfully saved settings to DB for userId:", userId);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Settings saved" }));
          } catch (dbError) {
            console.error("Server failed to save settings to DB for userId:", userId, "Error:", dbError);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Database error: " + dbError.message);
          }
        });
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("Method Not Allowed");
      }
    }
    else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Error: " + err.message);
  }
};

http.createServer(requestHandler).listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
