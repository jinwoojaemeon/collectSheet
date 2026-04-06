import axios from 'axios';
import {API_BASE_URL, API_TIMEOUT} from './config';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {'Content-Type': 'application/json'},
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
