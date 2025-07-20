"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

interface UserData {
  name: string;
  userId: string;
  contactNo: string;
  dob?: string;
  address?: string;
  peeta?: string;
  dhekshaGuru?: string;
  imageUrl: string;
}

export default function CardPreview() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!userId) return;
    // Fetch user data from your API
    fetch(`/api/l2/dashboard/${userId}`)
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch(() => setUserData(null));
  }, [userId]);

  if (!userData) return <div>Loading...</div>;

  return (
    <div
      className="flex flex-row"
      style={{
        width: '174mm', // 85mm + 85mm + 4mm gap
        height: '55mm',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        background: '#f3f4f6',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* Front Card */}
      <div
        className="flex-shrink-0"
        style={{
          width: '85mm',
          height: '55mm',
          background: '#fff',
          color: '#000',
          position: 'relative',
          zIndex: 1,
          boxSizing: 'border-box',
        }}
      >
        <div
          className="rounded-xl w-full h-full shadow-lg overflow-hidden flex flex-col"
          style={{ backgroundColor: '#fff', color: '#000', boxSizing: 'border-box' }}
        >
          {/* Orange Header Section */}
          <div
            className="p-3 flex items-center"
            style={{ backgroundColor: '#ea580c', color: '#fff', boxSizing: 'border-box' }}
          >
            <div className="relative w-[40px] h-[40px]">
              <Image
                src="/logomain1.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1
              className="text-sm font-bold ml-2"
              style={{ color: '#fff', backgroundColor: '#ea580c', boxSizing: 'border-box' }}
            >
              Sanathana Veera Shiva <br/>Lingayatha Dharma
            </h1>
          </div>
          {/* Content Section */}
          <div
            className="p-3 flex justify-between flex-1"
            style={{ backgroundColor: '#fff', color: '#000', boxSizing: 'border-box' }}
          >
            {/* Left side - Text */}
            <div className="text-black" style={{ color: '#000', backgroundColor: '#fff', boxSizing: 'border-box' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: '#000', backgroundColor: '#fff', boxSizing: 'border-box' }}>Name: {userData.name}</p>
              <p className="text-sm font-semibold mb-1" style={{ color: '#000', backgroundColor: '#fff', boxSizing: 'border-box' }}>ID: {userData.userId}</p>
              <p className="text-sm font-semibold" style={{ color: '#000', backgroundColor: '#fff', boxSizing: 'border-box' }}>Peeta: {userData.peeta || "N/A"}</p>
            </div>
            {/* Right side - Image */}
            <div className="flex flex-col items-center" style={{ backgroundColor: '#fff', boxSizing: 'border-box' }}>
              <div className="relative w-[80px] h-[80px] -mt-6" style={{ backgroundColor: '#fff', boxSizing: 'border-box' }}>
                <Image
                  src={userData.imageUrl && userData.imageUrl.startsWith("http") ? userData.imageUrl : "/default-avatar.jpg"}
                  alt={`${userData.name}'s profile`}
                  fill
                  className="rounded-md object-cover border-2"
                  style={{ borderColor: '#ea580c', backgroundColor: '#fff', boxSizing: 'border-box' }}
                  onError={(e) => {
                    // @ts-expect-error - next/image doesn't properly type onError event
                    e.target.src = "/default-avatar.jpg";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Gap between cards */}
      <div style={{ width: '4mm', height: '55mm', flexShrink: 0 }} />
      {/* Back Card */}
      <div
        className="flex-shrink-0"
        style={{
          width: '85mm',
          height: '55mm',
          background: '#fff',
          color: '#000',
          position: 'relative',
          zIndex: 1,
          boxSizing: 'border-box',
        }}
      >
        {/* Watermark Logo */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 2,
            backgroundColor: 'transparent',
          }}
        >
          <Image
            src="/logomain1.png"
            alt="Logo Watermark"
            fill
            className="object-contain"
            style={{ 
              opacity: 0.20, 
              backgroundColor: 'transparent',
              maxWidth: '70%',
              maxHeight: '70%'
            }}
          />
        </div>
        <div
          className="rounded-xl w-full h-full shadow-lg overflow-hidden flex flex-col"
          style={{ backgroundColor: '#fff', color: '#000', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}
        >
          {/* Orange Header Section (same as front) */}
          <div
            className="p-3 flex items-center z-10 relative"
            style={{ backgroundColor: '#ea580c', color: '#fff', boxSizing: 'border-box' }}
          ></div>
          {/* Content Section (above watermark) */}
          <div
            className="px-5 pb-5 pt-0 w-full h-full z-10 relative flex flex-row items-center justify-between flex-1"
            style={{ backgroundColor: '#fff', color: '#000', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}
          >
            <div className="flex-1" style={{ backgroundColor: '#fff', color: '#000', boxSizing: 'border-box' }}>
              <div className="grid grid-cols-1 gap-2" style={{ backgroundColor: '#fff', color: '#000', boxSizing: 'border-box' }}>
                <p className="text-xs font-semibold" style={{ color: '#000', backgroundColor: '#fff', boxSizing: 'border-box' }}>DOB: {
                  userData.dob && !isNaN(Date.parse(userData.dob))
                    ? new Date(userData.dob).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "N/A"
                }</p>
                <p className="text-xs font-semibold" style={{ color: '#000', backgroundColor: '#fff', boxSizing: 'border-box' }}>Phone: {userData.contactNo}</p>
                <p className="text-xs font-semibold" style={{ color: '#000', backgroundColor: '#fff', boxSizing: 'border-box' }}>Guru: {userData.dhekshaGuru || "N/A"}</p>
                <p className="text-xs font-semibold" style={{ color: '#000', backgroundColor: '#fff', boxSizing: 'border-box' }}>Address: {userData.address || "N/A"}</p>
              </div>
            </div>
            {/* QR Code for back side, right side */}
            <div className="flex items-center justify-end ml-4" style={{ backgroundColor: '#fff', boxSizing: 'border-box' }}>
              <QRCodeSVG
                value={JSON.stringify({
                  name: userData.name,
                  id: userData.userId,
                  peeta: userData.peeta,
                  dob: userData.dob,
                  phone: userData.contactNo,
                  guru: userData.dhekshaGuru
                })}
                size={130}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 