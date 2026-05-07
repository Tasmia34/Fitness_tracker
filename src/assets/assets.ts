import type { User, ActivityEntry } from "../types";

// ১. dummy user data 
export const dummyUser: User = {
    id: "user_123",
    username: "DemoUser",
    name: "Demo User",
    email: "demo@example.com",
    password: "Password123!", // পাসওয়ার্ড ভ্যালিডেশনের জন্য
    age: 30,
    height: 175,
    gender: "Male",
    bloodGroup: "O+",
    token: "mock_jwt_token_demo",
    createdAt: new Date().toISOString(),
};

// ২. ডামি অ্যাক্টিভিটি লগ ডেটা
export const dummyActivityLogs: ActivityEntry[] = [
    {
        id: 1,
        documentId: "doc_act_1",
        name: "Morning Run",
        duration: 30,
        calories: 300,
        date: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
    },
];

// ৩. কুইক অ্যাক্টিভিটি লিস্ট (সাইডবার বা ড্যাশবোর্ডের জন্য)
export const quickActivities = [
    { name: "Walking", emoji: "🚶", rate: 5 },
    { name: "Running", emoji: "🏃", rate: 11 },
    { name: "Cycling", emoji: "🚴", rate: 8 },
    { name: "Swimming", emoji: "🏊", rate: 10 },
    { name: "Yoga", emoji: "🧘", rate: 4 },
    { name: "Weight Training", emoji: "🏋️", rate: 6 },
];

// ৪. রক্তদানের গ্রুপ অপশন (প্রোফাইল পেজের জন্য ব্যবহার করতে পারেন)
export const bloodGroupOptions = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
];

// ৫. বয়স অনুযায়ী ক্যালরি বার্ন গাইড (যদি ড্যাশবোর্ডে দেখাতে চান)
export const ageRanges = [
    { max: 30, burnGoal: 500 },
    { max: 45, burnGoal: 450 },
    { max: 60, burnGoal: 400 },
    { max: 120, burnGoal: 300 },
];

// ৬. মোটিভেশনাল মেসেজ জেনারেটর
export const getMotivationalMessage = (activeMinutes: number) => {
    if (activeMinutes === 0) {
        return { text: "Ready to crush today? Start moving!", emoji: "💪" };
    }
    if (activeMinutes >= 60) {
        return { text: "You're an athlete! Amazing consistency.", emoji: "🔥" };
    }
    if (activeMinutes >= 30) {
        return { text: "Great workout today! Keep it up!", emoji: "✨" };
    }
    return { text: "Every step counts. You've got this!", emoji: "🚀" };
};