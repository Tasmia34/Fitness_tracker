import { dummyUser, dummyActivityLogs } from "../assets/assets";
import type { User, ActivityEntry } from "../types";

// DB interface is updated so that type safety is maintained
interface DB {
    user: User | null;
    activityLogs: ActivityEntry[];
}

const getDB = (): DB => {
    const dbStr = localStorage.getItem('fitness_db');
    if (!dbStr) {
        return {
            user: null,
            activityLogs: [],
        };
    }
    return JSON.parse(dbStr);
};

const saveDB = (db: DB) => {
    localStorage.setItem('fitness_db', JSON.stringify(db));
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockApi = {
    auth: {
       login: async (credentials: any) => {
    await delay(500);
    let db = getDB();

    // কেস ১: যদি ডাটাবেজে ইউজার না থাকে (অর্থাৎ রেজিস্ট্রেশন করা হয়নি)
    if (!db.user) {
        throw {
            response: {
                data: { message: "No account found with this email. Please Sign Up first." }
            }
        };
    }

    // কেস ২: ইউজার আছে কিন্তু পাসওয়ার্ড ভুল
    // (নোট: রেজিস্ট্রেশন করার সময় পাসওয়ার্ড সেভ করা থাকতে হবে)
    if (db.user.password && db.user.password !== credentials.password) {
        throw {
            response: {
                data: { message: "Incorrect password! Please try again." }
            }
        };
    }

    // কেস ৩: ইউজার এবং পাসওয়ার্ড দুইটাই সঠিক
    return {
        data: {
            user: db.user,
            jwt: "mock_jwt_token_" + Date.now(),
        },
    };
},
        register: async (credentials: any) => {
            await delay(500);
            const db = getDB();

            db.user = {
                id: "user_" + Date.now(),
                username: credentials.username,
                email: credentials.identifier || credentials.email,
                password: credentials.password,
                token: "mock-jwt-token-" + Date.now(), // added a string token 
                name: "",
                dob: "",
                age: 0,
                height: 0, 
                gender: "", 
                bloodGroup: "", 
                createdAt: new Date().toISOString(),
            };
            db.activityLogs = [];
            saveDB(db);

            return {
                data: {
                    user: db.user,
                    jwt: "mock_jwt_token_" + Date.now(),
                },
            };
        }
    },
    user: {
        me: async () => {
            await delay(300);
            const db = getDB();
            return { data: db.user || dummyUser };
        },
        update: async (_id: string, updates: Partial<User>) => {
            await delay(300);
            const db = getDB();
            if (db.user) {
                db.user = { ...db.user, ...updates };
                saveDB(db);
            }
            return { data: db.user };
        }
    },
    activityLogs: {
        list: async () => {
            await delay(300);
            const db = getDB();
            return { data: db.activityLogs };
        },
        create: async (payload: { data: { name: string; duration: number; calories: number } }) => {
            await delay(300);
            const db = getDB();
            const newEntry: ActivityEntry = {
                id: Date.now(),
                documentId: "doc_act_" + Date.now(),
                name: payload.data.name,
                duration: payload.data.duration,
                calories: payload.data.calories,
                date: new Date().toISOString().split("T")[0],
                createdAt: new Date().toISOString(),
            };
            db.activityLogs.push(newEntry);
            saveDB(db);
            return { data: newEntry };
        },
        delete: async (documentId: string) => {
            await delay(300);
            const db = getDB();
            db.activityLogs = db.activityLogs.filter(a => a.documentId !== documentId);
            saveDB(db);
            return { data: { id: documentId } };
        }
    }
};

export default mockApi;

/*
এখনই এটি সরানোর দরকার নেই। আপনার অ্যাপটি যখন পুরোপুরি তৈরি হয়ে যাবে 
এবং আপনি আসল ডাটাবেজ (যেমন MongoDB বা Firebase) ব্যবহার শুরু করবেন, 
তখন আমরা এই লাইনটি এবং পুরো mockApi ফাইলটিই ফেলে দেব। এখন এটি থাকলে আপনার ডেভেলপমেন্ট এবং ডিজাইন চেক করতে সুবিধা হবে।
*/