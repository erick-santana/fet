// src/mobile/src/api/axiosConfig.ts

import axios from 'axios';
import { getToken } from '../utils/storage';
import Constants from 'expo-constants';

// Create base axios instance
const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl || 'http://10.0.2.2:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Request interceptor for adding auth token and error handling
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      
      if (token) {
        // Remove any existing Bearer prefix and send clean token
        const cleanToken = token.replace('Bearer ', '');
        config.headers.Authorization = cleanToken;
        console.log('Token in request:', config.headers.Authorization);
      }
      
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors - keeping existing error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log('API Response:', {
      url: response.config?.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    // Log detailed error information
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          console.log('Unauthorized access - token may be invalid');
          break;
        case 404:
          // Handle not found errors
          console.log('Resource not found:', error.config?.url);
          break;
        case 500:
          // Handle server errors
          console.log('Server error occurred');
          break;
        default:
          // Handle other status codes
          console.log(`Error ${error.response.status} occurred`);
      }
    } else if (error.request) {
      // Handle network errors
      console.log('Network error occurred:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;