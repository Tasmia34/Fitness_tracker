// ১. মূল ইউজার টাইপ (আপনার নতুন প্রোফাইল ডিজাইন অনুযায়ী)
export type User = {
    id: string;
    username: string;
    email: string;
    token: string;
    name?: string;       
    dob?: string;        // Date of Birth
    age?: number;        
    height?: number; 
    profileImage?: string ;    
    documentId?: string;
    createdAt?: string;
} | null;

// ২. লগইন বা সাইনআপের জন্য শংসাপত্র
export type Credentials = {
    username?: string;
    email: string;
    password: string;
};

// ৩. ব্যায়াম বা অ্যাক্টিভিটি লগের এন্ট্রি
export interface ActivityEntry {
    id: number | string;
    name: string;
    duration: number;
    calories: number;
    date: string;
    documentId?: string;
}

// ৪. পুরো অ্যাপের কনটেক্সট টাইপ (এখান থেকেও Food বাদ দেওয়া হয়েছে)
export type AppContextType = {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    login: (credentials: Credentials) => Promise<void>;
    signup: (credentials: Credentials) => Promise<void>;
    fetchUser: (token: string) => Promise<void>;
    isUserFetched: boolean;
    logout: () => void;
    onboardingCompleted: boolean;
    setOnboardingCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    allActivityLogs: ActivityEntry[];
    setAllActivityLogs: React.Dispatch<React.SetStateAction<ActivityEntry[]>>;
};

// ৫. অ্যাপ শুরু হওয়ার সময় ডিফল্ট ডাটা
export const initialState: AppContextType = {
    user: null,
    setUser: () => {},
    login: async () => {},
    signup: async () => {},
    fetchUser: async () => {},
    isUserFetched: false,
    logout: () => {},
    onboardingCompleted: false,
    setOnboardingCompleted: () => {},
    allActivityLogs: [],
    setAllActivityLogs: () => {},
};