import axios from 'axios';

// Base URL from documentation [cite: 6]
const API_BASE_URL = 'http://localhost:8000';

export const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },    
});