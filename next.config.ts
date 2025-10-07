// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
      {
        protocol: 'https',
        hostname: 'www.pngall.com',
      },
    ],
    // OR (older style if you prefer):
    // domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;
