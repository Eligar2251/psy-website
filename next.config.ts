import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Оптимизация изображений
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 640, 768, 1024, 1280, 1536],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 дней
  },

  // Заголовки безопасности
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Редиректы
  async redirects() {
    return [
      {
        source: "/uslugi",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/kontakty",
        destination: "/contacts",
        permanent: true,
      },
      {
        source: "/obo-mne",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/zapis",
        destination: "/booking",
        permanent: true,
      },
    ];
  },

  // Сжатие
  compress: true,

  // Строгий режим React
  reactStrictMode: true,

  // Оптимизация сборки
  poweredByHeader: false,
};

export default nextConfig;