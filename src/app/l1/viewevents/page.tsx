"use client";
import { useEffect, useState } from "react";
import Footer from "../footer/footer";
import Navbar from "../navbar/navbar";

// Define the shape of an event object
interface Event {
  _id: string;
  date: string;
  username: string;
  title: string;
  description: string;
}

export default function EventTable() {
  // Use the correct type for the events state
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const username = sessionStorage.getItem("username");

      if (!username) {
        console.error("Username is not available");
        return;
      }

      try {
        const response = await fetch(`/api/l1/viewevents/${username}`);
        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <Navbar />
      <br /><br /><br />
      <div className="flex-grow">
        <div className="p-4 max-w-4xl mx-auto bg-white rounded-lg shadow-lg mt-10">
          <h2 className="text-center text-2xl font-bold text-blue-600 mb-6">
            Event List
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-gray-700">
                    Date
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-gray-700">
                    Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-gray-700">
                    Title
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-gray-700">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.length > 0 ? (
                  events.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-4 py-2 text-black">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-black">
                        {event.username}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-black">
                        {event.title}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-black">
                        {event.description}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500 py-4">
                      No events found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
