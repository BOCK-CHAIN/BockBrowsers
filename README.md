# Bock Browser

## Description

Bock Browser is a custom web browser built using Electron, providing a unique browsing experience with integrated features like user authentication, settings management, and incognito mode. It combines a desktop application interface with a robust Node.js backend for handling user data and authentication securely.

## Features

*   **Electron-based Desktop Application:** A cross-platform desktop browser.
*   **User Authentication:** Secure user registration and login using JWTs and `bcrypt` for password hashing.
*   **Session Management:** Persistent user sessions handled by a Node.js backend.
*   **User Settings:** Personalized browser settings stored and retrieved from a Neon database.
*   **Incognito Mode:** Private browsing functionality.
*   **Navigation System:** Seamless navigation between different browser views (Home, Settings, Login, Incognito).

## Technologies Used

*   **Electron:** For building the cross-platform desktop application.
*   **Node.js:** Powers the backend server and API.
*   **Neon Database (PostgreSQL):** Serverless SQL database for storing user data, sessions, and settings.
*   **Axios:** HTTP client for making API requests from the frontend to the backend.
*   **bcrypt:** For secure password hashing.
*   **jsonwebtoken (JWT):** For generating and verifying access tokens for authentication.
*   **dotenv:** For managing environment variables.
*   **HTML/CSS/JavaScript:** Frontend development of the browser's UI.

## Getting Started

Follow these instructions to set up and run Bock Browser on your local machine.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (Node Package Manager)
*   A Neon Database account (or any PostgreSQL-compatible database)

### Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/bock_browser.git
    cd bock_browser
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Database Setup:**
    *   Create a new PostgreSQL database (e.g., on Neon Database).
    *   Obtain your database connection string.
    *   Apply the schema by running the SQL commands in `schema.sql` against your new database. You can use a tool like `psql` or a database client for this.

        ```bash
        # Example using psql
        psql -h YOUR_NEON_HOST -p YOUR_NEON_PORT -U YOUR_NEON_USER -d YOUR_NEON_DB_NAME -f schema.sql
        ```

4.  **Environment Variables:**
    *   Create a `.env` file in the root directory of the project.
    *   Add the following environment variables:

        ```
        DATABASE_URL="your_neon_database_connection_string"
        JWT_SECRET="a_very_strong_secret_key_for_jwt_signing"
        ```
        Replace `"your_neon_database_connection_string"` with your actual Neon database connection string and `"a_very_strong_secret_key_for_jwt_signing"` with a strong, random secret key.

### Running the Application

Bock Browser consists of two main parts: the Node.js backend server and the Electron desktop application. Both need to be running.

1.  **Start the Backend Server:**

    Open a terminal and run:

    ```bash
    npm run server
    ```
    This will start the API server, typically on `http://localhost:3000`.

2.  **Start the Electron Application:**

    Open a **separate** terminal and run:

    ```bash
    npm start
    ```
    This will launch the Bock Browser desktop application. The browser will initially load the login page.

## Project Structure

```
bock_browser/
├── api.js                   # Potential API definitions or utility functions
├── electron/                # Electron main and preload scripts
│   ├── main.js              # Main Electron process, handles window creation and IPC
│   └── preload.js           # Preload script for secure renderer-process communication
├── pages/                   # HTML pages for different browser views
│   ├── incognito.html
│   ├── index.html
│   ├── login.html
│   └── settings.html
├── scripts/                 # Frontend JavaScript files
│   ├── main.js              # Main frontend logic
│   ├── navigation.js        # Handles in-app navigation
│   ├── settings.js          # Logic for managing user settings
│   └── storage/
│       └── bookmarks.js     # Bookmark management logic
│   └── ui/
│       ├── tabs.js          # Tab management UI
│       └── topbar.js        # Top bar UI elements
├── server.js                # Node.js backend server with API endpoints
├── schema.sql               # Database schema for PostgreSQL
├── styles/                  # CSS stylesheets for the UI
│   ├── base.css
│   ├── incognito.css
│   ├── settings.css
│   └── theme.css
├── package.json             # Project dependencies and scripts
└── package-lock.json        # Locked dependencies
```

## Contributing

(Add details on how to contribute if this is an open-source project)

## License

(Add license information if applicable)
