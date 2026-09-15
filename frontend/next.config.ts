import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendApiUrl = (process.env.RESUMEX_API_BASE_URL ?? "http://127.0.0.1:8000/api").replace(/\/$/, "");
    return [{ source: "/backend-api/:path*", destination: `${backendApiUrl}/:path*` }];
  },
};

export default nextConfig;
