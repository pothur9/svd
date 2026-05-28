"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// SVG Icon Components
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" />
  </svg>
);

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
  </svg>
);

// Akshay Patre (Savings / Vessel / Plate icon)
const AkshayPatreIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}
  >
    {/* Pot body */}
    <path d="M4 10h16" />
    <path d="M6 10c0 6 2 10 6 10s6-4 6-10" />

    {/* Pot top (lid) */}
    <path d="M8 6h8" />
    <path d="M10 4h4" />

    {/* Handles */}
    <path d="M4 10c0 2 1 3 2 3" />
    <path d="M20 10c0 2-1 3-2 3" />
  </svg>
);

// JKayaka (Job Seekers & Donors — briefcase/handshake icon)
const JKayakaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

// Samsara Vadhu Vara (Marriage / Couple icon — rings)
const SamsaraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
    <circle cx="8" cy="12" r="4" /><circle cx="16" cy="12" r="4" />
  </svg>
);

// Purohita ID (Priest / Book icon)
const PurohitaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

// Self Help Group (community / users icon)
const SelfHelpGroupIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// Wallet icon
const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);

const newNavItems = [
  {
    label: 'Akshaya Patra',
    href: '/l3/coming-soon?feature=Akshay+Patre',
    Icon: AkshayPatreIcon,
  },
  {
    label: 'JKayaka',
    href: '/l3/coming-soon?feature=JKayaka+%28Job+Seekers+%26+Donors%29',
    Icon: JKayakaIcon,
  },
  {
    label: 'Samsara Vadhu Vara',
    href: '/l3/coming-soon?feature=Samsara+Vadhu+Vara',
    Icon: SamsaraIcon,
  },
  {
    label: 'Purohita ID',
    href: '/l3/coming-soon?feature=Purohita+ID',
    Icon: PurohitaIcon,
  },
  {
    label: 'Self Help Group',
    href: '/l3/coming-soon?feature=Self+Help+Group',
    Icon: SelfHelpGroupIcon,
  },
  {
    label: 'Wallet',
    href: '/l3/wallet',
    Icon: WalletIcon,
  },
];

function Navbar() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch('/api/totalUsers');
        if (!response.ok) throw new Error('Failed to fetch user count');

        const data = await response.json();
        setTotalUsers(data.totalUsers);
      } catch (error) {
        console.error('Error fetching total users:', error);
      }
    };

    fetchUserCount();
    const interval = setInterval(fetchUserCount, 600000);

    return () => clearInterval(interval);
  }, []);

  // Close "More" dropdown on outside click
  useEffect(() => {
    const handler = () => setMoreMenuOpen(false);
    if (moreMenuOpen) {
      document.addEventListener('click', handler);
    }
    return () => document.removeEventListener('click', handler);
  }, [moreMenuOpen]);

  const handleLogout = () => {
    // Clear all session storage
    sessionStorage.clear();
    if (typeof window !== 'undefined') {
      try { localStorage.removeItem('svd_auth_user'); } catch { }
    }
    // Redirect to home page
    router.push('/');
  };

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#ffffff', paddingTop: 'env(safe-area-inset-top, 12px)' }}>
      <div className="navbar shadow-md" style={{ backgroundColor: '#ffffff', color: '#000000', borderBottom: '1px solid #f0f0f0' }}>
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="lg:hidden" style={{
              marginLeft: '6px',
              background: 'linear-gradient(135deg, #ea580c, #c2410c)',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(234,88,12,0.35)',
            }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#ffffff"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </div>
            {/* Mobile dropdown menu */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-60 p-2 shadow"
            >
              <li>
                <Link href="/l3/dashboard" className="text-lg text-black">
                  <HomeIcon /> Home
                </Link>
              </li>
              <li>
                <Link href="/l3/viewevents" className="text-lg text-black">
                  <CalendarIcon /> Event Calendar
                </Link>
              </li>
              <li>
                <Link href="/l3/viewhistory" className="text-lg text-black">
                  <HistoryIcon /> History
                </Link>
              </li>
              <li>
                <Link href="/l3/generalHistory" className="text-lg text-black">
                  <ClipboardIcon /> General History
                </Link>
              </li>
              {/* New items in mobile */}
              <li className="menu-title"><span className="text-xs text-gray-500 uppercase tracking-wider">More Features</span></li>
              {newNavItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-base text-black flex items-center gap-1">
                    <item.Icon /> {item.label}
                  </Link>
                </li>
              ))}
              {/* Divider */}
              <li style={{ borderTop: '1px solid #e5e7eb', margin: '0.25rem 0' }} />
              {/* Logout */}
              <li>
                <button
                  onClick={handleLogout}
                  className="text-base flex items-center gap-1 w-full"
                  style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: '8px', fontWeight: 600 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                  Logout
                </button>
              </li>
            </ul>
          </div>
          <Link href="/l3/dashboard" className="btn btn-ghost text-xl">SVD</Link>
        </div>

        {/* Desktop nav */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 flex-nowrap">
            <li>
              <Link href="/l3/dashboard" className="text-sm text-black flex items-center gap-1">
                <HomeIcon /> Home
              </Link>
            </li>
            <li>
              <Link href="/l3/viewevents" className="text-sm text-black flex items-center gap-1">
                <CalendarIcon /> Event Calendar
              </Link>
            </li>
            <li>
              <Link href="/l3/viewhistory" className="text-sm text-black flex items-center gap-1">
                <HistoryIcon /> History
              </Link>
            </li>
            <li>
              <Link href="/l3/generalHistory" className="text-sm text-black flex items-center gap-1">
                <ClipboardIcon /> General History
              </Link>
            </li>

            {/* "More" dropdown for new features */}
            <li style={{ position: 'relative' }}>
              <button
                onClick={(e) => { e.stopPropagation(); setMoreMenuOpen((v) => !v); }}
                className="text-sm text-black flex items-center gap-1"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px' }}>
                  <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
                </svg>
                More
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {moreMenuOpen && (
                <ul
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    zIndex: 999,
                    background: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                    minWidth: '220px',
                    padding: '0.5rem 0',
                    listStyle: 'none',
                    margin: 0,
                    border: '1px solid #f0f0f0',
                  }}
                >
                  {newNavItems.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setMoreMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '0.6rem 1.2rem',
                          color: '#1e293b',
                          fontWeight: 500,
                          fontSize: '0.92rem',
                          textDecoration: 'none',
                          transition: 'background 0.15s',
                          borderRadius: '8px',
                          margin: '0 0.25rem',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#fff7f0')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span style={{ color: '#ea580c', display: 'flex', alignItems: 'center' }}>
                          <item.Icon />
                        </span>
                        <span>{item.label}</span>
                        {item.label !== 'Wallet' && (
                          <span style={{
                            marginLeft: 'auto',
                            fontSize: '0.65rem',
                            background: 'linear-gradient(90deg, #ea580c, #f97316)',
                            color: '#fff',
                            borderRadius: '999px',
                            padding: '1px 7px',
                            fontWeight: 700,
                            letterSpacing: '0.03em',
                          }}>
                            Soon
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                  {/* Divider */}
                  <li style={{ borderTop: '1px solid #f0f0f0', margin: '0.25rem 0' }} />
                  {/* Logout in 3-dots dropdown */}
                  <li>
                    <button
                      onClick={() => { setMoreMenuOpen(false); handleLogout(); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '0.6rem 1.2rem',
                        color: '#dc2626',
                        fontWeight: 500,
                        fontSize: '0.92rem',
                        transition: 'background 0.15s',
                        borderRadius: '8px',
                        margin: '0 0.25rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#fff1f2')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}>
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" x2="9" y1="12" y2="12" />
                        </svg>
                      </span>
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>

        <div className="navbar-end">
          {totalUsers !== null && (
            <div style={{ color: '#000', padding: '0.5rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
              Total Users: {totalUsers}
            </div>
          )}
          <Link
            href="/l3/wallet"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #ea580c, #f97316)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.4rem 1rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'none',
              fontSize: '0.9rem',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
            Wallet
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
