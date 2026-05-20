import { useAppContext } from "../context/Appcontext";
import { NavLink } from "react-router-dom";
import { ActivityIcon, HomeIcon, UserIcon , Moon, Sun , LogOut} from "lucide-react";
import {  LayoutDashboard, Bot } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAppContext(); // take logout function from conext

  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/profile', label: 'Profile', icon: UserIcon },

    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/activityLog', label: 'Activity', icon: ActivityIcon }, 
    { path: '/aiPlanner', label: 'AI Assistant', icon: Bot },
        // { path: '/login', label: 'Login/Signup', icon: LockIcon },

  ];

  return (
    <nav className="sticky top-0 flex flex-col w-20 h-screen p-4 transition-colors duration-200 bg-white border-r sm:w-64 dark:bg-slate-900 border-slate-100 dark:border-slate-800 sm:p-6">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Health Monitor</h1>
      </div>

      <div className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Theme Toggle Button */}

      <div className="pt-4 mt-auto space-y-2 border-slate-100 dark:border-slate-800">
      {/* Theme Change Button */}


      <div className="pt-4 mt-auto space-y-2 border-t border-slate-100 dark:border-slate-800">
      <button
        onClick={toggleTheme}
        className="flex items-center gap-3 px-4 py-3 mt-auto transition-all rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        <span className="font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
      </button>

        <button 
          onClick={logout}
          className="flex items-center w-full gap-3 px-4 py-3 text-blue-500 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
</div>
</div>
    </nav>

  );
};

export default Sidebar;