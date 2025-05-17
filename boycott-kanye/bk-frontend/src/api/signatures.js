import axios from 'axios';

// Axios configuration with base URL for API
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor for authorization token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      
      localStorage.removeItem('token');
      
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const signatureApi = {
  
  getAllSignatures() {
    return apiClient.get('/signatures/all');
  },
  
  
  getCurrentUserSignature() {
    return apiClient.get('/signatures/me');
  },
  
  
  createSignature(signatureData) {
    return apiClient.post('/signatures', signatureData);
  },
  
  
  updateSignature(id, updateData) {
    return apiClient.put(`/signatures/${id}`, updateData)
      .then(response => {
        return response;
      })
      .catch(error => {
        throw error;
      });
  },
  
  
  deleteSignature(id) {
    return apiClient.delete(`/signatures/${id}`);
  },

  
  async getUserSignature() {
    try {
      const response = await apiClient.get('/signatures/me');
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Token expired or invalid - logout the user
        localStorage.removeItem('token');
      }
      
      return null;
    }
  }
}; 