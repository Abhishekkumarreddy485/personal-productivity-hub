// /frontend/lib/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
});

export function setAuthToken(token) {
  if (token) API.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete API.defaults.headers.common.Authorization;
}

export default API;
