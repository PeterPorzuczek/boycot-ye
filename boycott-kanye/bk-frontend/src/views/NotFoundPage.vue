<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <h1>404</h1>
      <p>{{ t('notFound.title') }}</p>
      <p>{{ t('notFound.message') }}</p>
      <router-link to="/" class="back-link">{{ t('notFound.backToHome') }}</router-link>
    </div>
  </div>
</template>

<script>
import { useTranslation } from '../composables/useTranslation';

export default {
  name: 'NotFoundPage',
  setup() {
    const { t } = useTranslation();
    return { t };
  }
}
</script>

<style scoped>
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem 1rem;
}

.not-found-content {
  text-align: center;
  padding: 3rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
}

.not-found-content h1 {
  font-size: 6rem;
  margin: 0;
  color: #dc3545;
}

.not-found-content p {
  margin: 1rem 0;
  font-size: 1.2rem;
}

.back-link {
  display: inline-block;
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.back-link:hover {
  background-color: #0056b3;
}
</style> 