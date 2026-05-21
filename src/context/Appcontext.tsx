import React, { createContext, useContext, useState, useEffect } from "react";
import { type ActivityEntry, type User } from "../types";
import { useNavigate } from "react-router-dom";
import type { Credentials } from "../assets/types";
import mockApi from "../assets/mockApi";

interface AppContextType {
  user: User | null; // Fixed type to allow null
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isUserFetched: boolean;
  fetchUser: (token: string) => Promise<void>;
  signup: (credentials: Credentials) => Promise<void>;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  onboardingCompleted: boolean;
  setOnboardingCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  allActivityLogs: ActivityEntry[];
  setAllActivityLogs: React.Dispatch<React.SetStateAction<ActivityEntry[]>>;
  updateUserProfile: (updates: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Validation helper updated to match your new requirements (dob, gender, height)
const checkIsOnboardingComplete = (userData: any): boolean => {
  // Add some console logs to debug what's happening
  console.log("Checking user data:", userData);
  const isComplete = !!(userData?.dob && userData?.gender && userData?.height);
  console.log("Is onboarding complete?", isComplete);
  return isComplete;
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  // Initialize state directly from localStorage to prevent "flicker" on refresh
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user_data");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(() => {
    const savedUser = localStorage.getItem("user_data");
    return savedUser ? checkIsOnboardingComplete(JSON.parse(savedUser)) : false;
  });

  const [isUserFetched, setIsUserFetched] = useState<boolean>(() => 
    !localStorage.getItem("token")
  );

  const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

  // Keep localStorage synced
  useEffect(() => {
    if (user) {
      localStorage.setItem("user_data", JSON.stringify(user));
      setOnboardingCompleted(checkIsOnboardingComplete(user));
    } else {
      localStorage.removeItem("user_data");
    }
  }, [user]);

  const signup = async (credentials: Credentials) => {
    const { data } = await mockApi.auth.register(credentials);
    const newUser = { ...data.user, token: data.jwt } as User;
    setUser(newUser);
    localStorage.setItem("token", data.jwt);
    setIsUserFetched(true);
  };
const login = async (credentials: Credentials) => {
    const { data } = await mockApi.auth.login(credentials);
    const userId = data.user.id; // Get the persistent ID
    
    // Retrieve any locally saved profile data for THIS specific user ID
    const savedProfiles = JSON.parse(localStorage.getItem("user_profiles") || "{}");
    const localProfile = savedProfiles[userId] || {};
    
    // Merge: API user data + the local profile metrics
    const updatedUser = { 
      ...data.user, 
      ...localProfile, 
      token: data.jwt 
    } as User;
    setUser(updatedUser);
    setOnboardingCompleted(checkIsOnboardingComplete(updatedUser));
    localStorage.setItem("token", data.jwt);
    setIsUserFetched(true);
  };


const fetchUser = async (token: string) => {
    try {
      const { data } = await mockApi.user.me();
      const userId = data.id;
      
      const savedProfiles = JSON.parse(localStorage.getItem("user_profiles") || "{}");
      const localProfile = savedProfiles[userId] || {};
      
      const updatedUser = { ...data, ...localProfile, token } as User;
      
      setUser(updatedUser);
      setOnboardingCompleted(checkIsOnboardingComplete(updatedUser));
    } catch (err) {
      logout();
    } finally {
      setIsUserFetched(true);
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_data");
    setUser(null);
    setOnboardingCompleted(false);
    setIsUserFetched(true);
    navigate("/login");
  };

 const updateUserProfile = (updates: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updated = { ...prevUser, ...updates };
      
      // Save to a keyed storage object
      const savedProfiles = JSON.parse(localStorage.getItem("user_profiles") || "{}");
      savedProfiles[updated.id] = { ...savedProfiles[updated.id], ...updated };
      localStorage.setItem("user_profiles", JSON.stringify(savedProfiles));
      
      if (checkIsOnboardingComplete(updated)) {
        setOnboardingCompleted(true);
      }
      return updated;
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
      mockApi.activityLogs.list().then(res => setAllActivityLogs(res.data));
    }
  }, []);

  const value = {
    user,
    setUser,
    isUserFetched,
    fetchUser,
    signup,
    login,
    logout,
    onboardingCompleted,
    setOnboardingCompleted,
    allActivityLogs,
    setAllActivityLogs,
    updateUserProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppProvider");
  return context;
};

export default AppProvider;