/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Suppress hydration warnings
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  }
};

module.exports = nextConfig;
