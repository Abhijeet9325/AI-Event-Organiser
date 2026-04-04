/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    dynamicIO: true,
  },
  // Skip static export for dynamic pages
  output: 'standalone',
}

export default nextConfig
