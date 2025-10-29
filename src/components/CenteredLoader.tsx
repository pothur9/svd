"use client";

import React, { useState } from "react";
import Image from "next/image";

interface CenteredLoaderProps {
  message?: string;
  gifSrc?: string; // optional custom gif path, defaults to /loading.gif
}

const CenteredLoader: React.FC<CenteredLoaderProps> = ({ message, gifSrc = "/loading.gif" }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        {!imgError ? (
          <Image
            src={gifSrc}
            alt="Loading"
            width={64}
            height={64}
            unoptimized
            className="w-16 h-16"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f59e0b]"></div>
        )}
        {message ? <p className="text-gray-600 text-sm">{message}</p> : null}
      </div>
    </div>
  );
};

export default CenteredLoader;
