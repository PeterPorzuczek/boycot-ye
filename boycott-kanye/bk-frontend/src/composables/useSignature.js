import { ref, computed } from 'vue';
import { signatureApi } from '@/api/signatures';

export function useSignature() {
  const signature = ref(null);
  const hasUserSigned = computed(() => !!signature.value);
  const isCreatingSignature = ref(false);
  const isFetchingSignature = ref(false);
  const error = ref(null);

  
  const fetchUserSignature = async () => {
    isFetchingSignature.value = true;
    error.value = null;
    
    try {
      const response = await signatureApi.getCurrentUserSignature();
      signature.value = response.data;
      hasUserSigned.value = !!signature.value;
      return signature.value;
    } catch (err) {
      hasUserSigned.value = false;
      error.value = 'Failed to fetch signature';
      return null;
    } finally {
      isFetchingSignature.value = false;
    }
  };

  
  const createSignature = async (signatureData) => {
    isCreatingSignature.value = true;
    error.value = null;
    
    try {
      const response = await signatureApi.createSignature(signatureData);
      signature.value = response.data;
      hasUserSigned.value = true;
      return true;
    } catch (err) {
      error.value = 'Failed to create signature';
      return false;
    } finally {
      isCreatingSignature.value = false;
    }
  };

  
  const deleteSignature = async (signatureId) => {
    if (!signatureId) {
      throw new Error('Signature ID is required');
    }

    isCreatingSignature.value = true; 
    error.value = null;
    
    try {
      await signatureApi.deleteSignature(signatureId);
      signature.value = null; 
      hasUserSigned.value = false;
      
      return true;
    } catch (err) {
      error.value = 'Failed to delete signature';
      
      return false;
    } finally {
      isCreatingSignature.value = false;
    }
  };

  
  const updateSignatureVisibility = async (signatureId, publicDisplay) => {
    if (!signatureId) {
      throw new Error('Signature ID is required');
    }

    isCreatingSignature.value = true; 
    error.value = null;
    
    try {
      const response = await signatureApi.updateSignature(signatureId, { 
        public_display: publicDisplay 
      });
      
      
      if (response.data) {
        signature.value = response.data;
      }
      
      return true;
    } catch (err) {
      error.value = 'Failed to update signature visibility';
      
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