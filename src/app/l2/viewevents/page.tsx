"use client";
import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import "../customCalendar.css";
import Navbar from "../navbar/page";
import Footer from "../footer/page";

// Define the structure of an event
interface Event {
  _id: string;
  date: string;
  username: string;
  title: string;
  description: string;
}

export default function EventCalendar() {
  const [events, setEvents] = useState<Event[]>([]); // Type for events state

  useEffect(() => {
    const guruName = sessionStorage.getItem("peeta");
    const decodedGuruName = decodeURIComponent(guruName || "");
    if (!guruName) {
      console.error("Guru name not found in session storage");
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/l2/viewevents/${decodedGuruName}`);
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
    <>
      <Navbar />
      <br />
      <br />

      <div className="bg-slate-100 min-h-screen w-full">
        <br />
        <div className="p-4 max-w-5xl mx-auto bg-gray-50 rounded-lg shadow-md mt-6 sm:mt-10">
          <h2 className="text-center text-2xl font-bold text-blue-600 mb-6">
            Event Calendar
          </h2>

          {events.length > 0 ? (
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-left border-collapse border border-gray-300 bg-white shadow-lg text-sm sm:text-base">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 text-black">
                      Date
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 text-gray-800">
                      Name
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 text-gray-800">
                      Title
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 text-gray-800">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event._id}>
                      <td className="border border-gray-300 px-2 sm:px-4 py-2 text-black">
                        {format(new Date(event.date), "yyyy-MM-dd")}
                      </td>
                      <td className="border border-gray-300 px-2 sm:px-4 py-2 text-black">
                        {event.username}
                      </td>
                      <td className="border border-gray-300 px-2 sm:px-4 py-2 text-black">
                        {event.title}
                      </td>
                      <td className="border border-gray-300 px-2 sm:px-4 py-2 text-black">
                        {event.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-600 mt-6">
              No events available.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
