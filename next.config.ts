import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/nutrient-economist",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
