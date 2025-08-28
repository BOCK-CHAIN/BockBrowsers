// Base URL of your API
const API_URL = "http://localhost:3000";

// Function to get the JWT token from localStorage
function getAuthToken() {
  return localStorage.getItem('jwtToken');
}

export async function registerUser(email, password) {
  const res = await window.axios.post(`${API_URL}/api/register`, { email, password });
  return res.data;
}

export async function loginUser(email, password) {
  const res = await window.axios.post(`${API_URL}/api/login`, { email, password });
  return res.data;
}

export async function getUserSettings(userId) {
  const token = getAuthToken();
  if (!token) {
    console.warn("No authentication token found. Cannot fetch settings.");
    return null;
  }
  const res = await window.axios.get(`${API_URL}/api/settings`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}

export async function saveUserSettings(userId, settings) {
  const token = getAuthToken();
  if (!token) {
    console.warn("No authentication token found. Cannot save settings.");
    return false;
  }
  const res = await window.axios.post(`${API_URL}/api/settings`, settings, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.status === 201; // Return true on success
}
