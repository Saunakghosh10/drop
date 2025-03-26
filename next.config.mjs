/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      net: false,
      dns: false,
      tls: false
    };
    
    return config;
  },
  // Default directory structure
  distDir: '.next'
};

export default nextConfig;
