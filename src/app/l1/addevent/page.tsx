"use client";
import { useState, useEffect } from 'react';
import Navbar from '../navbar/navbar';
import Footer from '../footer/footer';

export default function AddEvent() {
  const [formData, setFormData] = useState({ date: '', title: '', description: '', username: '' });

  // Fetch username from session storage when the component mounts
  useEffect(() => {
    const username = sessionStorage.getItem('username');
    if (username) {
      setFormData((prevData) => ({ ...prevData, username }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/l1/addevent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Event added successfully');
        setFormData({ date: '', title: '', description: '', username: formData.username });
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
      <div className="bg-slate-100">
      <br/>
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8 mt-8">
        <h2 className="text-3xl font-extrabold text-blue-600 text-center mb-6">Create New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
          <div className="flex flex-col">
            <label className="text-gray-800 font-semibold mb-2">Event Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-800 font-semibold mb-2">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-300"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-800 font-semibold mb-2">Event Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter event description"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition ease-in-out duration-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Event
          </button>
        </form>
      </div>
      <br/> <br/> <br/>
      </div>
      <Footer/>
    </>
  );
}
