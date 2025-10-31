/** @type {import('next').NextConfig} */
const nextConfig = {
  // --- ADD THIS 'images' BLOCK ---
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/api/images/**",
      },
    ],
  },
};

export default nextConfig;
