/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
  },
};

export default nextConfig;
