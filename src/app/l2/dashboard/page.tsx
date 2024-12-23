"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../navbar/page';

export default function Dashboard() {
    const [memberData, setMemberData] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        
        if (!userId) {
            router.push('/l2/login');
            return;
        }

        async function fetchMemberData() {
            try {
                const response = await fetch(`/api/l2/dashboard/${userId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                
                const data = await response.json();
                
                // Store peeta name in session storage
                sessionStorage.setItem('peeta', data.peeta);
                sessionStorage.setItem('username', data.name);

                // Include peeta in member data
                setMemberData(data);
            } catch (error) {
                console.error('Error fetching member data:', error);
            }
        }

        fetchMemberData();
    }, [router]);

    if (!memberData) return <p>Loading...</p>;

    return (
        <>
            <Navbar />
            <div className="bg-slate-100 ">
        <br />
        <br />
        {/* Info Cards */}
        <div className="p-6 max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-800">L2 Users</h2>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {memberData.l2UserCount}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Users matching your details in L2
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-800">L3 Users</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {memberData.l3UserCount}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total users in L3</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-800">Total Users</h2>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {memberData.totalUserCount}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Combined total of L2 and L3 users
            </p>
          </div>
        </div>
        {/* Green Card with Member Details */}
        <div
          className="bg-green-700 flex items-center p-4 shadow-lg relative mx-auto max-w-[90%] sm:max-w-[600px]"
          style={{ height: "200px" }}
        >
          <div className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="rounded-full border-4 border-white shadow-md"
            />
          </div>
          <div className="ml-4 flex-grow">
            <h1 className="text-xl sm:text-2xl font-bold text-white-600">
              Sanathanaveershivadharma
            </h1>
            <p className="text-white text-sm font-semibold ">
              ------------------
            </p>
            <p className="text-white text-sm">
              Professional description or tagline goes here
            </p>
          </div>
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 sm:top-1/2 sm:right-4 sm:-translate-y-1/2 sm:mt-[0px] mt-[90px]">
            <Image
              src={memberData.imageUrl}
              alt="Secondary Logo"
              width={100} // Smaller size for mobile
              height={100} // Smaller size for mobile
              className="rounded-full border-4 border-green-700 shadow-lg " // Larger size for larger screens
            />
          </div>
        </div>

        {/* White Section with Dynamic Data */}
        <div
          className="bg-white p-6 shadow-lg mx-auto max-w-[90%] sm:max-w-[600px]"
          style={{ height: "300px" }}
        >
          <p className="text-black text-base font-semibold mt-4">
            Name: {memberData.name}
          </p>
          <p className="text-black text-base font-semibold mt-4">
            Date of Birth: {memberData.dob}
          </p>
          <p className="text-black text-base font-semibold mt-2">
            Membership No: {memberData.userId}
          </p>
          <p className="text-black text-base font-semibold mt-2">
            Phone: {memberData.contactNo}
          </p>
          <p className="text-black text-base font-semibold mt-2">
            Peeta: {memberData.peeta || "N/A"}
          </p>
          <p className="text-black text-base font-semibold mt-2">
            Guru: {memberData.dhekshaGuru || "N/A"}
          </p>
          <p className="text-black text-base font-semibold mt-2">
            Address: {memberData.address}
          </p>
        </div>
        <br/><br/>
      </div>
        </>
    );
}
