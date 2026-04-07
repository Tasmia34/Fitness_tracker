import { AtSignIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/Appcontext"

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

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (state === 'login') {
        // Calls the login function from context
        await login({ email, password });
      } else {
        // Calls the signup function from context
        await signup({ username, email, password });
      }
      // Navigation happens automatically via the useEffect above when 'user' updates
    } catch (error) {
      const err = error as AuthError;
      console.error("Authentication Error:", err);
      alert(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#020617] p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-[#0f172a] rounded-xl shadow-lg border border-gray-800">
        <h2 className="text-3xl font-semibold text-[#3371A3]">
          {state === 'login' ? "Sign In" : "Sign Up"}
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          {state === 'login' ? 'Please enter email and password to access.' : 'Please enter your details to create an account.'}
        </p>

        {/* Username (Only for Sign Up) */}
        {state !== 'login' && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-300">Username</label>
            <div className="relative mt-2">
              <AtSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 size-5" />
              <input 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} 
                value={username}
                type="text" 
                placeholder="Enter a username" 
                className="w-full pl-10 pr-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required 
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300">Email</label>
          <div className="relative mt-2">
            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 size-5" />
            <input 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
              value={email}
              type="email" 
              placeholder="Enter your email" 
              className="w-full pl-10 pr-4 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required 
            />
          </div>
        </div>

        {/* Password */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300">Password</label>
          <div className="relative mt-2">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 size-5" />
            <input 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
              value={password}
              placeholder="Enter your password" 
              className="w-full pl-10 pr-12 py-2 bg-[#1e293b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
              type={showPassword ? 'text' : 'password'}
            />
            <button 
              type="button" 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white focus:outline-none"
              onClick={() => setShowPassword((p) => !p)}
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full mt-8 py-3 px-4bg-[#3371A3] hover:bg-[#285A82] disabled:bg-[#1E4361] disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-md"
        >

          {isSubmitting ? "Processing..." : state === "login" ? 'Login' : 'Create Account'}
        </button>

        {/* Toggle State */}
        <div className="mt-6 text-center text-sm text-gray-400">
          {state === 'login' ? (
            <p>
              Don't have an account?{" "}
              <button 
                type="button"
                onClick={() => setState('signup')} 
                className="text-[#3371A3] hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button 
                type="button"
                onClick={() => setState('login')} 
                className="text-[#3371A3] hover:underline font-medium"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </form>
    </main>
  )
}

export default Login