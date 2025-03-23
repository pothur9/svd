"use client";
import { useState, useEffect } from "react";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import { ChangeEvent , FormEvent } from "react"; // Import ChangeEvent

export default function UserDataForm() {
  const [formData, setFormData] = useState({
    username: "",
    history: "",
    gurusTimeline: "",
    specialDevelopments: "",
    institutes: "",
    contactDetails: "",
  });
  const [loading, setLoading] = useState(false); // State to handle loading

  useEffect(() => {
    // Fetch the userId from sessionStorage when the component mounts
    const usernameFromStorage = sessionStorage.getItem("username");
    
    if (usernameFromStorage) {
      console.log("User ID from sessionStorage:", usernameFromStorage);
      setFormData((prevData) => ({
        ...prevData,
        username: usernameFromStorage,
      }));
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Ensure username exists
    if (!formData.username) {
      alert("Username is missing. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/l1/addhistory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Data saved successfully");
        setFormData({
          username: formData.username,
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <br/><br/><br/>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white shadow-xl rounded-lg w-full max-w-2xl p-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
            Add History
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="userId"
              >
                Username
              </label>
              <input
                type="text"
                id="userId"
                value={formData.username}
                readOnly
                className="w-full bg-gray-100 text-gray-600 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            {/* History */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="history"
              >
                History
              </label>
              <textarea
                id="history"
                name="history"
                value={formData.history}
                onChange={handleChange}
                placeholder="Write the history here..."
                required
                rows={4} 
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            {/* Gurus Timeline */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="gurusTimeline"
              >
                Gurus Timeline
              </label>
              <textarea
                id="gurusTimeline"
                name="gurusTimeline"
                value={formData.gurusTimeline}
                onChange={handleChange}
                placeholder="Write the Gurus Timeline here..."
                required
                rows={4} 
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            {/* Special Developments */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="specialDevelopments"
              >
                Special Developments
              </label>
              <textarea
                id="specialDevelopments"
                name="specialDevelopments"
                value={formData.specialDevelopments}
                onChange={handleChange}
                placeholder="Write about special developments..."
                required
                rows={4} 
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            {/* Institutes */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="institutes"
              >
                Institutes
              </label>
              <textarea
                id="institutes"
                name="institutes"
                value={formData.institutes}
                onChange={handleChange}
                placeholder="List institutes (e.g., Education, Medical, etc.)"
                required
                rows={4} 
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
             {/* contact Details */}
             <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="contactDetails"
              >
                Contact Details
              </label>
              <textarea
                id="contactDetails"
                name="contactDetails"
                value={formData.contactDetails}
                onChange={handleChange}
                placeholder="List institutes (e.g., Education, Medical, etc.)"
                required
                rows={4} 
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Save Data"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
