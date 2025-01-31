import React, { useEffect, useState } from "react";
import Link from "next/link";

function Navbar() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);

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

    fetchUserCount();
    const interval = setInterval(fetchUserCount, 600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="navbar bg-white text-black fixed border-b shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden text-black"
            >
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
              <li>
                <Link href="/l4/dashboard" className="text-lg">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/l4/viewevents" className="text-lg">
                  Event Calendar
                </Link>
              </li>
              <li>
                <Link href="/l4/viewhistory" className="text-lg">
                  History
                </Link>
              </li>
              <li>
                <Link href="/l4/generalHistory" className="text-lg">
                  General History
                </Link>
              </li>
            </ul>
          </div>
          <Link href="/" className="btn btn-ghost text-xl text-black">
            SVD
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/l4/dashboard" className="text-lg text-black">
                Home
              </Link>
            </li>
            <li>
              <Link href="/l4/viewevents" className="text-lg text-black">
                Event Calendar
              </Link>
            </li>
            <li>
              <Link href="/l4/viewhistory" className="text-lg text-black">
                History
              </Link>
            </li>
            <li>
              <Link href="/l4/generalHistory" className="text-lg text-black">
                General History
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end">
          {totalUsers !== null && (
            <div className="text-black p-2 text-center">
              Total Users: {totalUsers}
            </div>
          )}
          <Link href="/l4/login" className="btn bg-gray-100 text-black">
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
