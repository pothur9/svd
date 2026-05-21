"use client";

import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "bonus";
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Determine styles based on type
  let bgClass = "";
  let borderClass = "";
  let icon = "";

  switch (type) {
    case "success":
      bgClass = "bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.15)] text-gray-800";
      borderClass = "border-l-4 border-emerald-500";
      icon = "✅";
      break;
    case "error":
      bgClass = "bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.15)] text-gray-800";
      borderClass = "border-l-4 border-rose-500";
      icon = "❌";
      break;
    case "bonus":
      bgClass = "bg-gradient-to-r from-amber-50 to-orange-50/95 backdrop-blur-md shadow-[0_12px_40px_rgba(245,158,11,0.3)] text-gray-900";
      borderClass = "border-l-4 border-amber-500 ring-1 ring-amber-200/50";
      icon = "🎉";
      break;
    case "info":
    default:
      bgClass = "bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.15)] text-gray-800";
      borderClass = "border-l-4 border-blue-500";
      icon = "ℹ️";
      break;
  }

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none transition-all duration-300 ease-in-out">
      <div className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border border-gray-200/60 ${bgClass} ${borderClass} shadow-lg transform translate-y-0 scale-100 transition-transform duration-300`}>
        <span className="text-2xl mt-0.5 select-none">{icon}</span>
        <div className="flex-1 text-sm font-semibold leading-relaxed whitespace-pre-line text-slate-800">
          {message}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors text-base font-bold p-1 leading-none self-start"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
