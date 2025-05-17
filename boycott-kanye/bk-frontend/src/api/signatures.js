import apiClient from './axios-client';

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