import React, { createContext, useContext, useState, useEffect } from "react";
import { type ActivityEntry, type User } from "../types";
import { useNavigate } from "react-router-dom";
import type { Credentials } from "../assets/types";
import mockApi from "../assets/mockApi";

// ১. কনটেক্সট টাইপ ডিফাইন করা (টাইপ সেফটির জন্য)
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

// ২. প্রোভাইডার কম্পোনেন্ট
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User>(null);
    const [isUserFetched, setIsUserFetched] = useState(() => localStorage.getItem('token') ? false : true);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);
    const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

    const signup = async (credentials: Credentials) => {
        const { data } = await mockApi.auth.register(credentials);
        setUser({ ...data.user, token: data.jwt } as User);
        if (data?.user?.name && data?.user?.dob && data?.user?.gender && data?.user?.bloodGroup) {
            setOnboardingCompleted(true);
        }
        localStorage.setItem('token', data.jwt);
    };

    const login = async (credentials: Credentials) => {
        const { data } = await mockApi.auth.login(credentials);
        setUser({ ...data.user, token: data.jwt } as User);
        if (data?.user?.name && data?.user?.dob && data?.user?.gender && data?.user?.bloodGroup) {
            setOnboardingCompleted(true);
        }
        localStorage.setItem('token', data.jwt);
    };

    const fetchUser = async (token: string) => {
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

// ৩. কাস্টম হুক
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};

// গুরুত্বপূর্ণ: ডিফল্ট এক্সপোর্ট যোগ করা হলো এরর ফিক্স করতে
export default AppProvider;