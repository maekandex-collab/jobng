import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    'dompurify',
    'isomorphic-dompurify',
    'jsdom',
    'html-encoding-sniffer',
    '@exodus/bytes',
  ],
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
