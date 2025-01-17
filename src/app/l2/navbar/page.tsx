"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link from Next.js

function Navbar() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch('/api/totalUsers');
        if (!response.ok) throw new Error('Failed to fetch user count');

        const data = await response.json();
        setTotalUsers(data.totalUsers); // Set the total user count
      } catch (error) {
        console.error('Error fetching total users:', error);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div >
      

      <div className="navbar bg-base-100 fixed">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              {/* Links to other pages */}
              <li><Link href="/l2/dashboard" className="text-lg">Home</Link></li>
              <li><Link href="/l2/addevent" className="text-lg">Add Event</Link></li>
              <li><Link href="/l2/viewevents" className="text-lg">Event Calendar</Link></li>
              <li><Link href="/l2/history" className="text-lg">History</Link></li>
              <li><Link href="/l2/addhistory" className="text-lg">Add History</Link></li>
              <li><Link href="/l2/generalhistory" className="text-lg">General History</Link></li>
            </ul>
          </div>
          <Link href="/" className="btn btn-ghost text-xl">SVD</Link> {/* Logo Link */}

          
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {/* Links to other pages */}
            <li><Link href="/l2/dashboard" className="text-lg">Home</Link></li>
            <li><Link href="/l2/addevent" className="text-lg">Add Event</Link></li>
            <li><Link href="/l2/viewevents" className="text-lg">Event Calendar</Link></li>         
            <li><Link href="/l2/history" className="text-lg">History</Link></li>
            <li><Link href="/l2/addhistory" className="text-lg">Add History</Link></li>
            <li><Link href="/l2/generalhistory" className="text-lg">General History</Link></li>
          </ul>
        </div>
     
        <div className="navbar-end">
                   {/* Display total users count at the top */}
      {totalUsers !== null && (
        <div className=" text-white p-2 text-center ">
          Total Users: {totalUsers}
        </div>
      )}
          <Link href="/l2/login" className="btn">
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
