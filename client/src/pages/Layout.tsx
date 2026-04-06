import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

const Layout = () => {
  return (
    // 'flex' puts Sidebar and Content side-by-side
    // 'h-screen' ensures the layout fills the whole window
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        
        {/* Fixed Sidebar */}
        <Sidebar/>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            <Outlet/>
        </div>
        
    </div>
  )
}

export default Layout