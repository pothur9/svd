"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

function ComingSoonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const feature = searchParams.get("feature") || "This Feature";

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #fff7f0 0%, #ffe8d6 50%, #fff3e6 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "5rem",
          paddingBottom: "3rem",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "fixed",
            top: "-80px",
            right: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(234, 88, 12, 0.12)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: "-100px",
            left: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(234, 88, 12, 0.08)",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            background: "#fff",
            borderRadius: "24px",
            boxShadow: "0 8px 40px rgba(234, 88, 12, 0.15)",
            padding: "3rem 3.5rem",
            maxWidth: "520px",
            width: "100%",
            textAlign: "center",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ea580c, #f97316)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem auto",
              boxShadow: "0 4px 20px rgba(234, 88, 12, 0.35)",
            }}
          >
            {/* Rocket SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "800",
              color: "#1e293b",
              marginBottom: "0.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Coming Soon
          </h1>

          {/* Feature name */}
          <div
            style={{
              display: "inline-block",
              background: "linear-gradient(90deg, #ea580c, #f97316)",
              borderRadius: "999px",
              padding: "0.3rem 1.2rem",
              marginBottom: "1.2rem",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontWeight: "700",
                fontSize: "1rem",
              }}
            >
              {feature}
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              color: "#64748b",
              fontSize: "1.05rem",
              lineHeight: "1.7",
              marginBottom: "2rem",
            }}
          >
            We are working hard to bring you this exciting new feature. Stay tuned — it will be available very soon!
          </p>

          {/* Divider */}
          <div
            style={{
              width: "60px",
              height: "4px",
              background: "linear-gradient(90deg, #ea580c, #f97316)",
              borderRadius: "999px",
              margin: "0 auto 2rem auto",
            }}
          />

          {/* Progress dots */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "2rem",
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: i === 0 ? "28px" : "10px",
                  height: "10px",
                  borderRadius: "999px",
                  background: i === 0 ? "#ea580c" : "#fed7aa",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* Go Back Button */}
          <button
            onClick={() => router.back()}
            style={{
              background: "linear-gradient(135deg, #ea580c, #f97316)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(234, 88, 12, 0.3)",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.opacity = "0.85")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.opacity = "1")
            }
          >
            ← Go Back
          </button>
        </div>

        {/* Footer text */}
        <p
          style={{
            marginTop: "2rem",
            color: "#94a3b8",
            fontSize: "0.9rem",
            zIndex: 1,
          }}
        >
          Sanathana Veera Shiva Lingayatha Dharma
        </p>
      </div>
      <Footer />
    </>
  );
}

export default function ComingSoonPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <ComingSoonContent />
    </Suspense>
  );
}
