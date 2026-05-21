import React, { createContext, useContext, useState, useEffect } from "react";
import { type ActivityEntry, type User } from "../types";
import { useNavigate } from "react-router-dom";
import type { Credentials } from "../assets/types";
import mockApi from "../assets/mockApi";

// ১. to define context type (for type safety)
interface AppContextType {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    isUserFetched: boolean;
    fetchUser: (token: string) => Promise<void>;
    signup: (credentials: Credentials) => Promise<void>;
    login: (credentials: Credentials) => Promise<void>;
    logout: () => void;
    onboardingCompleted: boolean;
    setOnboardingCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    allActivityLogs: ActivityEntry[];
    setAllActivityLogs: React.Dispatch<React.SetStateAction<ActivityEntry[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ২. provider component 

    export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState<User>(() => {
        const savedUser = localStorage.getItem('user_data');
        return savedUser ? JSON.parse(savedUser) : null;
    });   

    const [isUserFetched, setIsUserFetched] = useState(() => localStorage.getItem('token') ? false : true);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);
    const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

    // lifecycle management: update user data in local storage
    useEffect(() => {
        if (user) {
            localStorage.setItem('user_data', JSON.stringify(user));
        } else {
            localStorage.removeItem('user_data');
        }
    }, [user]);

    // on app load, fetch data from local storage--is it needed?
    // useEffect(() => {
    //     const savedUser = localStorage.getItem('user_data');
    //     if (savedUser && !user) {
    //         setUser(JSON.parse(savedUser));
    //     }
    // }, []);
    
    const signup = async (credentials: Credentials) => {
        const { data } = await mockApi.auth.register(credentials);
        const newUser = { ...data.user, token: data.jwt } as User;
        setUser(newUser);
        if (data?.user?.name && data?.user?.dob && data?.user?.gender && data?.user?.bloodGroup) {
            setOnboardingCompleted(true);
        }
        localStorage.setItem('token', data.jwt);
    };

    const login = async (credentials: Credentials) => {
        const { data } = await mockApi.auth.login(credentials);
        const newUser = { ...data.user, token: data.jwt } as User;
        setUser(newUser);
        if (data?.user?.name && data?.user?.dob && data?.user?.gender && data?.user?.bloodGroup) {
            setOnboardingCompleted(true);
        }
        localStorage.setItem('token', data.jwt);
    };

   const fetchUser = async (token: string) => {
        // ৩. ফিক্স: যদি অলরেডি localStorage-এ ফুল ইউজার ডাটা থাকে, তবে মক এپیআই দিয়ে ওভাররাইট করব না
        const savedUser = localStorage.getItem('user_data');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsUserFetched(true);
            return; // এখান থেকেই ব্যাক করে যাবে, মক এپیআই কল করে ডাটা নষ্ট করবে না
        }

        const { data } = await mockApi.user.me();
        setUser({ ...data, token } as User);
        if (data?.name && data?.dob && data?.gender && data?.bloodGroup) {
            setOnboardingCompleted(true);
        }
        setIsUserFetched(true);
    };

    const fetchActivityLogs = async () => {
        const { data } = await mockApi.activityLogs.list();
        setAllActivityLogs(data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_data');
        setUser(null);
        setOnboardingCompleted(false);
        navigate('/');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        (async () => {
            await fetchUser(token);
            await fetchActivityLogs();
        })();
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
        setAllActivityLogs
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

//custom hook 
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};

export default AppProvider;