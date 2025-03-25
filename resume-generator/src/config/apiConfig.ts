/**
 * API configuration for backend services
 */

// Default API URL based on environment
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// List of fallback ports to try if the main one is unavailable
export const FALLBACK_PORTS = [5001, 5002, 5003, 5004, 5005];

/**
 * Attempts to find a working API endpoint from the available ports
 */
export const findWorkingApiEndpoint = async (): Promise<string> => {
  // First try the configured URL
  if (await checkEndpoint(API_BASE_URL)) {
    return API_BASE_URL;
  }
  
  // If that fails, try the fallback ports
  for (const port of FALLBACK_PORTS) {
    const url = `http://localhost:${port}/api`;
    if (await checkEndpoint(url)) {
      return url;
    }
  }
  
  // If all else fails, return the original and let individual calls handle errors
  console.warn('Could not find a working API endpoint, using default');
  return API_BASE_URL;
};

/**
 * Checks if an API endpoint is available
 */
const checkEndpoint = async (url: string): Promise<boolean> => {
  try {
    // Attempt to call a simple health endpoint
    const response = await fetch(`${url}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(500), // Short timeout for quick checks
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Create an axios instance with the API URL
 * Usage: import { apiClient } from '../config/apiConfig';
 */
export const createApiClient = async () => {
  const axios = (await import('axios')).default;
  const baseURL = await findWorkingApiEndpoint();
  
  return axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
