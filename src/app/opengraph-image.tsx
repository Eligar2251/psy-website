import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/data";

export const runtime = "edge";

export const alt = `${siteConfig.name} — ${siteConfig.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f0faf6 0%, #faf9f7 50%, #fef6ee 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Логотип */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            backgroundColor: "#1e7a5a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <span style={{ color: "white", fontSize: 40, fontWeight: 700 }}>
            Е
          </span>
        </div>

        {/* Имя */}
        <h1
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#1c1917",
            margin: 0,
            marginBottom: 8,
          }}
        >
          {siteConfig.name}
        </h1>

        {/* Подзаголовок */}
        <p
          style={{
            fontSize: 24,
            color: "#78716c",
            margin: 0,
            marginBottom: 32,
          }}
        >
          {siteConfig.title}
        </p>

        {/* Описание */}
        <p
          style={{
            fontSize: 18,
            color: "#a8a29e",
            margin: 0,
            maxWidth: 600,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Профессиональная психологическая помощь. Онлайн и очно.
        </p>
      </div>
    ),
    { ...size }
  );
}