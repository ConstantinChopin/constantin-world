/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openaccess-cdn.clevelandart.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.artic.edu',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
