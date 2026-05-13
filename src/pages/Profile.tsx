import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/Appcontext';
import { User as UserIcon, Upload, Calendar, Ruler, Save } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, setUser } = useAppContext();
  const displayName = user?.name || user?.username || "Guest";
  const firstName = displayName.trim().split(' ')[0];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sky = "#38BDF8";
const inputStyle = `w-full p-3 rounded-xl border outline-none transition-all duration-200 ${
    isEditing 
    ? "bg-white dark:bg-slate-900 border-[${sky}] text-slate-900 dark:text-white focus:ring-2 focus:ring-[${sky}]/20 shadow-[0_0_10px_rgba(0,85,255,0.1)]"
    : "bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
  }`;

  const handleAction = () => {
    if (isEditing) {
      handleSave();
// logic for data saving will be called here      // updateUser(updatedData); 
      
      setIsEditing(false);
      alert("Changes saved successfully!");
    } else {
      setIsEditing(true);
    }
  };
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dob: user?.dob || '',
    age: user?.age || '',
    height: user?.height || '', // weight এর বদলে height
    gender: user?.gender || '',
    bloodGroup: user?.bloodGroup || '',
    profileImage: user?.profileImage || null 
  });

  const [isSaving, setIsSaving] = useState(false);

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b1120] text-slate-400">
      Please login to view profile.
    </div>
  );

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
  setIsEditing(false);
  
  // Here you would typically send formData to your backend API to update the user's profile
  // For this example, we'll just update the global state and localStorage
  
  const updatedUser = {
    ...user!,
    name: formData.name || user?.name,
    age: Number(formData.age) || user?.age,
    height: Number(formData.height) || user?.height,
    gender: formData.gender || user?.gender,
    bloodGroup: formData.bloodGroup || user?.bloodGroup,
    profileImage: formData.profileImage || user?.profileImage
  };

//global state update
    setUser(updatedUser);
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
   setTimeout(() => {
    setIsSaving(false);
    setIsEditing(false); // এডিট মোড বন্ধ হবে
    alert("Profile updated successfully!");
  }, 500);
};
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8 text-center md:text-left">
<h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">User Health Profile</h1>    
    <p className="mt-2 flex items-baseline gap-2 justify-center md:justify-start">
    <span className="text-2xl font-bold text-[#38BDF8] dark:text-[#38BDF8]">
      Hey {firstName},
    </span>
    
    <span className="text-sm text-slate-500 dark:text-slate-400">
      Please provide the information below to help us understand better.
    </span>
    {/* </div> */}
  </p> 
  </div>
        </div>

<div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden transition-colors duration-300">    
        <div className="p-10 rounded-2xl">
<h2 className="text-xl font-bold text-slate-800 dark:text-white mb-10">Personal Information</h2>
           
            {/* Profile Photo Section */}

            <div className="flex flex-col md:flex-row items-center gap-7 mb-12">
<div className="w-24 h-24 bg-slate-100 dark:bg-[#1f2937] rounded-full flex items-center justify-center border-2 border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden relative group">           
       {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={46} className="text-slate-400 dark:text-slate-500" />
                )}
              </div>
              
              <div className="text-center md:text-left space-y-2">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
               <button 
  onClick={() => fileInputRef.current?.click()}
className="text-[#38BDF8] font-bold flex items-center gap-2 hover:brightness-110 transition-all mx-auto md:mx-0 text-sm tracking-wide uppercase">
  <Upload size={18} className="group-hover:scale-110 transition-transform" /> 
  <span>Upload Photo</span>
</button>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 max-w-xs">
                  Upload profile image, it's best if it has the same length and height.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
             
            {/* Email Field */}
          <div className="flex flex-col gap-3">
            <label className="text-slate-900 dark:text-white text-sm font-bold  tracking-wide ml-1">Email Address</label>
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
            <label className="text-slate-900 dark:text-white text-sm font-bold  tracking-wide ml-1">Age</label>
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
            <label className="text-slate-900 dark:text-white text-sm font-bold  tracking-wide ml-1">Height (cm)</label>
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
        <label className="text-slate-900 dark:text-white text-sm font-bold  tracking-wide ml-1">Gender</label>
        <select 
          value={formData.gender || ""}
          onChange={(e) => setFormData({...formData, gender: e.target.value})}
          disabled={!isEditing}
           className={inputStyle}

        >
          <option>{user?.gender || "Select Gender"}</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

  {/* Blood Group Selection */}
          <div className="flex flex-col gap-3">
            <label className="text-slate-900 dark:text-white text-sm font-bold  tracking-wide ml-1">Blood Group</label>
            <select 
              disabled={!isEditing}
              className={inputStyle}
              value={formData?.bloodGroup || ""}
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

          <div className="mt-14 flex justify-end">
          <button 
            onClick={handleAction} //didnt edited
            className={`px-14 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg ${
              isEditing 
              ? "bg-[#38BDF8] text-white shadow-[#38BDF8]/30" 
          : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white"
            }`}
          >
            {isEditing ? "Save Changes" : "Edit Changes"}
          </button>
        </div>
          </div>
        </div>
      </div>

  );
};

export default Profile;