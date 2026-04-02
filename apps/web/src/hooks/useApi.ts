import { getApiClient } from '@/stores/auth';

/**
 * Returns the singleton ApiClient instance.
 * Tokens are managed by the auth store.
 */
export function useApi() {
  return getApiClient();
}
