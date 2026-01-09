/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // This is required to allow the Next.js dev server to accept requests from
    // the Cloud Workstations preview port.
    allowedDevOrigins: [
      'https://6000-firebase-zona-fit-gt1-1765734394617.cluster-pgviq6mvsncnqxx6kr7pbz65v6.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
