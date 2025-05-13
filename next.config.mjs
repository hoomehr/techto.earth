/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    browserDepCheck: false
  },
  reactStrictMode: true,
  transpilePackages: ['react-day-picker', 'vaul']
}

export default nextConfig