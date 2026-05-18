import React from 'react';
import { useAppContext } from '../context/Appcontext';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Activity, ArrowRight, LogIn, BarChart3, Droplet, Layout, TrendingUp, Scale ,CheckCircle2} from 'lucide-react';



const ProductShowroom = () => {
  // আপনার প্রজেক্টের ফিচার এবং স্ক্রিনশটের ডাটা
  const showcaseData = [
    {
      title: "See Your Dashboard",
      desc: "Get instant insights into your vitals with our intuitive dark mode dashboard. Monitor your calculated BMI (Current: 24.5 - Healthy) and view your updated weight and height statistics at a single glance.",
      list: ["Automated BMI & Health Status Calculation", "Monitor Diastolic/Systolic Ranges", "Understand daily vital impacts"],
      // এখানে আপনার রক্তচাপ বা ড্যাশবোর্ডের স্ক্রিনশট দিন
      imgUrl: "/dashboard_dark.png", 
      isLeft: false // টেক্সট ডান পাশে, ছবি বাম পাশে
    },

    {
      title: "Track Your Unique Body Cycles",
      desc: "Stay effortlessly in sync with your body's natural rhythms. Our interactive cycle monitor visualizes your current status—like the Follicular Phase—and highlights your exact countdown, showing your next period timeline with beautiful circular progress metrics.",
      list: [ "Real-time countdown (e.g., Next Period in 17 Days)",
            "Track current cycle phases and day logs (Day 12 of 28)",
             "Quick logging with interactive status updates"],
      imgUrl: "/menstraul_incator.png", 
      isLeft: true // টেক্সট ডান পাশে, ছবি বাম পাশে
    },

    {
  title: "Visualize Your Health Evolution",
  desc: "Watch your progress unfold over time. Our sophisticated monthly analytics automatically transform your raw logs into smooth, interactive line charts.",
  list: [
    "Interactive toggles for Weight, Sugar, and BP metrics",
    "Smooth visual curves highlighting progress and plateaus",
    "Historical monthly filters to review past achievements"
  ],
  imgUrl: "/Monthly_trends.png", // public ফোল্ডারে থাকা আপনার রিয়েল গ্রাফ স্ক্রিনশটের নাম
  isLeft: false // অল্টারনেটিং লেআউট মেনটেইন করার জন্য এটি বাম পাশে থাকবে
     },

    {
  title: "Interactive Live-Hover Tooltips",
  desc: "Get deep data visibility instantly. Our smart charts come with interactive hover tooltips, allowing you to seamlessly glide your cursor over the bars to see exact, real-time breakdowns of your sugar levels and systolic pressure metrics for any specific date.",
  list: [
    "Dynamic live-hover tooltip box for accurate metrics",
    "Real-time breakdown of sugar and systolic readings per day",
    "Fluid, responsive transitions for an immersive data experience"
  ],
  imgUrl: "/weekly_charts.png",
  isLeft: true 
  },
    {
  title: "Never Miss a Beat with Smart Log Alerts",
  desc: "Keep your health timeline perfectly accurate.It's effortless tracking that makes sure your personal history stays complete.",
  list: [
    "Clean and intuitive layout alerts for empty tracking days",
    "Instant one-click shortcuts (+ Create log for this date) to save time",
    "Seamless navigation that helps you maintain a flawless health timeline"
  ],
  imgUrl: "/activity log_no_dark.png", // public ফোল্ডারে থাকা আপনার এই অ্যাক্টিভিটি লগের স্ক্রিনশটের নাম
  isLeft: false 
}
  ];

  return (
    <div className="py-24 bg-white dark:bg-[#0b1120] text-slate-900 dark:text-white transition-colors duration-300 space-y-40">
      <div className="max-w-6xl px-6 mx-auto">
        
        {showcaseData.map((section, index) => (
          <div 
            key={index}
            className={`flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24 ${
              section.isLeft ? '' : 'lg:flex-row-reverse'
            }`}
          >
            {/* টেক্সট সাইড (WHOOP স্টাইল - একদম মিনিমাল ও স্পেসিয়াস) */}
            <div className="flex-1 max-w-xl space-y-6">
              <h2 className="text-4xl font-black leading-tight tracking-tight md:text-5xl text-slate-900 dark:text-white">
                {section.title}
              </h2>
              <p className="text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                {section.desc}
              </p>
              
              {/* চেকলিস্ট */}
              <ul className="pt-2 space-y-4">
                {section.list.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 font-semibold text-slate-700 dark:text-slate-300">
                    <CheckCircle2 size={20} className="text-[#0055FF] flex-shrink-0" />
                    <span className="text-base md:text-lg">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                {/* <button className="flex items-center gap-2 text-[#0055FF] font-black group hover:gap-4 transition-all uppercase tracking-widest text-sm">
                  Learn how it works <ArrowRight size={18} />
                </button> */}
              </div>
            </div>

            {/* image side perfect side  */}
            <div className="flex-1 w-full max-w-lg">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <img 
                  src={section.imgUrl} 
                  alt={section.title} 
                  className="w-full h-full aspect-square md:aspect-auto object-cover rounded-[2.5rem]" 
                />
              </div>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
};



const FeatureGrid = () => {
  const navigate = useNavigate();
  const features = [
    {
      title: "Track BMI & Health Status",
      desc: "Monitor your BMI (Current: 19.5) and keep your weight in check.",
      icon: <Scale size={24} />,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500"
    },
    {
      title: "Blood Glucose & BP",
      desc: "Keep a log of your Sugar (12) and Blood Pressure (118/78).",
      icon: <Droplet size={24} />,
      bgColor: "bg-red-50",
      iconColor: "text-red-500"
    },
    {
      title: "Weekly Health Reports",
      desc: "Generate detailed visual charts to analyze your progress.",
      icon: <BarChart3 size={24} />,
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-500"
    },
    {
      title: "AI Health Assistant",
      desc: "Get personalized health tips and suggestions from our AI.",
      icon: <TrendingUp size={24} />,
      bgColor: "bg-green-50",
      iconColor: "text-green-500"
    },
    {
      title: "Activity Tracking",
      desc: "Set daily goals and track your workouts seamlessly.",
      icon: <Activity size={24} />,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500"
    },
    {
      title: "Monthly Trend Analysis",
      desc: "See how your health indicators change over the month.",
      icon: <Layout size={24} />,
      bgColor: "bg-teal-50",
      iconColor: "text-teal-500"
    }
  ];

  return (
    <div className="py-12 bg-white dark:bg-[#111827] rounded-[3rem] px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Upper text */}
      <div className="max-w-2xl mx-auto mb-16 border-l-4 border-[#31a8d3] pl-6 py-2 text-left">
  <p className="text-xl font-extrabold leading-snug md:text-2xl text-slate-800 dark:text-slate-100">
    "Your body speaks through data. Every weight input, sugar level, and cycle log builds the map to a healthier you."
  </p>
  <p className="mt-2 text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
    Health Monitor Command Center
  </p>
</div>

        {/* গ্রিড সেকশন (ডার্ক মোড ফিক্সড) */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {features.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center gap-6 p-6 bg-[#fdfaf7] dark:bg-[#1e293b] rounded-[2rem] border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-default"
            >
              {/* গোলাকার আইকন হোল্ডার */}
              <div className={`${item.bgColor} dark:bg-opacity-10 p-4 rounded-full ${item.iconColor} shadow-sm`}>
                {item.icon}
              </div>
              
              {/* টেক্সট সেকশন */}
              <div className="flex-1">
                <h3 className="text-lg font-bold leading-tight text-slate-800 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* অ্যাকশন বাটন */}
        <div className="mt-12 text-center">

          <button
             onClick={() => navigate('/profile')}

          className="bg-[#e34234] hover:bg-[#c33226] text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-lg active:scale-95">
            Start my journey with Health Monitor
          </button>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] || "User";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] p-6 md:p-12 transition-colors duration-300">
    <div className="max-w-5xl mx-auto space-y-24">

       {/* Predictive Health Hero Section */}
<div className="flex flex-col items-center justify-between gap-12 py-12 transition-colors duration-300 lg:flex-row lg:gap-20 md:py-20">
  
  {/* বাম পাশ: কন্টেন্ট এবং গেট স্টার্টেড বাটন */}
  <div className="flex-1 max-w-xl space-y-6 text-left">
    
    {/* উপরের ফ্যান্সি বার/ব্যাজ (Gradient Badge) */}
    <div className="inline-flex items-center gap-2 px-4 py-2 border rounded-full shadow-sm bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-blue-950/40 border-cyan-100/80 dark:border-cyan-900/30">
      <span className="text-base">❤️</span>
      <span className="text-xs font-bold tracking-wide md:text-sm text-slate-800 dark:text-slate-200">
        Welcome To Health Monitoring Platform
      </span>
    </div>

    {/* ফ্যান্সি বোল্ড টেক্সট */}
    <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] uppercase">
      Know Your <span className="bg-gradient-to-r from-[#0055FF] to-cyan-400 bg-clip-text text-transparent">Vitals</span>  <br />
      Own Your Health
    </h1>

    {/* সাব-ডেসক্রিপশন */}
    <p className="text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">
      Advanced AI that doesn’t just track, but predicts potential health issues before they become problems. Giving you time to act early, stay safe, and stay healthy.
    </p>
    
    {/* ক্লিকেবল গেট স্টার্টেড বাটন (যা লগইন পেজে নিয়ে যাবে) */}
    <div className="pt-4">
      <button 

                  onClick={() => navigate('/login')}
        className="bg-[#0055FF] hover:bg-[#0044DD] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-200 active:scale-95 shadow-xl shadow-blue-500/20"
      >
        Get Started →
      </button>
    </div>
  </div>

  {/* ডান পাশ: রিয়েল ইমেজ এবং ফ্লোটিং কার্ডস (WHOOP/Predictive Style) */}
  <div className="relative flex-1 w-full max-w-lg">
    
    {/* মেইন ইমেজ কন্টেইনার (কোনো চ্যাপ্টা বা বার ইফেক্ট নেই) */}
    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 aspect-[4/5] w-full">
      <img 
        src="https://i.pinimg.com/736x/a8/da/59/a8da5917f5f82c792717546169a21b2a.jpg"
        alt="Predictive Health Diagnostics" 
        className="object-cover w-full h-full"
      />
      {/* ইমেজের ওপরের হালকা সিনেমাটিক ওভারলে */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent"></div>
    </div>

    {/* টপ ফ্লোটিং কার্ড: Early Detection Alert */}
    <div className="absolute -top-4 right-4 bg-white dark:bg-[#111827] px-5 py-3 rounded-full shadow-lg border border-slate-100 dark:border-slate-800 flex items-center gap-3">
      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
      <span className="text-xs font-black tracking-widest uppercase text-slate-800 dark:text-white">Early Detection Alert</span>
    </div>

    {/* বটম ফ্লোটিং কার্ড: AI Prediction Status */}
    <div className="absolute -bottom-6 left-6 right-6 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800/80">
      <div className="flex items-center gap-2 text-[#0055FF] text-xs font-black uppercase tracking-widest mb-2">
        <span>✦</span> AI Prediction
      </div>
      <p className="text-sm font-bold leading-snug text-slate-800 dark:text-white">
        Blood glucose levels indicate pre-diabetic trend. Taking action now can prevent diabetes development.
      </p>
      <div className="mt-3 text-xs font-bold text-slate-400 dark:text-slate-500">
        Body Mass Index  :  29.7
      </div>
    </div>
  </div>
</div>


        {/* ওয়েলকাম ব্যানার
        <header>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Hello, <span className="text-[#0055FF]">{firstName}!</span>
          </h1>
          <p className="max-w-2xl mt-4 text-xl font-medium text-slate-500 dark:text-slate-400">
            Welcome to your health command center. Monitor your vitals and stay on track with your goals.
          </p>
        </header> */}

        {/* কুইক অ্যাক্সেস গ্রিড */}
        {/* <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"> */}
         

         

          

        {/* FeatureGrid component */}
        <FeatureGrid />
         {/* ProductShowroom component */}

        <ProductShowroom />

        {/* মোটিভেশনাল সেকশন */}
        <div className="p-8 bg-gradient-to-r from-[#0055FF] to-[#0088FF] rounded-[2.5rem] text-white shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="text-2xl italic font-black">Visualize Your Progress. Master Your Trends</h4>
            <p className="font-medium opacity-80">Track Today. Protect Tomorrow!</p>
          </div>
          <Activity size={48} className="opacity-30" />
        </div>
      </div>
    </div>
  );
};

export default Home;