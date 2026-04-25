// lib/api.js — Axios instance configured to talk to our backend API
//
// In development (pnpm dev):   uses http://localhost:5001/api
// In production (Netlify):     uses VITE_API_URL environment variable
//                              Set this in Netlify → Site settings → Environment variables

import axios from "axios";

// Vite exposes env vars with the VITE_ prefix via import.meta.env
// NEVER use process.env in Vite — it won't work at build time
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 seconds — accounts for Render cold start on free tier
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Request interceptor ---
// Runs before every request. Attaches the JWT token from localStorage
// so protected routes (like /profile) receive the Authorization header automatically.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor ---
// Runs after every response. Logs errors to the console for easier debugging.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API Error:",
      error.response?.data?.message || error.message
    );
    return Promise.reject(error);
  }
);
