import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "tools.minimalistu.eu" }],
        destination: "https://minimalistu.eu/instrumente",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "tools.minimalistu.eu" }],
        destination: "https://minimalistu.eu/instrumente",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
