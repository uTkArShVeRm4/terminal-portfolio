import type { NextConfig } from "next";

const nextConfig: NextConfig ={
  reactStrictMode: true,
  webpack(config) {
    // Allow importing of wasm files
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    
    return config;
  },
} 

export default nextConfig;
