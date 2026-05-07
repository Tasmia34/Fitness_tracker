import { Route, Routes, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard" 

import ActivityLog from "./pages/ActivityLog"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import AiAssistant from "./pages/AiAssistant"
import Onboarding from "./pages/Onboarding"
import Layout from "./pages/Layout"
import { useAppContext } from "./context/Appcontext"

const App = () => {
  const { user, isUserFetched} = useAppContext()

  // ডাটা ফেচ হওয়া পর্যন্ত ওয়েটিং স্ক্রিন
  if (!isUserFetched) return <div className="h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>

  return (
    <Routes>
      {/* যদি লগইন না থাকে তবে লগইন পেজ, আর থাকলে ড্যাশবোর্ডে পাঠিয়ে দাও */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

      {/* প্রোটেক্টেড রাউটস: এখানে শুধু লগইন করা ইউজার ঢুকতে পারবে */}
      <Route path='/' element={user ? <Layout /> : <Navigate to="/login" />}>
        
        {/* যদি অনবোর্ডিং শেষ না হয়, তবে সবসময় অনবোর্ডিং পেজে পাঠাবে */}
        <Route index element={ <Dashboard /> }/>
        
        <Route path='activityLog' element={<ActivityLog />} />
	  <Route path='aiPlanner' element={<AiAssistant />} />
        <Route path='profile' element={<Profile />} /> 
        <Route path='onboarding' element={<Onboarding />} />
      </Route>

      {/* ভুল লিঙ্কে গেলে মেইন পেজে পাঠিয়ে দাও */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App