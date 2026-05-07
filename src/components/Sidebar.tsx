import { NavLink } from "react-router-dom";
import { ActivityIcon,  UserIcon,  Moon, Sun, LayoutDashboard, Bot } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/profile', label: 'Profile', icon: UserIcon },
    { path: '/activityLog', label: 'Activity', icon: ActivityIcon }, 
    { path: '/aiPlanner', label: 'AI Assistant', icon: Bot },
    
  ];

  return (
    <nav className="flex flex-col w-20 sm:w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-4 sm:p-6 transition-colors duration-200 sticky top-0">
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

      {/* Theme Change Button */}
      <button
        onClick={toggleTheme}
        className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        <span className="font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
      </button>
    </nav>
  );
};

export default Sidebar;