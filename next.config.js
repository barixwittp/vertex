/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react'],
  images: {
    domains: ['images.unsplash.com'],
  },
  experimental: {
    optimizeCss: true
  }
}

module.exports = nextConfig 