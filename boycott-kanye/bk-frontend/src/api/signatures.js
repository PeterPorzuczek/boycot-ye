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
    console.log('updateSignature - ID:', id);
    console.log('updateSignature - Data:', JSON.stringify(updateData));
    return apiClient.put(`/signatures/${id}`, updateData)
      .then(response => {
        console.log('updateSignature - Success response:', response);
        return response;
      })
      .catch(error => {
        console.error('updateSignature - Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            data: error.config?.data
          }
        });
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
      console.error('Error in getUserSignature:', error);

      if (error.response && error.response.status === 401) {
        
        localStorage.removeItem('token');
      }
      
      return null;
    }
  }
}; 