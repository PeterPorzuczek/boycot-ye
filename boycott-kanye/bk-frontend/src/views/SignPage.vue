<template>
  <div class="sign-page">
    <div class="page-header">
      <h1>Sign the Petition</h1>
    </div>
    
    <div v-if="isLoading" class="loading-container">
      <p>Loading...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <router-link to="/" class="back-link">Back to Home</router-link>
    </div>
    
    <div v-else-if="hasUserSigned" class="already-signed-container">
      <p>You have already signed this petition.</p>
      <router-link to="/profile" class="profile-link">Profile</router-link>
      <router-link to="/" class="back-link">Back to Home</router-link>
    </div>
    
    <div v-else class="form-container">
      <SignForm 
        :user="user" 
        @submit="handleSignatureSubmit"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SignForm from '../components/SignForm.vue';

export default {
  name: 'SignPage',
  components: {
    SignForm
  },
  data() {
    return {
      user: null,
      hasUserSigned: false,
      signature: null,
      isLoading: true,
      error: null
    };
  },
  created() {
    this.checkAuthentication();
  },
  methods: {
    checkAuthentication() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }
      
      this.fetchUserData(token);
    },
    async fetchUserData(token) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // Reset hasUserSigned to false until we explicitly check
        this.hasUserSigned = false;
        
        // Extract user data from JWT token
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const tokenData = JSON.parse(jsonPayload);
        
        // Create user object with required properties
        this.user = {
          id: tokenData.sub || tokenData.id, // 'sub' is standard JWT claim for subject/user ID
          email: tokenData.email || '',
          name: tokenData.name || ''
        };
        
        // Check if user has already signed the petition
        await this.checkExistingSignature();
      } catch (err) {
        console.error('Error processing user data:', err);
        if (err.response && err.response.status === 401) {
          // Invalid token - redirect to login
          localStorage.removeItem('token');
          this.$router.push('/login');
        } else {
          // Provide more detailed error message
          if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
            this.error = 'Cannot connect to API server. Please make sure the backend is running at http://localhost:3000';
          } else if (err.response) {
            this.error = `Failed to process user data: ${err.response.status} ${err.response.statusText}`;
          } else {
            this.error = `Failed to process user data: ${err.message}`;
          }
        }
      } finally {
        this.isLoading = false;
      }
    },
    async checkExistingSignature() {
      try {
        const response = await axios.get('http://localhost:3000/api/signatures/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Only set hasUserSigned to true if we get a valid signature
        if (response.data && response.data.id) {
          this.signature = response.data;
          this.hasUserSigned = true;
        } else {
          this.hasUserSigned = false;
        }
      } catch (err) {
        // 404 means the user hasn't signed the petition yet
        if (err.response && err.response.status === 404) {
          // This is expected for users who haven't signed
          this.hasUserSigned = false;
        } else if (err.response) {
          console.error('Error checking signature:', err);
          this.error = `Failed to check if you have already signed: ${err.response.status} ${err.response.statusText}`;
        } else {
          console.error('Error checking signature:', err);
          this.error = 'Failed to connect to the server. Please try again later.';
        }
      }
    },
    async handleSignatureSubmit(signatureData) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // Print what we're sending to help debugging
        console.log('Submitting signature data:', signatureData);
        
        // Make sure we send exactly what the API expects based on Swagger
        const apiData = {
          userId: signatureData.userId,
          agreeCheckbox: signatureData.agreeCheckbox,
          publicDisplay: signatureData.publicDisplay
        };
        
        const response = await axios.post('http://localhost:3000/api/signatures', apiData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Signature created successfully:', response.data);
        
        // After successful signature, redirect to thank you page
        this.$router.push('/thank-you');
      } catch (err) {
        console.error('Failed to create signature:', err);
        
        if (err.response) {
          if (err.response.status === 409) {
            // User has already signed the petition
            this.hasUserSigned = true;
            this.$router.push('/profile');
          } else if (err.response.status === 400) {
            this.error = 'Invalid form data. Please check all fields are filled correctly.';
            console.log('Response data:', err.response.data);
          } else {
            this.error = `Failed to sign the petition: ${err.response.data?.message || 'Unknown error'}`;
          }
        } else {
          this.error = 'Connection error. Please check your internet connection.';
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.sign-page {
  padding: 2rem 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.loading-container,
.error-container,
.already-signed-container {
  text-align: center;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.error-container {
  color: #721c24;
  background-color: #f8d7da;
}

.back-link,
.profile-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  color: #fff;
  background-color: #007bff;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.back-link:hover,
.profile-link:hover {
  background-color: #0056b3;
}

.profile-link {
  margin-right: 1rem;
}
</style> 