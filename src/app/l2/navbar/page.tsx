"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Navbar() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch("/api/totalUsers");
        if (!response.ok) throw new Error("Failed to fetch user count");

        const data = await response.json();
        setTotalUsers(data.totalUsers);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    // Fetch the initial count
    fetchUserCount();

    // Fetch every 10 minutes (600000 ms)
    const interval = setInterval(fetchUserCount, 600000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handleLogout = () => {
    // Clear all session storage
    sessionStorage.clear();
    // Redirect to home page
    router.push('/');
  };

  return (
    <div>
      <div className="navbar bg-white text-black fixed">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white text-black rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li><Link href="/l2/dashboard" className="text-lg">Home</Link></li>
               <li><Link href="/l2/profile" className="text-lg">Profile</Link></li>
              <li><Link href="/l2/addevent" className="text-lg">Add Event</Link></li>
              <li><Link href="/l2/viewevents" className="text-lg">Event Calendar</Link></li>
              <li><Link href="/l2/history" className="text-lg">History</Link></li>
              <li><Link href="/l2/addhistory" className="text-lg">Add History</Link></li>
              <li><Link href="/l2/generalhistory" className="text-lg">General History</Link></li>
            </ul>
          </div>
          <Link href="/l2/dashboard" className="btn btn-ghost text-xl">SVD</Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><Link href="/l2/dashboard" className="text-lg">Home</Link></li>
            <li><Link href="/l2/profile" className="text-lg">Profile</Link></li>
            <li><Link href="/l2/addevent" className="text-lg">Add Event</Link></li>
            <li><Link href="/l2/viewevents" className="text-lg">Event Calendar</Link></li>
            <li><Link href="/l2/history" className="text-lg">History</Link></li>
            <li><Link href="/l2/addhistory" className="text-lg">Add History</Link></li>
            <li><Link href="/l2/generalhistory" className="text-lg">General History</Link></li>
          </ul>
        </div>

        <div className="navbar-end">
          {totalUsers !== null && (
            <div className="text-black p-2 text-center">
              Total Users: {totalUsers}
            </div>
          )}
          <button onClick={handleLogout} className="btn">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
