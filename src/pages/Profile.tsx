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
const { user, setUser } = useAppContext() as any;  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ১. লোকাল ফর্ম স্টেট - age এবং height এখন এক্সক্লুসিভলি শুধুমাত্র 'number' বা 'undefined'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    age: undefined as number | undefined,    // <--- স্ট্রিং পুরোপুরি রিমুভড
    height: undefined as number | undefined, // <--- স্ট্রিং পুরোপুরি রিমুভড
    gender: '',
    bloodGroup: '',
    profileImage: null as string | null
  });

  // ২. গ্লোবাল ইউজার ডাটা লোকাল স্টেটে সিঙ্ক করা
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        dob: user.dob || '',
        // এখানে ডাটা স্ট্রাকচার কনভার্ট করে নাম্বার ইনজেক্ট করা হচ্ছে
        age: user.age ? Number(user.age) : undefined,
        height: user.height ? Number(user.height) : undefined,
        gender: user.gender || '',
        bloodGroup: user.bloodGroup || '',
        profileImage: user.profileImage || null
      });
    }
  }, [user]);

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b1120] text-slate-400">
      Please login to view profile.
    </div>
  );

  const displayName = user?.name || user?.username || "Guest";
  const firstName = displayName.trim().split(' ')[0];

  const sky = "#60A5FA";
  const inputStyle = `w-full p-3 rounded-xl border outline-none transition-all duration-200 ${
    isEditing 
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
    
    const updatedUser: UserType = {
      ...user,
      name: formData.name,
      email: formData.email,
      // ইনপুট ভ্যালু ফাঁকা থাকলে ডাটাবেজে সাবমিট করার সময় undefined করে দেওয়া হচ্ছে
      age: formData.age ? Number(formData.age) : undefined,
      height: formData.height ? Number(formData.height) : undefined,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      profileImage: formData.profileImage
    };

    setUser(updatedUser);
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
    
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      alert("Profile updated successfully!");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">User Health Profile</h1>    
          <p className="mt-2 flex items-baseline gap-2 justify-center md:justify-start">
            <span className="text-2xl font-bold text-[#60A5FA]">
              Hey {firstName},
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Please provide the information below to help us understand better.
            </span>
          </p> 
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
                  disabled={!isEditing}
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!isEditing}
                  className={`text-[#60A5FA] font-bold flex items-center gap-2 hover:brightness-110 transition-all mx-auto md:mx-0 text-sm tracking-wide uppercase ${!isEditing && 'opacity-40 cursor-not-allowed'}`}
                >
                  <Upload size={18} /> 
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
                <label className="text-slate-900 dark:text-white text-sm font-bold tracking-wide ml-1">Email Address</label>
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
                <label className="text-slate-900 dark:text-white text-sm font-bold tracking-wide ml-1">Age</label>
                <input 
                  type="number" 
                  // ইনপুট বক্স যদি ফাঁকা বা undefined হয়, তবে ভ্যালু হিসেবে খালি স্ট্রিং দেখাবে
                  value={formData.age ?? ''}    
                  onChange={(e) => setFormData({
                    ...formData, 
                    age: e.target.value === '' ? undefined : Number(e.target.value)
                  })}
                  disabled={!isEditing} 
                  className={inputStyle}
                  placeholder="Enter your age"
                />
              </div>

              {/* Height Field */}
              <div className="flex flex-col gap-3">
                <label className="text-slate-900 dark:text-white text-sm font-bold tracking-wide ml-1">Height (cm)</label>
                <input 
                  type="number" 
                  value={formData.height ?? ''} 
                  onChange={(e) => setFormData({
                    ...formData, 
                    height: e.target.value === '' ? undefined : Number(e.target.value)
                  })}          
                  disabled={!isEditing} 
                  className={inputStyle}
                  placeholder="e.g. 165"
                />
              </div>

              {/* Gender Section */}
              <div className="flex flex-col gap-3">
                <label className="text-slate-900 dark:text-white text-sm font-bold tracking-wide ml-1">Gender</label>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  disabled={!isEditing}
                  className={inputStyle}
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Blood Group Selection */}
              <div className="flex flex-col gap-3">
                <label className="text-slate-900 dark:text-white text-sm font-bold tracking-wide ml-1">Blood Group</label>
                <select 
                  disabled={!isEditing}
                  className={inputStyle}
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                >
                  <option value="" disabled>Select Group</option>
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
                onClick={handleAction}
                disabled={isSaving}
                className={`px-14 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg ${
                  isEditing 
                  ? "bg-[#60A5FA] text-white shadow-[#60A5FA]/30" 
                  : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white"
                }`}
              >
                {isSaving ? "Saving..." : (isEditing ? "Save Changes" : "Edit Changes")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;