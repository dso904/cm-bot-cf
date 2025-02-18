/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Enables static export for Cloudflare
  images: {
    unoptimized: true, // Cloudflare doesn't support Next.js Image Optimization
  },
};

module.exports = nextConfig;
