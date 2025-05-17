import { ref, computed } from 'vue';
import { signatureApi } from '../api/signatures';
import { useRouter } from 'vue-router';

export function useSignature() {
  const signature = ref(null);
  const hasUserSigned = computed(() => !!signature.value);
  const isCreatingSignature = ref(false);
  const isFetchingSignature = ref(false);
  const error = ref(null);
  const router = useRouter();

  // Fetch user's signature
  const fetchUserSignature = async () => {
    isFetchingSignature.value = true;
    error.value = null;
    
    try {
      const response = await signatureApi.getCurrentUserSignature();
      signature.value = response.data;
      console.log('Fetched signature:', signature.value); // Debug log
      return signature.value;
    } catch (err) {
      // Ignore 404, as it means the user hasn't signed the petition yet
      if (err.response && err.response.status !== 404) {
        console.error('Error fetching signature:', err);
        error.value = 'Failed to retrieve signature information';
      }
      return null;
    } finally {
      isFetchingSignature.value = false;
    }
  };

  // Create a signature
  const createSignature = async (signatureData) => {
    isCreatingSignature.value = true;
    error.value = null;
    
    try {
      const response = await signatureApi.createSignature(signatureData);
      signature.value = response.data;
      
      // After successful signing, redirect to thank you page
      router.push('/thank-you');
      
      return signature.value;
    } catch (err) {
      console.error('Error creating signature:', err);
      
      if (err.response) {
        if (err.response.status === 409) {
          error.value = 'You have already signed this petition';
          // Redirect to profile if user has already signed
          router.push('/profile');
        } else if (err.response.status === 400) {
          error.value = 'Invalid form data. Please check that all fields are filled correctly.';
        } else {
          error.value = 'An error occurred while submitting your signature. Please try again later.';
        }
      } else {
        error.value = 'Connection problem. Please check your internet connection.';
      }
      
      return null;
    } finally {
      isCreatingSignature.value = false;
    }
  };

  // Delete a signature
  const deleteSignature = async (signatureId) => {
    if (!signatureId) {
      throw new Error('Signature ID is required');
    }

    isCreatingSignature.value = true; // Reusing this state variable for deletion
    error.value = null;
    
    try {
      await signatureApi.deleteSignature(signatureId);
      signature.value = null; // Clear the local signature data
      
      return true;
    } catch (err) {
      console.error('Error deleting signature:', err);
      
      if (err.response) {
        if (err.response.status === 403) {
          error.value = 'You are not authorized to delete this signature';
        } else if (err.response.status === 404) {
          error.value = 'Signature not found';
        } else {
          error.value = 'Failed to withdraw signature';
        }
      } else {
        error.value = 'Connection error. Please check your internet connection.';
      }
      
      return false;
    } finally {
      isCreatingSignature.value = false;
    }
  };

  // Update signature visibility
  const updateSignatureVisibility = async (signatureId, publicDisplay) => {
    if (!signatureId) {
      throw new Error('Signature ID is required');
    }

    isCreatingSignature.value = true; // Reusing this state variable for update
    error.value = null;
    
    try {
      const response = await signatureApi.updateSignature(signatureId, { 
        public_display: publicDisplay 
      });
      
      // Update local signature data
      if (response.data) {
        signature.value = response.data;
      }
      
      return true;
    } catch (err) {
      console.error('Error updating signature visibility:', err);
      
      if (err.response) {
        if (err.response.status === 403) {
          error.value = 'You are not authorized to update this signature';
        } else if (err.response.status === 404) {
          error.value = 'Signature not found';
        } else {
          error.value = 'Failed to update signature visibility';
        }
      } else {
        error.value = 'Connection error. Please check your internet connection.';
      }
      
      return false;
    } finally {
      isCreatingSignature.value = false;
    }
  };

  return {
    signature,
    hasUserSigned,
    isCreatingSignature,
    isFetchingSignature,
    error,
    fetchUserSignature,
    createSignature,
    deleteSignature,
    updateSignatureVisibility
  };
} 