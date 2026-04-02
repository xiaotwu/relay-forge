// Re-export auth store from the web app pattern
// The desktop app uses the same auth logic
export { useAuthStore, getApiClient } from '../../../web/src/stores/auth';
