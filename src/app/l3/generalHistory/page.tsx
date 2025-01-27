"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";

interface User {
  _id: string;
  name: string;
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
  const levels = ["l1", "l2", "l3", "l4"]; // Static levels
  const [users, setUsers] = useState<User[]>([]); // Users array type updated
  const [selectedLevel, setSelectedLevel] = useState<string>(""); // Selected level
  const [selectedUser, setSelectedUser] = useState<string>(""); // Selected user
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null); // Store fetched user details
  const [events, setEvents] = useState<Event[]>([]); // User's calendar events

  const [showModal, setShowModal] = useState(false); // Control visibility of the modal
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // Store selected event for popup

  // Fetch users when a level is selected
  useEffect(() => {
    if (!selectedLevel) return;

    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/${selectedLevel}/users`);
        const data = await response.json();
        console.log("Fetched users:", data); // Log to verify structure
        setUsers(data); // Assuming `data` is an array of user objects
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [selectedLevel]);

  // Fetch user details and events when a user is selected
  useEffect(() => {
    if (!selectedUser) return;

    const fetchUserDetails = async () => {
      try {
        const historyResponse = await fetch(
          `/api/${selectedLevel}/history/${selectedUser}/`
        );
        const eventsResponse = await fetch(`/api/${selectedLevel}/lEvents/${selectedUser}/`);

        const [historyData, eventsData] = await Promise.all([historyResponse.json(), eventsResponse.json()]);

        setUserDetails(historyData); // Store entire user data
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [selectedUser]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true); // Show the popup
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null); // Clear selected event
  };

  return (
    <>
      <Navbar /><br />
      <div className="bg-slate-100 min-h-screen w-full"><br /><br />
        <div className="p-4 sm:p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-md mt-6">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-blue-600 mb-6">
            Search History
          </h2>

          {/* Level Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Search History:
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Select User:</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
              >
                <option value="">-- Select User --</option>
                {users.map((user, index) => (
                  <option key={index} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Event Table */}
          {selectedUser && events.length > 0 && (
            <div className="mb-4 overflow-auto">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Events:</h3>
              <table className="min-w-full bg-white text-gray-800 border border-gray-300 rounded-lg text-sm sm:text-base">
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
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">User Details:</h3>
              <ul className="list-disc ml-6 text-sm sm:text-base">
                <li><strong>ID:</strong> {userDetails._id}</li>
                <li><strong>Username:</strong> {userDetails.username}</li>
                <li><strong>History:</strong> {userDetails.history}</li>
                <li><strong>Gurus Timeline:</strong> {userDetails.gurusTimeline}</li>
                <li><strong>Special Developments:</strong> {userDetails.specialDevelopments}</li>
                <li><strong>Institutes:</strong> {userDetails.institutes}</li>
              </ul>
            </div>
          )}

          {/* Modal for Event Details */}
          {showModal && selectedEvent && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-4">
              <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  {selectedEvent.title}
                </h3>
                <p><strong>Date:</strong> {format(new Date(selectedEvent.date), "yyyy-MM-dd")}</p>
                <p><strong>Description:</strong> {selectedEvent.description}</p>
                <button
                  onClick={closeModal}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md w-full sm:w-auto"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div><br /><br />
      </div>
      <Footer />
    </>
  );
}
