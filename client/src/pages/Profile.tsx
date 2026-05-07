import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/Appcontext';
import { User as UserIcon, Upload, Calendar, Ruler, Save } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, setUser } = useAppContext();
  const displayName = user?.name || user?.username || "Guest";
  const firstName = displayName.trim().split(' ')[0];
  const fileInputRef = useRef<HTMLInputElement>(null);

const inputStyle = `w-full p-3 rounded-xl border outline-none transition-all duration-200 ${
    isEditing 
    ? "bg-slate-900 border-[#9B8EC7] text-white focus:ring-2 focus:ring-[#9B8EC7]/20" 
    : "bg-slate-900/30 border-slate-800 text-slate-400 cursor-not-allowed"
  }`;

  const handleAction = () => {
    if (isEditing) {
      // এখানে ডাটা সেভ করার লজিক কল হবে
      // updateUser(updatedData); 
      setIsEditing(false);
      alert("Changes saved successfully!");
    } else {
      setIsEditing(true);
    }
  };
  const [formData, setFormData] = useState({
    name: user?.name || '',
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
    
    const updatedUser = {
      ...user!,
      name: formData.name,
      dob: formData.dob,
      age: Number(formData.age),
<<<<<<< HEAD
      height: Number(formData.height), // height সেভ করা হচ্ছে
=======
      height: Number(formData.height), // height is being saved
>>>>>>> ea49fe0ad5650c7f785ff9ee31b36aa5758b457b
      gender: formData.gender || undefined, /////baki kaj ekhane
      bloodGroup: formData.bloodGroup || undefined, /////baki kaj ekhane
      profileImage: formData.profileImage || undefined
    };

    setUser(updatedUser);
    
    setTimeout(() => {
      setIsSaving(false);
      alert("Profile updated successfully!");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">User Health Profile</h1>
         <p className="mt-2 flex items-baseline gap-2">
    <span className="text-2xl font-bold text-[#9B8EC7]">
      Hey {firstName},
    </span>
    
    <span className="text-sm text-slate-400">
      Please provide the information below to help us understand better.
    </span>
  </p>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-slate-200 mb-8">Personal Information</h2>

            {/* Profile Photo Section */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
              <div className="w-24 h-24 bg-[#1f2937] rounded-full flex items-center justify-center border border-slate-700 shadow-inner overflow-hidden">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={44} className="text-slate-500" />
                )}
              </div>
              
              <div className="text-center md:text-left">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
               <button 
  onClick={() => fileInputRef.current?.click()}
  className="text-[#9B8EC7] font-semibold flex items-center gap-2 hover:text-[#8a7db3] transition-colors mx-auto md:mx-0 group"
>
  <Upload size={18} className="group-hover:scale-110 transition-transform" /> 
  <span>Upload Photo</span>
</button>
                <p className="text-xs text-slate-500 mt-2 max-w-xs">
                  Upload profile image, it's best if it has the same length and height.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
             
            {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-400 text-sm font-medium ml-1">Email Address</label>
            <input 
              type="email" 
              defaultValue={user?.email} 
              disabled={!isEditing} 
              className={inputStyle}
              placeholder="yourname@example.com"
            />
          </div>

             {/* Age Field */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-400 text-sm font-medium ml-1">Age</label>
            <input 
              type="number" 
              defaultValue={user?.age} 
              disabled={!isEditing} 
              className={inputStyle}
              placeholder="Enter your age"
            />
          </div>

      

<<<<<<< HEAD
              {/* Height Field (Weight এর পরিবর্তে) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  Height (cm) <Ruler size={14} />
                </label>
                <input 
                  type="number"
                  placeholder="e.g. 165"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className="w-full bg-[#1f2937] border border-slate-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-600/50"
                />
              </div>

{/* Gender Section */}
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-400">Gender</label>
    <select 
      value={formData.gender}
      onChange={(e) => setFormData({...formData, gender: e.target.value})}
      className="w-full bg-[#1f2937] border border-slate-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-600/50 appearance-none"
    >
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>
  </div>

  {/* Blood Group Section */}
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-400">Blood Group</label>
    <select 
      value={formData.bloodGroup}
      onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
      className="w-full bg-[#1f2937] border border-slate-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-600/50 appearance-none"
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
=======
             {/* Height Field */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-400 text-sm font-medium ml-1">Height (cm)</label>
            <input 
              type="number" 
              defaultValue={user?.height} 
              disabled={!isEditing} 
              className={inputStyle}
              placeholder="e.g. 165"
            />
          </div>
>>>>>>> ea49fe0ad5650c7f785ff9ee31b36aa5758b457b

{/* Gender Section */}
  <div className="flex flex-col gap-2">
        <label className="text-slate-400 text-sm ml-1">Gender</label>
        <select 
          disabled={!isEditing}
          className={`p-3 rounded-xl border outline-none transition-all ${
            isEditing 
            ? "bg-slate-900 border-[#9B8EC7] text-white" 
            : "bg-slate-900/30 border-slate-800 text-slate-400 cursor-not-allowed"
          }`}
        >
          <option>{user?.gender || "Select Gender"}</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

  {/* Blood Group Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-slate-400 text-sm font-medium ml-1">Blood Group</label>
            <select 
              disabled={!isEditing}
              className={inputStyle}
              defaultValue={user?.bloodGroup || ""}
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

          <div className="mt-12 flex justify-end">
          <button 
            onClick={handleAction}
            className={`px-12 py-3 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg ${
              isEditing 
              ? "bg-[#9B8EC7] text-slate-950 hover:bg-[#8a7db3] shadow-[#9B8EC7]/10" 
              : "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 shadow-black/20"
            }`}
          >
            {isEditing ? "Save Changes" : "Edit Changes"}
          </button>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;