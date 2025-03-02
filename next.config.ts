/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['fbpdbcxjavianaboavoo.supabase.co', 'placehold.co'], // Fixed trailing slash
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fbpdbcxjavianaboavoo.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**', // Adjusted for Supabase path
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },

};

module.exports = nextConfig;
