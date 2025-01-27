"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

interface User {
  _id: string;
  name?: string;
  username?: string;
}

interface UserDetails {
  _id: string;
  username: string;
  history: string;
  gurusTimeline: string;
  specialDevelopments: string;
  institutes: string;
}

interface Event {
  id: string;
  date: string;
  username: string;
  title: string;
  description: string;
}

export default function UserSelection() {
  const levels = ["l1", "l2", "l3", "l4"] as const;
  const [users, setUsers] = useState<User[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!selectedLevel) return;

    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/${selectedLevel}/users`);
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [selectedLevel]);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchUserDetails = async () => {
      try {
        const historyResponse = await fetch(
          `/api/${selectedLevel}/history/${selectedUser}/`
        );
        const eventsResponse = await fetch(
          `/api/${selectedLevel}/lEvents/${selectedUser}/`
        );

        const [historyData, eventsData]: [UserDetails, Event[]] = await Promise.all([
          historyResponse.json(),
          eventsResponse.json(),
        ]);

        setUserDetails(historyData);
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [selectedUser]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <div className="bg-slate-200 min-h-screen">
        <Navbar />
        <br /> <br /> <br />
        <div className="p-6 max-w-5xl mx-auto bg-gray-50 rounded-lg shadow-lg mt-8">
          <h2 className="text-center text-3xl font-bold text-blue-700 mb-8">
            User Selection
          </h2>

          {/* Level Dropdown */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Select Level:
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">-- Select Level --</option>
              {levels.map((level, index) => (
                <option key={index} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* User Dropdown */}
          {users.length > 0 && (
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Select User:
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">-- Select User --</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name || user.username}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Event Table */}
          {selectedUser && events.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">
                Events:
              </h3>
              <table className="w-full border-collapse border border-gray-300 rounded-lg bg-white text-gray-800">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <td className="px-4 py-2">
                        {format(new Date(event.date), "yyyy-MM-dd")}
                      </td>
                      <td className="px-4 py-2">{event.username}</td>
                      <td className="px-4 py-2">{event.title}</td>
                      <td className="px-4 py-2">{event.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* User Details */}
          {selectedUser && userDetails && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">
                User Details:
              </h3>
              <div className="bg-white p-4 rounded-lg shadow">
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li>
                    <strong>ID:</strong> {userDetails._id}
                  </li>
                  <li>
                    <strong>Username:</strong> {userDetails.username}
                  </li>
                  <li>
                    <strong>History:</strong> {userDetails.history}
                  </li>
                  <li>
                    <strong>Gurus Timeline:</strong>{" "}
                    {userDetails.gurusTimeline}
                  </li>
                  <li>
                    <strong>Special Developments:</strong>{" "}
                    {userDetails.specialDevelopments}
                  </li>
                  <li>
                    <strong>Institutes:</strong> {userDetails.institutes}
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Modal for Event Details */}
          {showModal && selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">
                  {selectedEvent.title}
                </h3>
                <p className="text-gray-700">
                  <strong>Date:</strong>{" "}
                  {format(new Date(selectedEvent.date), "yyyy-MM-dd")}
                </p>
                <p className="text-gray-700">
                  <strong>Description:</strong> {selectedEvent.description}
                </p>
                <button
                  onClick={closeModal}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
