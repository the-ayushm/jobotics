/** @type {import('next').NextConfig} */ // This line provides type checking
const nextConfig = {
  // Add webpack configuration
  webpack: (config, { isServer }) => {
    // Only apply this on the server-side build
    if (isServer) {
      // Ignore 'fs' module for specific libraries that might try to access local files
      config.externals.push({
        'pdf-parse': 'commonjs pdf-parse',
        'mammoth': 'commonjs mammoth',
        // If other modules cause similar ENOENT errors, add them here
        // For example: 'fs': 'commonjs fs', // More aggressive, but might break other things
      });
    }
    return config;
  },
  // Your existing Next.js config here
  // e.g., experimental: { appDir: true }, // if you had this
};

module.exports = nextConfig;