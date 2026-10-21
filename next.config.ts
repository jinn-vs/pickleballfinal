import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Featured images come from the admin's media storage (S3) and Supabase.
    // Add any other hosts you upload from here.
    remotePatterns: [
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.cloudfront.net" },
    ],
  },
};

export default nextConfig;
