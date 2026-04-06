// Base URL for the EcoSphere API
// For local development on emulator/web: http://localhost:8000
// For physical devices on the same WiFi: http://YOUR_COMPUTER_IP:8000
// For production: https://your-app.onrender.com

const API_BASE_URL = 'https://ecosphere-api.onrender.com'; 

export default {
    BASE_URL: API_BASE_URL,
    ENDPOINTS: {
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        REGISTER: `${API_BASE_URL}/api/auth/register`,
        SCAN: `${API_BASE_URL}/api/analyze`,
        RECIPE: `${API_BASE_URL}/api/food/curate`,
        PURCHASE: `${API_BASE_URL}/api/game/purchase`,
        PROFILE: `${API_BASE_URL}/api/game/profile`,
    }
};
