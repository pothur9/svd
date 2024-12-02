// components/UserDataForm.js
"use client";
import { useState, useEffect } from 'react';

export default function UserDataForm() {
  const [formData, setFormData] = useState({
    username: '',
    history: '',
    gurusTimeline: '',
    specialDevelopments: '',
    institutes: '', // Single field for all institute info
  });

  useEffect(() => {
    // Retrieve the userId from session storage and set it in formData
    const userNameFromStorage = sessionStorage.getItem('username');
    if (userNameFromStorage) {
      setFormData((prevData) => ({ ...prevData, username: userNameFromStorage }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/l1/addhistory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Data saved successfully');
        setFormData({
          username: formData.username, // Keep the userId from session storage
          history: '',
          gurusTimeline: '',
          specialDevelopments: '',
          institutes: '',
        });
      } else {
        alert('Error saving data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <textarea
        name="history"
        value={formData.history}
        onChange={handleChange}
        placeholder="History"
        required
        rows="5" // Specify rows for better visibility
      />
      <textarea
        name="gurusTimeline"
        value={formData.gurusTimeline}
        onChange={handleChange}
        placeholder="Gurus Timeline"
        required
        rows="5"
      />
      <textarea
        name="specialDevelopments"
        value={formData.specialDevelopments}
        onChange={handleChange}
        placeholder="Special Developments"
        required
        rows="5"
      />
      <textarea
        name="institutes"
        value={formData.institutes}
        onChange={handleChange}
        placeholder="Institutes (e.g., Education, Medical, etc.)"
        required
        rows="5"
      />
      
      <button type="submit">Save Data</button>
    </form>
  );
}
