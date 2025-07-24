/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'via.placeholder.com'],
  },
  async rewrites() {
    return [
      {
        source: '/demo/:path*',
        destination: '/api/proxy/:path*',
      },
    ]
  },
}

module.exports = nextConfig 