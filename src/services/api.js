const API = process.env.REACT_APP_API_BASE_URL;

fetch(`${API}/auth/me`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})


export const apiService = {
  get: async (endpoint)  => {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },
  post: async (endpoint, data) => {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  put: async (endpoint, data) => {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};
