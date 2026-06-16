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
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
