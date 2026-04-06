import { Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import FoodLog from "./pages/FoodLog"
import ActivityLog from "./pages/ActivityLog"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Onboarding from "./pages/Onboarding"
import Layout from "./pages/Layout"

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<Dashboard />} />
        <Route path='food' element={<FoodLog />} />
        <Route path='activityLog' element={<ActivityLog />} />
        <Route path='login' element={<Login />} />
        <Route path='profile' element={<Profile />} /> 
        <Route path='onboarding' element={<Onboarding />} />
      </Route>
    </Routes>
  )
}

export default App