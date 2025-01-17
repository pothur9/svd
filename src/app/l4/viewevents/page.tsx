"use client";
import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import Footer from "@/app/l1/footer/footer";
export default function EventTable() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const guruName = sessionStorage.getItem("guru");
    const decodedGuruName = decodeURIComponent(guruName);

    if (!guruName) {
      console.error("Guru name not found in session storage");
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/l3/viewevents/${decodedGuruName}`);
        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        console.log("Fetched events:", data); // Log the events for debugging
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <> <Navbar/><br/>
    <div className="bg-slate-100 min-h-screen w-full "><br/><br/>
     
        <h2 className="text-center text-2xl font-bold text-blue-600 mb-6 mt-14">Event List</h2>
    <div className="p-4 max-w-3xl mx-auto bg-white rounded-lg shadow-md mt-4 sm:mt-10">
    
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 shadow-md rounded-lg text-left bg-white text-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2">User Name</th>
              <th className="border border-gray-200 px-4 py-2">Date</th>
              <th className="border border-gray-200 px-4 py-2">Title</th>
              <th className="border border-gray-200 px-4 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">{event.userName}</td>
                  <td className="border border-gray-200 px-4 py-2">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">{event.title}</td>
                  <td className="border border-gray-200 px-4 py-2">{event.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-4">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    <Footer/>
    </>
  );
}
