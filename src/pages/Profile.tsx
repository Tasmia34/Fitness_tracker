import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/Appcontext';
import { User as UserIcon, Upload, Calendar, Ruler, Save } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    dob: user?.dob || '',
    age: user?.age || '',
    height: user?.height || '', // weight এর বদলে height
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
      ...user,
      name: formData.name,
      dob: formData.dob,
      age: Number(formData.age),
      height: Number(formData.height), // height সেভ করা হচ্ছে
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
          <p className="text-slate-400 mt-2">Please provide the information below to help us understand better.</p>
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
                  className="text-blue-500 font-semibold flex items-center gap-2 hover:text-blue-400 transition-colors mx-auto md:mx-0"
                >
                  <Upload size={18} /> Upload Photo
                </button>
                <p className="text-xs text-slate-500 mt-2 max-w-xs">
                  Upload profile image, it's best if it has the same length and height.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Full Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#1f2937] border border-slate-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-600/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Date of Birth</label>
                <input 
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  className="w-full bg-[#1f2937] border border-slate-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-600/50 [color-scheme:dark]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Age</label>
                <input 
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full bg-[#1f2937] border border-slate-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-blue-600/50"
                />
              </div>

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
            </div>

            <div className="mt-12 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
              >
                {isSaving ? "Saving..." : <><Save size={18} /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;