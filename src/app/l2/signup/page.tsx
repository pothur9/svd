"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n"; // Ensure the correct path
import Image from "next/image";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  dob: string;
  contactNo: string;
  peetarohanaDate: string;
  gender: string;
  karthruGuru: string;
  dhekshaGuru: string;
  peeta: string;
  bhage: string;
  gothra: string;
  mariPresent: string;
  password: string;
  confirmPassword: string;
  imageUrl: string;
  address: string;
  [key: string]: string;
}

export default function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    dob: "",
    contactNo: "",
    peetarohanaDate: "",
    gender: "",
    karthruGuru: "",
    dhekshaGuru: "",
    peeta: "",
    bhage: "",
    gothra: "",
    mariPresent: "",
    password: "",
    confirmPassword: "",
    imageUrl: "",
    address: "",
  });

  const [l1Users, setL1Users] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [otp, setOtp] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [isUserIdVisible, setIsUserIdVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("en");
  const { t } = useTranslation();
  const router = useRouter();
  const [statesData, setStatesData] = useState<{ [state: string]: string[] }>({});
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function fetchL1Users() {
      try {
        const response = await axios.get("/api/l2/getguruname");
        setL1Users(response.data || []);
      } catch (error) {
        console.error("Error fetching l1 users:", error);
      }
    }
    fetchL1Users();
    // Fetch states/districts data
    fetch("/districts.json")
      .then((res) => res.json())
      .then((data) => setStatesData(data))
      .catch((err) => console.error("Failed to load districts.json", err));
  }, []);
  const changeLanguage = (lang: string) => {
    console.log(`Changing language to: ${lang}`); // Debugging log
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  // Validate a single field
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return t("signupl2.name") + " is required";
        break;
      case "dob":
        if (!value) return t("signupl2.dob") + " is required";
        {
          const dobDate = new Date(value);
          const now = new Date();
          if (dobDate > now) return "Date of birth cannot be in the future";
          const age = now.getFullYear() - dobDate.getFullYear();
          if (age < 10) return "You must be at least 10 years old";
        }
        break;
      case "contactNo":
        if (!value) return t("signupl2.contactNo") + " is required";
        if (!/^\d{10}$/.test(value)) return "Contact number must be exactly 10 digits";
        if (/^(\d)\1{9}$/.test(value)) return "Invalid phone number";
        if (/^0/.test(value)) return "Phone number cannot start with 0";
        break;
      case "peetarohanaDate":
        if (!value) return t("signupl2.peetarohanaDate") + " is required";
        {
          const peetaDate = new Date(value);
          const now = new Date();
          if (peetaDate > now) return "Peetarohana date cannot be in the future";
          if (formData.dob) {
            const dobDate = new Date(formData.dob);
            if (peetaDate < dobDate) return "Peetarohana date cannot be before date of birth";
          }
        }
        break;
      case "gender":
        if (!value) return t("signupl2.gender") + " is required";
        break;
      case "karthruGuru":
        if (!value.trim()) return t("signupl2.karthruGuru") + " is required";
        break;
      case "dhekshaGuru":
        if (!value.trim()) return t("signupl2.dhekshaGuru") + " is required";
        break;
      case "peeta":
        if (!value) return t("signupl1.peeta") + " is required";
        break;
      case "bhage":
        if (!value.trim()) return t("signupl2.bhage") + " is required";
        break;
      case "gothra":
        if (!value.trim()) return t("signupl2.gothra") + " is required";
        break;
      case "password":
        if (!value) return t("signupl2.password") + " is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        break;
      case "confirmPassword":
        if (!value) return t("signupl2.confirmPassword") + " is required";
        if (value !== formData.password) return "Passwords do not match";
        break;
      default:
        break;
    }
    return "";
  };

  // Update handleChange to restrict phone number and date year input
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === "contactNo") {
      let filtered = value.replace(/\D/g, "");
      if (filtered.length > 10) filtered = filtered.slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: filtered }));
      setErrors((prev) => ({ ...prev, [name]: validateField(name, filtered) }));
      return;
    }

    if ((name === "dob" || name === "peetarohanaDate") && type === "date" && value) {
      // value is in format YYYY-MM-DD
      const year = value.split("-")[0];
      if (year.length > 4) return; // Ignore input if year is more than 4 digits
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Add handleBlur for per-field validation
  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Update handleImageChange to validate image file
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImageFile(file);
    let error = "";
    if (!file) error = "Profile picture is required";
    else if (!file.type.startsWith("image/")) error = "File must be an image";
    setErrors((prev) => ({ ...prev, imageUrl: error }));
  };

  const uploadImageToCloudinary = async (): Promise<string | null> => {
    if (!imageFile) return null;
    try {
      const imageFormData = new FormData();
      imageFormData.append("file", imageFile);
      imageFormData.append("upload_preset", "profilephoto");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dxruv6swh/image/upload",
        {
          method: "POST",
          body: imageFormData,
        }
      );

      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  // Enhanced Validation function
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    // Name
    if (!formData.name.trim()) newErrors.name = t("signupl2.name") + " is required";
    // DOB
    if (!formData.dob) newErrors.dob = t("signupl2.dob") + " is required";
    else {
      const dobDate = new Date(formData.dob);
      const now = new Date();
      if (dobDate > now) newErrors.dob = "Date of birth cannot be in the future";
      else {
        const age = now.getFullYear() - dobDate.getFullYear();
        if (age < 10) newErrors.dob = "You must be at least 10 years old";
      }
    }
    // Contact Number
    if (!formData.contactNo) newErrors.contactNo = t("signupl2.contactNo") + " is required";
    else if (!/^\d{10}$/.test(formData.contactNo)) newErrors.contactNo = "Contact number must be exactly 10 digits";
    else if (/^(\d)\1{9}$/.test(formData.contactNo)) newErrors.contactNo = "Invalid phone number";
    else if (/^0/.test(formData.contactNo)) newErrors.contactNo = "Phone number cannot start with 0";
    // Peetarohana Date
    if (!formData.peetarohanaDate) newErrors.peetarohanaDate = t("signupl2.peetarohanaDate") + " is required";
    else {
      const peetaDate = new Date(formData.peetarohanaDate);
      const now = new Date();
      if (peetaDate > now) newErrors.peetarohanaDate = "Peetarohana date cannot be in the future";
      if (formData.dob) {
        const dobDate = new Date(formData.dob);
        if (peetaDate < dobDate) newErrors.peetarohanaDate = "Peetarohana date cannot be before date of birth";
      }
    }
    // Gender
    if (!formData.gender) newErrors.gender = t("signupl2.gender") + " is required";
    // Karthru Guru
    if (!formData.karthruGuru.trim()) newErrors.karthruGuru = t("signupl2.karthruGuru") + " is required";
    // Dheksha Guru
    if (!formData.dhekshaGuru.trim()) newErrors.dhekshaGuru = t("signupl2.dhekshaGuru") + " is required";
    // Peeta
    if (!formData.peeta) newErrors.peeta = t("signupl1.peeta") + " is required";
    // Bhage
    if (!formData.bhage.trim()) newErrors.bhage = t("signupl2.bhage") + " is required";
    // Gothra
    if (!formData.gothra.trim()) newErrors.gothra = t("signupl2.gothra") + " is required";
    // State
    if (!selectedState) newErrors.state = "State is required";
    // District
    if (!selectedDistrict) newErrors.district = "District is required";
    // City
    if (!city.trim()) newErrors.city = "City is required";
    // Password
    if (!formData.password) newErrors.password = t("signupl2.password") + " is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    // Confirm Password
    if (!formData.confirmPassword) newErrors.confirmPassword = t("signupl2.confirmPassword") + " is required";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    // Image file
    if (!imageFile) newErrors.imageUrl = "Profile picture is required";
    else if (imageFile && !imageFile.type.startsWith("image/")) newErrors.imageUrl = "File must be an image";
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/${formData.contactNo}/AUTOGEN/SVD`
      );
      console.log("OTP sent:", response.data);
      setIsOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    setIsVerifyingOtp(true);
    try {
      const response = await axios.get(
        `https://2factor.in/API/V1/3e5558da-7432-11ef-8b17-0200cd936042/SMS/VERIFY3/${formData.contactNo}/${otp}`
      );
      console.log("OTP verified:", response.data);
      setIsOtpVerified(true);

      const imageUrl = await uploadImageToCloudinary();
      if (!imageUrl) {
        alert("Image upload failed");
        return;
      }

      const { confirmPassword, ...submitData } = {
        ...formData,
        imageUrl,
      };
      console.log(confirmPassword);
      const result = await fetch("/api/l2/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const responseData = await result.json();
      alert(responseData.message);

      setUserId(responseData.userId);
      setIsUserIdVisible(true);
      setIsOtpSent(false);
      setOtp("");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("OTP verification failed");
    } finally {
      setIsVerifyingOtp(false);
    }
  };  const handleLoginRedirect = () => {
    router.push("/l2/login"); // Redirect to the login page
  
}; console.log(language)

  const handleStateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
    setSelectedDistrict("");
    setCity("");
    setFormData((prev) => ({ ...prev, address: "" }));
    setErrors((prev) => ({ ...prev, state: "", district: "", city: "" })); // Clear errors on state change
  };

  const handleDistrictChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value);
    setCity("");
    setFormData((prev) => ({ ...prev, address: "" }));
    setErrors((prev) => ({ ...prev, district: "" })); // Clear error on district change
  };

  const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
    setFormData((prev) => ({ ...prev, address: `${selectedState}, ${selectedDistrict}, ${e.target.value}` }));
    setErrors((prev) => ({ ...prev, city: "" })); // Clear error on city change
  };

  return (
    <>
      <div className="flex flex-col items-center p-2 bg-gray-100 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Select Your Language
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => changeLanguage("en")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            English
          </button>
          <button
            onClick={() => changeLanguage("kn")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
          >
            ಕನ್ನಡ
          </button>
          <button
            onClick={() => changeLanguage("hi")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
          >
            हिंदी
          </button>
        </div>
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex justify-center">
            <Image src="/logomain1.png" alt="Logo" width={100} height={100} />
          </div>
          <h2 className="text-2xl font-bold text-black text-center mb-6">
            {t("signupl2.title")}
          </h2>
           {/* Dropdown for Peeta (l2 users) */}
           <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                {t("signupl1.peeta")}
                <select
                  name="peeta"
                  value={formData.peeta}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className="border rounded-md p-2 w-full bg-white text-black"
                >
                  {" "}
                  <option value="">Select peeta</option>
                  {l1Users.map((user) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
              </label>
              {errors.peeta && <p className="text-red-500 text-sm mt-1">{errors.peeta}</p>}
            </div>
          <form onSubmit={handleSubmit}>
            {/* Form Fields */}
            {[
              {
                label: t("signupl2.name"),
                type: "text",
                name: "name",
                required: true,
              },
              {
                label: t("signupl2.dob"),
                type: "date",
                name: "dob",
                required: true,
              },
              {
                label: t("signupl2.contactNo"),
                type: "tel", // changed from 'number' to 'tel'
                name: "contactNo",
                required: true,
                maxLength: 10, // add maxLength
                pattern: "[0-9]{10}",
              },
              {
                label: t("signupl2.peetarohanaDate"),
                type: "date",
                name: "peetarohanaDate",
                required: true,
              },
              {
                label: t("signupl2.gender"),
                type: "select",
                name: "gender",
                options: [
                  { value: "", label: "Select" },
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ],
                required: true,
              },
              {
                label: t("signupl2.karthruGuru"),
                type: "text",
                name: "karthruGuru",
                required: true,
              },
              {
                label: t("signupl2.dhekshaGuru"),
                type: "text",
                name: "dhekshaGuru",
                required: true,
              },
              {
                label: t("signupl2.bhage"),
                type: "text",
                name: "bhage",
                required: true,
              },
              {
                label: t("signupl2.gothra"),
                type: "text",
                name: "gothra",
                required: true,
              },
              {
                label: t("signupl2.mariPresent"),
                type: "text",
                name: "mariPresent",
              },
              // Remove the address field from here
              // { label: t("signupl2.address"), type: "text", name: "address" },
              {
                label: t("signupl2.password"),
                type: "password",
                name: "password",
                required: true,
              },
              {
                label: t("signupl2.confirmPassword"),
                type: "password",
                name: "confirmPassword",
                required: true,
              },
            ].map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block mb-1 font-semibold text-black">
                  {field.label}:
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required={field.required}
                      className="border rounded-md p-2 w-full bg-white text-black"
                    >
                      {field.options ? (
                        field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))
                      ) : (
                        <option value="">No options available</option>
                      )}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required={field.required}
                      maxLength={field.name === "contactNo" ? 10 : undefined}
                      pattern={field.name === "contactNo" ? "[0-9]{10}" : undefined}
                      className="border rounded-md p-2 w-full bg-white text-black"
                    />
                  )}
                </label>
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                )}
              </div>
            ))}

            {/* Address Stepper */}
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                Address:
                <div className="flex flex-col gap-2">
                  {/* Step 1: State */}
                  <select
                    name="state"
                    value={selectedState}
                    onChange={handleStateChange}
                    onBlur={() => setErrors((prev) => ({ ...prev, state: !selectedState ? "State is required" : "" }))}
                    required
                    className="border rounded-md p-2 w-full bg-white text-black"
                  >
                    <option value="">Select State</option>
                    {Object.keys(statesData).map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  {/* Step 2: District */}
                  <select
                    name="district"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    onBlur={() => setErrors((prev) => ({ ...prev, district: !selectedDistrict ? "District is required" : "" }))}
                    required={!!selectedState}
                    className="border rounded-md p-2 w-full bg-white text-black"
                    disabled={!selectedState}
                  >
                    <option value="">{selectedState ? "Select District" : "Select State First"}</option>
                    {selectedState && statesData[selectedState] &&
                      statesData[selectedState].map((district) => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                  </select>
                  {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                  {/* Step 3: City */}
                  <input
                    type="text"
                    name="city"
                    value={city}
                    onChange={handleCityChange}
                    onBlur={() => setErrors((prev) => ({ ...prev, city: !city.trim() ? "City is required" : "" }))}
                    required={!!selectedDistrict}
                    className="border rounded-md p-2 w-full bg-white text-black"
                    placeholder="Enter City Name"
                    disabled={!selectedDistrict}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
              </label>
            </div>

           

            <div className="mb-4">
              <label className="block mb-1 font-semibold text-black">
                {t("signupl1.uploadProfilePicture")}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  onBlur={handleImageChange}
                  className="border rounded-md p-2 w-full bg-white text-black"
                />
              </label>
              {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
            </div>

           
            {/* Submit Button */}
            <div className="flex justify-between mt-4">
              <button
                type="submit"
                disabled={isLoading || isOtpVerified}
                className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
              {isOtpSent && !isOtpVerified && (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="border rounded-md p-2 w-full bg-white text-black"
                  />
                  <button
                    type="button"
                    onClick={verifyOtp}
                    className="ml-2 px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                    disabled={isVerifyingOtp}
                  >
                    {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              )}
            </div>
          </form>

          {/* Loading Spinner */}
          {isVerifyingOtp && !isOtpVerified && (
            <div className="flex justify-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600 border-solid"></div>
              <span className="ml-4 text-lg font-semibold text-blue-600">
                Verifying OTP...
              </span>
            </div>
          )}
          {/* User ID Display */}
          {isUserIdVisible && (
            <div className="text-center mt-4">
              <p className="text-black">Your user ID is: {userId}</p>
              <button
                onClick={handleLoginRedirect}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Go to Login
              </button>
            </div>
          )}
          <p>
            have an account?
            <a href="/l2/login" className="text-blue-500 hover:text-blue-700">
              &nbsp; Move to login
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
