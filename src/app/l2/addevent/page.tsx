"use client";
import { useState } from 'react';
import Navbar from '../navbar/page';

export default function AddEvent() {
  const [formData, setFormData] = useState({ date: '', title: '', description: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the username from session storage
    const userName = sessionStorage.getItem('username');
    if (!userName) {
      alert("UserId not found in session. Please log in again.");
      return;
    }

    // Add username to the form data
    const dataToSubmit = { ...formData, userName };

    try {
      const response = await fetch('/api/l2/addevent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      if (response.ok) {
        alert('Event added successfully');
        setFormData({ date: '', title: '', description: '' });
      } else {
        alert('Error adding event');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Add New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Event Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Event Title"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Event Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Event Description"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Event
          </button>
        </form>
      </div>
    </>
  );
}
