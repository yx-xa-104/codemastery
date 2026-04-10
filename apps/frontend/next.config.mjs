/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/lessons/**/*': ['./../../content/**/*'],
    },
  },
};

export default nextConfig;
