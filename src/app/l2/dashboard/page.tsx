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
            <div className="bg-gradient-to-b from-slate-50 to-blue-100 min-h-screen py-6 sm:py-10">
                <div className="max-w-lg mx-auto p-4 sm:p-6 bg-white shadow-xl rounded-xl text-gray-800 relative">
                    <div className="absolute -top-10 sm:-top-12 left-1/2 transform -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full shadow-md flex items-center justify-center">
                        <Image 
                            src="/logo.png" 
                            alt="Logo" 
                            width={80} 
                            height={80} 
                            className="rounded-full"
                        />
                    </div>
                    <div className="text-center mt-12 sm:mt-16 mb-4 sm:mb-6">
                        <h1 className="text-xl sm:text-2xl font-bold text-blue-600">Sanathanaveershivadharma</h1>
                        <p className="text-xs sm:text-sm text-gray-500">Upadhyaya Marg, New Delhi - 110002</p>
                    </div>
                    <div className="flex justify-center mt-4 sm:mt-6">
                        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-blue-600 shadow-md">
                            <Image
                                src={memberData.imageUrl}
                                alt="Profile Image"
                                width={112}
                                height={112}
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div className="mt-6 sm:mt-8 bg-gray-50 p-4 sm:p-6 rounded-lg shadow-inner">
                        <div className="space-y-3 sm:space-y-4 text-gray-700">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-600">Name:</span>
                                <span className="text-sm sm:text-base">{memberData.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-600">Phone Number:</span>
                                <span className="text-sm sm:text-base">{memberData.contactNo}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-600">Membership No:</span>
                                <span className="text-sm sm:text-base">{memberData.userId}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-600">Peeta:</span>
                                <span className="text-sm sm:text-base">{memberData.peeta}</span> {/* Display Peeta */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
