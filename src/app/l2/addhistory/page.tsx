"use client";
import { useState, useEffect } from "react";
import Navbar from "../navbar/page";
import Footer from "../footer/page";

export default function UserDataForm() {
  const [formData, setFormData] = useState({
    username: "",
    history: "",
    gurusTimeline: "",
    specialDevelopments: "",
    institutes: "", // Single field for all institute info
  });

  useEffect(() => {
    // Retrieve the userId from session storage and set it in formData
    const userNameFromStorage = sessionStorage.getItem("username");
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
      const response = await fetch("/api/l2/addhistory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Data saved successfully");
        setFormData({
          username: formData.username, // Keep the userId from session storage
          history: "",
          gurusTimeline: "",
          specialDevelopments: "",
          institutes: "",
        });
      } else {
        alert("Error saving data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
    <Navbar/><br/><br/>
    <div className="bg-slate-100 min-h-screen w-full"><br/>
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-md mt-8">
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">Add History</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <textarea
          name="history"
          value={formData.history}
          onChange={handleChange}
          placeholder="History"
          required
          rows="5"
          className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500  bg-white text-black"
        />
        <textarea
          name="gurusTimeline"
          value={formData.gurusTimeline}
          onChange={handleChange}
          placeholder="Gurus Timeline"
          required
          rows="5"
          className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500  bg-white text-black"
        />
        <textarea
          name="specialDevelopments"
          value={formData.specialDevelopments}
          onChange={handleChange}
          placeholder="Special Developments"
          required
          rows="5"
          className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
        />
        <textarea
          name="institutes"
          value={formData.institutes}
          onChange={handleChange}
          placeholder="Institutes (e.g., Education, Medical, etc.)"
          required
          rows="5"
          className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500  bg-white text-black"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
        >
          Save Data
        </button>
      </form>
     
    </div><br/><br/>
    </div> 
    <Footer/>
    </>
  );
}
