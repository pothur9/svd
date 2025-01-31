"use client";
import { useState } from 'react';
import Navbar from '../navbar/page';
import Footer from '../footer/page';
import { ChangeEvent , FormEvent } from "react"; // Import ChangeEvent

export default function AddEvent() {
  const [formData, setFormData] = useState({ date: '', title: '', description: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get the username from session storage
    const username = sessionStorage.getItem('username');
    if (!username) {
      alert("UserId not found in session. Please log in again.");
      return;
    }

    // Add username to the form data
    const dataToSubmit = { ...formData, username };

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
    <div className="bg-slate-100 min-h-screen w-full">
      <Navbar />
      <br/>  <br/>  <br/>  <br/>  <br/>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white text-black"
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
     
      </div>
      <Footer/>
    </>
  );
}
