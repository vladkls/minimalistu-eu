import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
