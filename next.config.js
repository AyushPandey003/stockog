/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['biztoc.com'],
  },
  // Enable API route support and handle Node.js modules correctly
  serverExternalPackages: ["@vercel/postgres"],
  
  // Tell webpack not to attempt to bundle these Node.js modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs', 'net', etc. on the client to prevent errors
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
        pg: false,
        'pg-native': false
      };
    }
    return config;
  }
};

module.exports = nextConfig; 