"use client";
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import '../customCalendar.css';

export default function EventCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const guruName = sessionStorage.getItem('peeta');
    const decodedGuruName = decodeURIComponent(guruName);
    if (!guruName) {
      console.error('Guru name not found in session storage');
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/l2/viewevents/${decodedGuruName}`);
        if (!response.ok) throw new Error('Failed to fetch events');

        const data = await response.json();
        console.log('Fetched events:', data); // Log the events for debugging
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const eventsForDate = events.filter(
      (event) => format(new Date(event.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    setEventDetails(eventsForDate);
    setShowPopup(eventsForDate.length > 0);
  };

  const tileContent = ({ date }) => {
    const hasEvents = events.some(
      (event) => format(new Date(event.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    return hasEvents ? (
      <span className="inline-block w-2 h-2 mt-1 bg-red-500 rounded-full"></span>
    ) : null;
  };

  return (
    <div className="p-4 max-w-3xl mx-auto bg-gray-50 rounded-lg shadow-md mt-6 sm:mt-10">
      <h2 className="text-center text-2xl font-bold text-blue-600 mb-6">Event Calendar</h2>
      <Calendar
        onClickDay={handleDateClick}
        tileContent={tileContent}
        className="bg-black text-white rounded-lg shadow-md p-4 mx-auto w-full sm:w-auto custom-calendar"
        tileClassName={({ date }) =>
          `text-white font-medium ${
            selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
              ? 'bg-blue-500 text-white rounded-full'
              : 'hover:bg-gray-700'
          }`
        }
      />

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 sm:w-full max-w-md relative shadow-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              Events on {format(selectedDate, 'yyyy-MM-dd')}
            </h3>
            {eventDetails && eventDetails.length > 0 ? (
              eventDetails.map((event) => (
                <div key={event._id} className="mb-4 p-4 border-b border-gray-200">
                  <h4 className="text-lg font-medium text-blue-600">{event.title}</h4>
                  <p className="text-gray-700 mt-1">{event.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No events for this date.</p>
            )}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 mt-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
