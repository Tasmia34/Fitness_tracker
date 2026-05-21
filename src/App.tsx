import { Route, Routes, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard" 
import ActivityLog from "./pages/ActivityLog"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import AiAssistant from "./pages/AiAssistant"
import Onboarding from "./pages/Onboarding"
import Layout from "./pages/Layout"
import { useAppContext } from "./context/Appcontext"
import Home from "./pages/Home" 

const App = () => {
  const { user, isUserFetched, onboardingCompleted } = useAppContext()

  if (!isUserFetched) return <div className="flex items-center justify-center h-screen font-bold text-blue-500 bg-slate-950">Loading...</div>

  return (
    <Routes>
      {/* 1. PUBLIC ROUTES (No Layout/Sidebar) */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />

      {/* 2. PROTECTED ROUTES */}
      {user ? (
        <>
          {/* Onboarding Flow */}
          {!onboardingCompleted ? (
            <Route path="/onboarding" element={<Onboarding />} />
          ) : (
            /* App Flow (With Sidebar) */
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/activityLog" element={<ActivityLog />} />
              <Route path="/aiPlanner" element={<AiAssistant />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          )}
          
          {/* Catch-all for logged in users: 
              If onboarded, go to dashboard; else, onboarding */}
          <Route path="*" element={<Navigate to={onboardingCompleted ? "/dashboard" : "/onboarding"} replace />} />
        </>
      ) : (
        /* Redirect all other paths to Home if not logged in */
        <Route path="*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  )
}

export default App