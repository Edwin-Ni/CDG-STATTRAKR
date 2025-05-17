import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // No ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow type errors during builds for speed
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
