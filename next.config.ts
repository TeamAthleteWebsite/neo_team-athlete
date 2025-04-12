import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimisations de performance
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  // Optimisations d'images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/9.x/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Configuration du cache
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 1 heure
    pagesBufferLength: 5,
  },

  // Optimisations de production
  productionBrowserSourceMaps: false,

  // Configuration des en-têtes HTTP
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Configuration du webpack pour optimisations supplémentaires
  webpack: (config, { dev, isServer }) => {
    // Optimisations pour le build de production
    if (!dev && !isServer) {
      Object.assign(config.optimization.splitChunks.cacheGroups, {
        commons: {
          name: "commons",
          chunks: "all",
          minChunks: 2,
          priority: 10,
        },
      });
    }
    return config;
  },
};

export default nextConfig;
