import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    config.module.rules.push({
      test: /\.js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    },
    optimizeCss: true,
    scrollRestoration: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      }
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
          {
            key: "Accept-Ranges",
            value: "bytes"
          }
        ],
      },
    ];
  },
};

export default nextConfig;