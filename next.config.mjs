/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    buildActivity: false,
  },
  experimental: {
    // This is needed to allow the Next.js dev server to be proxied in the current environment.
    // https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
    allowedDevOrigins: [
      'https://9000-firebase-zona-fit-gt1-1765734394617.cluster-pgviq6mvsncnqxx6kr7pbz65v6.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
