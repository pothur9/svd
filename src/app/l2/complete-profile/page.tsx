"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthManager from "@/lib/auth";
import Navbar from "../navbar/page";

interface ProfileForm {
  name: string;
  contactNo: string;
  dob: string; // ISO date string yyyy-mm-dd
  address: string;
  dhekshaGuru: string;
  karthruGuru: string;
  gender: string;
  bhage: string;
  gothra: string;
  mariPresent: string; // Yes/No
  paramapare?: string;
  imageUrl: string;
}

const steps = ["Personal", "Tradition", "Finalize"] as const;

type Step = typeof steps[number];

export default function CompleteProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState<Step>("Personal");
  const [userId, setUserId] = useState<string>("");
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    contactNo: "",
    dob: "",
    address: "",
    dhekshaGuru: "",
    karthruGuru: "",
    gender: "",
    bhage: "",
    gothra: "",
    mariPresent: "",
    paramapare: "",
    imageUrl: "",
  });

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    // Auth gate
    if (!AuthManager.isAuthenticated()) {
      router.push("/l2/login");
      return;
    }
    const user = AuthManager.getAuthUser();
    if (!user?.userId) {
      router.push("/l2/login");
      return;
    }
    setUserId(user.userId);

    // Prefill with existing dashboard user data endpoint
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/l2/dashboard/${user.userId}?t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load user");
        const u = await res.json();
        setForm({
          name: u.name ?? "",
          contactNo: u.contactNo ?? "",
          dob: u.dob ? new Date(u.dob).toISOString().slice(0, 10) : "",
          address: u.address ?? "",
          dhekshaGuru: u.dhekshaGuru ?? "",
          karthruGuru: u.karthruGuru ?? "",
          gender: u.gender ?? "",
          bhage: u.bhage ?? "",
          gothra: u.gothra ?? "",
          mariPresent: u.mariPresent ?? "",
          paramapare: u.paramapare ?? u.parampare ?? "",
          imageUrl: u.imageUrl ?? "",
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const canNext = useMemo(() => {
    if (step === "Personal") {
      return !!(form.name && form.contactNo && form.gender);
    }
    if (step === "Tradition") {
      return !!(form.karthruGuru && form.dhekshaGuru);
    }
    return true;
  }, [form, step]);

  const handleChange = (k: keyof ProfileForm, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }));
  };

  const goNext = () => {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  };
  const goPrev = () => {
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]);
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/l2/update-profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          contactNo: form.contactNo,
          dob: form.dob ? new Date(form.dob).toISOString() : null,
          address: form.address,
          dhekshaGuru: form.dhekshaGuru,
          karthruGuru: form.karthruGuru,
          gender: form.gender,
          bhage: form.bhage,
          gothra: form.gothra,
          mariPresent: form.mariPresent,
          paramapare: form.paramapare,
          imageUrl: form.imageUrl,
        }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      // Navigate back to dashboard
      router.push("/l2/dashboard");
    } catch (e) {
      console.error(e);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Upload image to Cloudinary and update form state
  const handleImageFileChange = async (file: File) => {
    if (!file) return;
    try {
      if (!cloudName || !uploadPreset) {
        alert("Image upload not configured. Please paste an image URL instead.");
        return;
      }
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', uploadPreset);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setForm(prev => ({ ...prev, imageUrl: data.secure_url }));
    } catch (e) {
      console.error(e);
      alert('Failed to upload image. Please try again or paste a URL.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Navbar />
      {/* Back button */}
      <button
        onClick={() => router.push('/l2/dashboard')}
        className="fixed top-20 left-4 z-50 bg-white border px-3 py-1 rounded shadow hover:bg-gray-50"
      >
        ← Back
      </button>
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-6">
          {steps.map(s => (
            <div key={s} className={`px-3 py-1 rounded-full text-sm ${s === step ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>{s}</div>
          ))}
        </div>

        {/* Step content */}
        {step === "Personal" && (
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Name</label>
              <input value={form.name} onChange={e=>handleChange('name', e.target.value)} className="w-full border p-2 rounded bg-white" />
            </div>
            <div>
              <label className="block mb-1">Contact No</label>
              <input value={form.contactNo} onChange={e=>handleChange('contactNo', e.target.value.replace(/\D/g, '').slice(0,10))} className="w-full border p-2 rounded bg-white" />
            </div>
            <div>
              <label className="block mb-1">Gender</label>
              <select value={form.gender} onChange={e=>handleChange('gender', e.target.value)} className="w-full border p-2 rounded bg-white">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Date of Birth</label>
              <input type="date" value={form.dob} onChange={e=>handleChange('dob', e.target.value)} className="w-full border p-2 rounded bg-white" />
            </div>
            <div>
              <label className="block mb-1">Address</label>
              <textarea value={form.address} onChange={e=>handleChange('address', e.target.value)} className="w-full border p-2 rounded bg-white" />
            </div>
          </div>
        )}

        {step === "Tradition" && (
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Paramapare</label>
              <select value={form.paramapare ?? ''} onChange={e=>handleChange('paramapare', e.target.value)} className="w-full border p-2 rounded bg-white">
                <option value="">Select</option>
                <option value="guru_shishya">Guru Shishya Parampara</option>
                <option value="putra_shishya">Putra Shishya Parampara</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Karthru Guru</label>
              <input value={form.karthruGuru} onChange={e=>handleChange('karthruGuru', e.target.value)} className="w-full border p-2 rounded bg-white" />
            </div>
            <div>
              <label className="block mb-1">Dheksha Guru</label>
              <input value={form.dhekshaGuru} onChange={e=>handleChange('dhekshaGuru', e.target.value)} className="w-full border p-2 rounded bg-white" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Bhage</label>
                <input value={form.bhage} onChange={e=>handleChange('bhage', e.target.value)} className="w-full border p-2 rounded bg-white" />
              </div>
              <div>
                <label className="block mb-1">Gothra</label>
                <input value={form.gothra} onChange={e=>handleChange('gothra', e.target.value)} className="w-full border p-2 rounded bg-white" />
              </div>
            </div>
            <div>
              <label className="block mb-1">Marital Status</label>
              <select value={form.mariPresent} onChange={e=>handleChange('mariPresent', e.target.value)} className="w-full border p-2 rounded bg-white">
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        )}

        {step === "Finalize" && (
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Profile Image URL</label>
              <input value={form.imageUrl} onChange={e=>handleChange('imageUrl', e.target.value)} className="w-full border p-2 rounded bg-white" placeholder="https://..." />
              <p className="text-xs text-gray-500 mt-1">Paste a public image URL (e.g., from Cloudinary).</p>
              <div className="mt-2 flex items-center gap-3">
                <input type="file" accept="image/*" onChange={e=>{ const f=e.target.files?.[0]; if (f) void handleImageFileChange(f); }} />
                {form.imageUrl && (
                  <div className="h-16 w-16 relative">
                    <Image src={form.imageUrl} alt="Preview" fill className="object-cover rounded border" />
                  </div>
                )}
              </div>
            </div>
            <div className="p-3 bg-gray-100 rounded">
              <div className="font-semibold mb-2">Review</div>
              <div className="text-sm grid grid-cols-1 gap-1">
                <div><strong>Name:</strong> {form.name || '-'}</div>
                <div><strong>Contact No:</strong> {form.contactNo || '-'}</div>
                <div><strong>Gender:</strong> {form.gender || '-'}</div>
                <div><strong>DOB:</strong> {form.dob || '-'}</div>
                <div><strong>Address:</strong> {form.address || '-'}</div>
                <div><strong>Paramapare:</strong> {form.paramapare || '-'}</div>
                <div><strong>Karthru Guru:</strong> {form.karthruGuru || '-'}</div>
                <div><strong>Dheksha Guru:</strong> {form.dhekshaGuru || '-'}</div>
                <div><strong>Bhage:</strong> {form.bhage || '-'}</div>
                <div><strong>Gothra:</strong> {form.gothra || '-'}</div>
                <div><strong>Marital Status:</strong> {form.mariPresent || '-'}</div>
                <div className="flex items-center gap-2"><strong>Image:</strong> {form.imageUrl ? (
                  <span className="inline-block h-10 w-10 relative">
                    <Image src={form.imageUrl} className="object-cover rounded border" alt="preview" fill />
                  </span>
                ) : '-'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mt-6 flex items-center justify-between">
          <button onClick={goPrev} disabled={step === "Personal"} className={`px-4 py-2 rounded ${step === "Personal" ? 'bg-gray-300 text-gray-600' : 'bg-gray-200'}`}>Back</button>
          {step !== "Finalize" ? (
            <button onClick={goNext} disabled={!canNext} className={`px-4 py-2 rounded ${canNext ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'}`}>Next</button>
          ) : (
            <button onClick={handleSave} disabled={saving} className={`px-4 py-2 rounded ${saving ? 'bg-gray-400' : 'bg-green-600 text-white'}`}>{saving ? 'Saving...' : 'Save & Finish'}</button>
          )}
        </div>
      </div>
    </div>
  );
}
