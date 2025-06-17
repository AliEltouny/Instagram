/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.instagram.com'],
  },
  // Add environment variables that should be available on the server side
  env: {
    FIREBASE_CONFIG: process.env.FIREBASE_CONFIG,
  },
  // Add this to ensure path aliases work in both dev and prod
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
};

const path = require('path');
module.exports = nextConfig;