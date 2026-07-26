import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ersuemtbcjynjmmmamwa.supabase.co",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/blogs",
        destination: "https://metricmart-blogs.vercel.app/blogs",
      },
      {
        source: "/blogs/:path*",
        destination: "https://metricmart-blogs.vercel.app/blogs/:path*",
      },
    ];
  },
};

export default nextConfig;