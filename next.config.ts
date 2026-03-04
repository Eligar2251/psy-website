import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  // Кэширование на уровне headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // Кэшируем статические ресурсы
        source: "/(.*\\.(?:js|css|woff2|woff|ttf|ico|png|jpg|jpeg|svg|webp|avif)$)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/uslugi", destination: "/services", permanent: true },
      { source: "/kontakty", destination: "/contacts", permanent: true },
      { source: "/obo-mne", destination: "/about", permanent: true },
      { source: "/zapis", destination: "/booking", permanent: true },
    ];
  },

  compress: true,
  reactStrictMode: false, // Убираем двойной рендер в dev
  poweredByHeader: false,

  // Оптимизация пакетов
  experimental: {
    optimizePackageImports: ["lucide-react", "clsx"],
  },
};

export default nextConfig;