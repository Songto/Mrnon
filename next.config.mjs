/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep the Postgres driver out of Next's bundler — it's loaded lazily at
  // runtime (only when DATABASE_URL is set) via a dynamic import.
  experimental: {
    serverComponentsExternalPackages: ["pg"]
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.discordapp.com" }
    ]
  }
};

export default nextConfig;
