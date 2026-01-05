/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // allowedDevOrigins se movió fuera de experimental
  },
  // La opción correcta es colocar allowedDevOrigins aquí
  allowedDevOrigins: [
    '9000-firebase-zona-fit-gt1-1765734394617.cluster-pgviq6mvsncnqxx6kr7pbz65v6.cloudworkstations.dev',
  ],
};

export default nextConfig;
