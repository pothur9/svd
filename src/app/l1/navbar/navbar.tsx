import React from 'react';
import Link from 'next/link'; // Import Link from Next.js

function Navbar() {
  return (
    <div>
      <div className="navbar bg-base-100">
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
              <li><Link href="/l1/dashboard" className="text-lg">Home</Link></li>
              <li><Link href="/l1/addevent" className="text-lg">Add Event</Link></li>
              <li><Link href="/l1/viewevents" className="text-lg">Event Calendar</Link></li>
              <li><Link href="/l1/history" className="text-lg">History</Link></li>
              <li><Link href="/l1/addhistory" className="text-lg">Add History</Link></li>
            </ul>
          </div>
          <Link href="/" className="btn btn-ghost text-xl">SVD</Link> {/* Logo Link */}
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {/* Links to other pages */}
            <li><Link href="/l1/dashboard" className="text-lg">Home</Link></li>
            <li><Link href="/l1/addevent" className="text-lg">Add Event</Link></li>
            <li><Link href="/l1/viewevents" className="text-lg">Event Calendar</Link></li>         
            <li><Link href="/l1/history" className="text-lg">History</Link></li>
            <li><Link href="/l1/addhistory" className="text-lg">Add History</Link></li>
          </ul>
        </div>
        <div className="navbar-end">
          <Link href="/l1/login" className="btn">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
