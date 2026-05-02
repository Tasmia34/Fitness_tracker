import { createContext, useContext, useState, useEffect } from "react";
import { initialState, type ActivityEntry, type User } from "../types";
import { useNavigate } from "react-router-dom";
import type { Credentials } from "../assets/types";
import mockApi from "../assets/mockApi";

const AppContext = createContext(initialState)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate()
    const [user, setUser] = useState<User>(null)
    const [isUserFetched, setIsUserFetched] = useState(() => localStorage.getItem('token') ? false : true)
    const [onboardingCompleted, setOnboardingCompleted] = useState(false)
    const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([])

    const signup = async (credentials: Credentials) => {
        const { data } = await mockApi.auth.register(credentials)
        setUser(data.user)
        // নতুন প্রোফাইল ফিল্ড অনুযায়ী অনবোর্ডিং চেক
        if (data?.user?.name && data?.user?.dob) {
            setOnboardingCompleted(true)
        }
        localStorage.setItem('token', data.jwt)
    }

    const login = async (credentials: Credentials) => {
        const { data } = await mockApi.auth.login(credentials)
        setUser({ ...data.user, token: data.jwt })
        if (data?.user?.name && data?.user?.dob) {
            setOnboardingCompleted(true)
        }
        localStorage.setItem('token', data.jwt)
    }

    const fetchUser = async (token: string) => {
        const { data } = await mockApi.user.me()
        setUser({ ...data, token })
        if (data?.name && data?.dob) {
            setOnboardingCompleted(true)
        }
        setIsUserFetched(true)
    }

    const fetchActivityLogs = async () => {
        const { data } = await mockApi.activityLogs.list()
        setAllActivityLogs(data)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        setOnboardingCompleted(false)
        navigate('/')
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return

        ;(async () => {
            await fetchUser(token)
            await fetchActivityLogs()
        })()
    }, [])

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
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)