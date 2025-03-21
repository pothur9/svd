"use client";
import { useEffect, useState } from 'react';
import Footer from '../footer/footer';
import Navbar from '../navbar/navbar';

// Define the type for the user data
interface UserData {
    username: string;
    history: string;
    gurusTimeline: string;
    specialDevelopments: string;
    institutes: string;
}

export default function UserDataDisplay() {
    // State types: userData is either a UserData object or null, error is a string or null
    const [userData, setUserData] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState<boolean>(false); // To track if we're on the client side

    useEffect(() => {
        setIsClient(true); // Set to true once on the client side
    }, []);

    useEffect(() => {
        if (isClient) {
            const username = sessionStorage.getItem('guru'); // Fetch userId from session storage
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`/api/l3/history/${username}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }
                    const data: UserData = await response.json(); // Type the fetched data
                    setUserData(data);
                } catch (error) {
                    if (error instanceof Error) {
                        setError(error.message);
                    }
                    console.error('Error fetching user data:', error);
                }
            };

            if (username) {
                fetchUserData();
            }
        }
    }, [isClient]);

    if (error) {
        return <div className="text-red-600 font-semibold p-4">Error: {error}</div>;
    }

    if (!userData) {
        return <div className="text-gray-600 p-4">Loading...</div>;
    }

    return (
        <>
            <Navbar /><br />
            <div className="bg-slate-100 min-h-screen w-full"><br /><br />
                <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8 mb-12">
                    <h2 className="text-3xl font-extrabold text-blue-800 mb-6 border-b-2 border-gray-300 pb-4">User Data Overview</h2>
                    <article className="space-y-8">
                        {/* User ID */}
                        <section className="border-l-4 border-blue-400 pl-4">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">User Name</h3>
                            <p className="text-gray-900 text-lg font-medium">{userData.username}</p>
                        </section>

                        {/* History */}
                        <section className="border-l-4 border-blue-400 pl-4">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">History</h3>
                            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{userData.history}</p>
                        </section>

                        {/* Gurus Timeline */}
                        <section className="border-l-4 border-blue-400 pl-4">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Gurus Timeline</h3>
                            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{userData.gurusTimeline}</p>
                        </section>

                        {/* Special Developments */}
                        <section className="border-l-4 border-blue-400 pl-4">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Special Developments</h3>
                            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{userData.specialDevelopments}</p>
                        </section>

                        {/* Institutes */}
                        <section className="border-l-4 border-blue-400 pl-4">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Institutes</h3>
                            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{userData.institutes}</p>
                        </section>
                    </article>
                </div>
            </div>
            <Footer />
        </>
    );
}
