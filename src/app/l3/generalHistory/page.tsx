"use client";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import '../calendar.css';

export default function UserSelection() {
  const levels = ["l1", "l2", "l3", "l4"]; // Static levels
  const [users, setUsers] = useState([]); // Users based on selected level
  const [selectedLevel, setSelectedLevel] = useState(""); // Selected level
  const [selectedUser, setSelectedUser] = useState(""); // Selected user
  const [userDetails, setUserDetails] = useState(null); // Store fetched user details
  const [events, setEvents] = useState([]); // User's calendar events
  const [calendarDate, setCalendarDate] = useState(null); // Selected date for calendar events
  const [eventDetails, setEventDetails] = useState([]); // Events for a selected date
  const [showModal, setShowModal] = useState(false); // Control visibility of the modal
  const [selectedEvent, setSelectedEvent] = useState(null); // Store selected event for popup

  // Fetch users when a level is selected
  useEffect(() => {
    if (!selectedLevel) return;

    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/${selectedLevel}/users`);
        const data = await response.json();
        console.log("Fetched users:", data);  // Log to verify structure
        setUsers(data);  // Assuming `data` is an array of user names or objects
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

        const [historyData, eventsData] = await Promise.all([
          historyResponse.json(),
          eventsResponse.json(),
        ]);

        setUserDetails(historyData); // Store entire user data
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [selectedUser]);

  const handleCalendarClick = (date) => {
    setCalendarDate(date);
    const eventsForDate = events.filter(
      (event) =>
        format(new Date(event.date), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
    );
    setEventDetails(eventsForDate);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true); // Show the popup
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null); // Clear selected event
  };

  // Check if there are events on a particular day (for red dot)
  const getTileClassName = ({ date }) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const isEventDay = events.some((event) => format(new Date(event.date), "yyyy-MM-dd") === formattedDate);
    return isEventDay ? "relative" : "";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-md mt-6">
      <h2 className="text-center text-2xl font-bold text-blue-600 mb-6">
        User Selection
      </h2>

      {/* Level Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Select Level:
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
              <option key={index} value={user._id || user}> {/* Handle string or object */}
                {user.name || user} {/* Display user name or string */}
              </option>
            ))}
          </select>
        </div>
      )}


           {/* Calendar */}
           {selectedUser && events.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-blue-600 mb-2">
            Calendar:
          </h3>
          <Calendar
            onClickDay={handleCalendarClick}
            tileClassName={getTileClassName} // Add red dot on event days
            className="bg-white text-black rounded-lg shadow-md p-4 mx-auto w-full sm:w-auto"
          />
          {calendarDate && eventDetails.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-blue-600 mb-2">
                Events on {format(calendarDate, "yyyy-MM-dd")}:
              </h4>
              {eventDetails.map((event) => (
                <p
                  key={event.id}
                  className="text-gray-700 cursor-pointer"
                  onClick={() => handleEventClick(event)}
                >
                  {event.title}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* User Details */}
      {selectedUser && userDetails && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-blue-600 mb-2">User Details:</h3>
          <ul className="list-disc ml-6">
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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">{selectedEvent.title}</h3>
            <p><strong>Date:</strong> {format(new Date(selectedEvent.date), "yyyy-MM-dd")}</p>
            <p><strong>Description:</strong> {selectedEvent.description}</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

