import React, { useState, useRef, useEffect } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/Appcontext';
import { User as UserIcon, Upload } from 'lucide-react';

// গ্লোবাল ইউজার অবজেক্টের টাইপ যদি ডিফাইন করা না থাকে, তার জন্য একটি সেফ ইন্টারফেস
interface UserType {
  name?: string;
  email?: string;
  dob?: string;
  age?: number;
  height?: number;
  gender?: string;
  bloodGroup?: string;
  profileImage?: string | null;
  username?: string;
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, updateUserProfile } = useAppContext();
  
  const displayName = user?.name || user?.username || "Guest";
  const firstName = displayName.trim().split(' ')[0];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    age: '',
    height: '', 
    gender: '',
    bloodGroup: '',
    profileImage: null as string | null,
    avgCycleLength: user?.avgCycleLength || 28,
  avgBleedingDays: user?.avgBleedingDays || 5,
  lastPeriodStart: user?.lastPeriodStart || ''
  });

  // FIX: This effect monitors the user state and syncs the form data 
  // as soon as onboarding values or network responses arrive in the Context layer.
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        dob: user.dob || '',
        age: user.age !== undefined && user.age !== null ? String(user.age) : '',
        height: user.height !== undefined && user.height !== null ? String(user.height) : '', 
        gender: user.gender || '',
        bloodGroup: user.bloodGroup || '',
        profileImage: user.profileImage || null,
        avgCycleLength: user.avgCycleLength || 28,
      avgBleedingDays: user.avgBleedingDays || 5,
      lastPeriodStart: user.lastPeriodStart || '' 
      });
    }
  }, [user]);

  const inputStyle = `w-full p-3 rounded-xl border outline-none transition-all duration-200 ${
    isEditing 
    ? "bg-white dark:bg-slate-900 border-[#60A5FA] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#60A5FA]/20 shadow-[0_0_10px_rgba(0,85,255,0.1)]"
    ? "bg-white dark:bg-slate-900 border-[#60A5FA] text-slate-900 dark:text-white focus:ring-2 focus:ring-[#60A5FA]/20 shadow-[0_0_10px_rgba(0,85,255,0.1)]"
    : "bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
  }`;

  const handleAction = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    
    const updatedAge = formData.age !== '' ? Number(formData.age) : user?.age;
    const updatedHeight = formData.height !== '' ? Number(formData.height) : user?.height;

    updateUserProfile({
      name: formData.name || user?.name,
      email: formData.email || user?.email,
      age: updatedAge,
      height: updatedHeight,
      gender: formData.gender || user?.gender,
      bloodGroup: formData.bloodGroup || user?.bloodGroup,
      profileImage: formData.profileImage || user?.profileImage,
      avgCycleLength: formData.avgCycleLength,
    avgBleedingDays: formData.avgBleedingDays,
    lastPeriodStart: formData.lastPeriodStart
    });
    
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false); 
      alert("Changes saved successfully!");
    }, 500);
  };

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b1120] text-slate-400">
      Please login to view profile.
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">User Health Profile</h1>    
          <p className="flex items-baseline justify-center gap-2 mt-2 md:justify-start">
            <span className="text-2xl font-bold text-[#60A5FA] dark:text-[#60A5FA]">
              Hey {firstName},
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Please provide the information below to help us understand better.
            </span>
          </p> 
        </div>

        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden transition-colors duration-300">    
          <div className="p-10 rounded-2xl">
            <h2 className="mb-10 text-xl font-bold text-slate-800 dark:text-white">Personal Information</h2>
               
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center mb-12 md:flex-row gap-7">
              <div className="w-24 h-24 bg-slate-100 dark:bg-[#1f2937] rounded-full flex items-center justify-center border-2 border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden relative group">          
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="object-cover w-full h-full" />
                ) : (
                  <UserIcon size={46} className="text-slate-400 dark:text-slate-500" />
                )}
              </div>
              
              <div className="space-y-2 text-center md:text-left">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  disabled={!isEditing}
                  disabled={!isEditing}
                />
                <button 
                  type="button"
                  disabled={!isEditing}
                  onClick={() => fileInputRef.current?.click()}
                  className={`font-bold flex items-center gap-2 transition-all mx-auto md:mx-0 text-sm tracking-wide uppercase ${
                    isEditing ? "text-[#60A5FA] hover:brightness-110 cursor-pointer" : "text-slate-400 dark:text-slate-600 cursor-not-allowed"
                  }`}
                >
                  <Upload size={18} /> 
                  <span>Upload Photo</span>
                </button>
                <p className="max-w-xs mt-2 text-xs text-slate-400 dark:text-slate-500">
                  Upload profile image, it's best if it has the same length and height.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                 
              {/* Name Field */}
              {/* <div className="flex flex-col gap-3">
                <label className="ml-1 text-sm font-bold tracking-wide text-slate-900 dark:text-white">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}          
                  disabled={!isEditing} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={inputStyle}
                  placeholder="Your Name"
                />
              </div> */}

              {/* Email Field */}
              <div className="flex flex-col gap-3">
                <label className="ml-1 text-sm font-bold tracking-wide text-slate-900 dark:text-white">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}          
                  disabled={!isEditing} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={inputStyle}
                  placeholder="yourname@example.com"
                />
              </div>

              {/* Age Field */}
              <div className="flex flex-col gap-3">
                <label className="ml-1 text-sm font-bold tracking-wide text-slate-900 dark:text-white">Age</label>
                <input 
                  type="number" 
                  value={formData.age}    
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  disabled={!isEditing} 
                  className={inputStyle}
                  placeholder="Enter your age"
                />
              </div>

              {/* Height Field */}
              <div className="flex flex-col gap-3">
                <label className="ml-1 text-sm font-bold tracking-wide text-slate-900 dark:text-white">Height (cm)</label>
                <input 
                  type="number" 
                  value={formData.height} 
                  onChange={(e) => setFormData({...formData, height: e.target.value})}          
                  disabled={!isEditing} 
                  className={inputStyle}
                  placeholder="e.g. 165"
                />
              </div>

              {/* Gender Section */}
              <div className="flex flex-col gap-3">
                <label className="ml-1 text-sm font-bold tracking-wide text-slate-900 dark:text-white">Gender</label>
                <select 
                  name="gender"
                  value={formData.gender.toLowerCase()} // Match lowercase values across steps
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  disabled={!isEditing}
                  className={inputStyle}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Blood Group Selection */}
              <div className="flex flex-col gap-3">
                <label className="ml-1 text-sm font-bold tracking-wide text-slate-900 dark:text-white">Blood Group</label>
                <select 
                  disabled={!isEditing}
                  className={inputStyle}
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                >
                  <option value="">Select Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

 
{/* Menstrual Cycle Settings (Visible only if Female) */}
{formData.gender === 'female' && (
  <div className="pt-10 mt-12 border-t border-slate-200 dark:border-slate-800">
    <h3 className="mb-8 text-lg font-bold text-slate-800 dark:text-white">Menstrual Cycle Settings</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
      
      <div className="flex flex-col gap-3">
        <label className="ml-1 text-sm font-bold tracking-wide text-slate-900 dark:text-white">Average Cycle Length (Days)</label>
        <input 
          type="number" 
          value={formData.avgCycleLength} 
          disabled={!isEditing}
          // FIX: Corrected field and handler logic
          onChange={(e) => setFormData({ ...formData, avgCycleLength: e.target.value === '' ? '' : Number(e.target.value) })}
          className={inputStyle}
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="ml-1 text-sm font-bold tracking-wide text-slate-900 dark:text-white">Average Bleeding Days</label>
        <input 
          type="number" 
          value={formData.avgBleedingDays} 
          disabled={!isEditing}
          // FIX: Corrected field and handler logic
          onChange={(e) => setFormData({ ...formData, avgBleedingDays: e.target.value === '' ? '' : Number(e.target.value) })}
          className={inputStyle}
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="ml-1 text-sm font-bold tracking-wide text-slate-900 dark:text-white">Last Period Start Date</label>
        <input 
          type="date" 
          value={formData.lastPeriodStart} 
          disabled={!isEditing}
          onChange={(e) => setFormData({...formData, lastPeriodStart: e.target.value})}
          className={inputStyle}
        />
      </div>
      
    </div>
  </div>
)}

            <div className="flex justify-end mt-14">
              <button 
                type="button"
                onClick={handleAction} 
                disabled={isSaving}
                className={`px-14 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg ${
                  isSaving ? "opacity-50 cursor-wait bg-slate-400" :
                  isEditing 
                  ? "bg-[#60A5FA] text-white shadow-[#60A5FA]/30 hover:brightness-105" 
                  : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white hover:brightness-95"
                }`}
              >
                {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Profile;