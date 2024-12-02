"use client";
import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";

function Signup() {
  const [formData, setFormdata] = useState({
    name: "",
    phnumber: "",
    password: "",
    otp: "",
  });
  const [userVerfied, setUserVerfied] = useState(false);

  useEffect(() => {
    if (userVerfied) {
      console.log("User verified successfully!");
      console.log(userVerfied)
    }
  }, [userVerfied]);

  function handleChanged(e) {
    const { name, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.get(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/${formData.phnumber}/AUTOGEN/SVD`
      );
      console.log("otp sent", response.data);
      console.log(response.data.Details);
    } catch (error) {
      console.log("error sending otp", error);
    }
  }

  async function otpVerify() {
    try {
      const response = await axios.get(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/VERIFY3/${formData.phnumber}/${formData.otp}`
      );
      console.log(response.data);
      console.log("user verfied successfully");
      setUserVerfied(true);
      await axios.post('/api/admin/signup', {
        name: formData.name,
        phnumber: formData.phnumber,
        password: formData.password, 
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            type="text"
            className="grow"
            name="name"
            placeholder="Username"
            value={formData.name}
            onChange={handleChanged}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="number"
            className="grow"
            name="phnumber"
            placeholder="Phone number "
            value={formData.phnumber}
            onChange={handleChanged}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            className="grow"
            name="password"
            placeholder="password"
            onChange={handleChanged}
            value={formData.password}
          />
        </label>
        <button
          className="btn btn-active"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
          Default
        </button>
      </form>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">OTP verfication</h3>
          <p className="py-4">Please enter otp below</p>
          <div className="modal-action">
            <form method="dialog" onSubmit={otpVerify}>
              <input
                type="number"
                placeholder="Enter OTP"
                className="input input-bordered w-full max-w-xs"
                name="otp"
                onChange={handleChanged}
              />

              <button className="btn">Close</button>
              <button className="btn">Submit</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default Signup;
