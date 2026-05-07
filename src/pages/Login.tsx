import { AtSignIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/Appcontext"

// এই লাইনটি তোমার ফাইলের পাথ অনুযায়ী ইমেজ ইমপোর্ট করছে
import loginImage from "../assets/login.png"

interface AuthError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}

const Login: React.FC = () => {
  const [state, setState] = useState<'login' | 'signup'>('login')
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const navigate = useNavigate()
  const { login, signup, user } = useAppContext()

  /*  -- to remove the functionality of auto redirecting the user to homepage while he is logged in
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])
*/

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
    if (state === 'signup' && !passwordRegex.test(password)) {
      alert("Password must be at least 8 characters long and contain at least one uppercase letter.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (state === 'login') {
        await login({ email, password });
      } else {
        await signup({ username, email, password });
      }
      navigate('/');
    } catch (error) {
      const err = error as AuthError;
      console.error("Authentication Error:", err);
      alert(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* 🖼️ Left Side: Image Content */}
      {/* মোবাইল ফোনে (hidden), এবং বড় স্ক্রিনে (md:flex) বাম পাশে দেখাবে */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-12 bg-slate-100 dark:bg-slate-900 border-r dark:border-slate-800">
        <div className="text-center max-w-lg">
            <img 
              src={loginImage} 
              alt="Fitness Tracker Illustration" 
              className="w-full h-auto mb-10 drop-shadow-2xl rounded-2xl transform transition hover:scale-105 duration-500" 
            />
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Start Your <span className="text-sky-500">Fitness Journey</span> Today.
            </h1>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg font-medium">
              Track calories, log activities, and transform your lifestyle with our easy-to-use platform.
            </p>
        </div>
      </div>

      {/* 📝 Right Side: Login/Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md p-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
          <header className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {state === 'login' ? "Sign In" : "Sign Up"}
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              {state === 'login' ? 'Great to see you again! Please log in.' : 'Fill in the details to create your free account.'}
            </p>
          </header>

          {/* Username (Only for Sign Up) */}
          {state !== 'login' && (
            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <div className="relative mt-2">
                <AtSignIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
                <input 
                  onChange={(e) => setUsername(e.target.value)} 
                  value={username}
                  type="text" 
                  placeholder="Amélie Laurent" 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 transition-all outline-none"
                  required 
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mt-5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative mt-2">
              <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
              <input 
                onChange={(e) => setEmail(e.target.value)} 
                value={email}
                type="email" 
                placeholder="example@gmail.com" 
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 transition-all outline-none"
                required 
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-5">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative mt-2">
              <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-5" />
              <input 
                onChange={(e) => setPassword(e.target.value)} 
                value={password}
                placeholder="••••••••••••" 
                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 transition-all outline-none"
                required
                type={showPassword ? 'text' : 'password'}
              />
              <button 
                type="button" 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-500 transition-colors"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full mt-10 py-4 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-sky-500/20 active:scale-[0.98]"
          >
            {isSubmitting ? "Processing..." : state === "login" ? 'Sign In' : 'Create Account'}
          </button>

          {/* Toggle State */}
          <div className="mt-8 text-center text-sm">
            {state === 'login' ? (
              <p className="text-slate-600 dark:text-slate-400">
                Don't have an account?{" "}
                <button 
                  type="button"
                  onClick={() => setState('signup')} 
                  className="text-sky-600 hover:text-sky-700 font-bold underline-offset-4 hover:underline"
                >
                  Sign up for free
                </button>
              </p>
            ) : (
              <p className="text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <button 
                  type="button"
                  onClick={() => setState('login')} 
                  className="text-sky-600 hover:text-sky-700 font-bold underline-offset-4 hover:underline"
                >
                  Log in here
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </main>
  )
}

export default Login