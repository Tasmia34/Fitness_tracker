import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/Appcontext";

//interface so the form can store them
interface OnboardingData {
  gender: string;
  height: number;
  dob: string;
  useMenstrualTracker: boolean | null;
  // Added fields:
  lastPeriodStart: string;
  avgCycleLength: number;
  avgBleedingDays: number;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const { setOnboardingCompleted, updateUserProfile } = useAppContext();

  const [step, setStep] = useState<number>(1);

  // initial state
  const [formData, setFormData] = useState<OnboardingData>({
    gender: "",
    height: 170,
    dob: "",
    useMenstrualTracker: null,
    lastPeriodStart: "",
    avgCycleLength: 28,
    avgBleedingDays: 5,
  });

  const updateFields = (fields: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  // Helper function to calculate age accurately from Date of Birth
  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred yet this year
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1 && !formData.gender) return alert("Select gender");
    if (step === 2 && !formData.dob) return alert("Select DOB");

    if (step === 1) setStep(2);
    else if (step === 2) {
      formData.gender === "female" ? setStep(3) : handleSubmit();
    } else if (step === 3) {
      formData.useMenstrualTracker ? setStep(4) : handleSubmit();
    } else if (step === 4) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const calculatedAge = calculateAge(formData.dob);

    updateUserProfile({
      gender: formData.gender,
      height: formData.height,
      age: calculatedAge,
      dob: formData.dob,
     useMenstrualTracker: !!formData.useMenstrualTracker,
    lastPeriodStart: formData.lastPeriodStart,
    avgCycleLength: formData.avgCycleLength,
    avgBleedingDays: formData.avgBleedingDays,
    });

    setOnboardingCompleted(true);
    navigate("/dashboard", { replace: true });
  };

  return (
    // Fixed inset layout ensures that even if a global sidebar is active,
    // this page renders completely over the top of it in full screen view.
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto bg-slate-950 text-slate-100">
      <div className="relative w-full max-w-md p-8 my-8 overflow-hidden border shadow-xl bg-slate-900 border-slate-800 rounded-2xl">
        <div
          className="absolute top-0 left-0 h-1 transition-all duration-300 bg-blue-500"
        style={{ 
  width: `${(step / (formData.gender === "female" ? (formData.useMenstrualTracker ? 4 : 3) : 2)) * 100}%` 
}}
        />

        <form onSubmit={handleNext} className="space-y-6">
          {/* STEP 1: GENDER */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Tell us about yourself
              </h2>
              <p className="text-sm text-slate-400">
                Please select your gender to help personalize your experience.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                {["male", "female"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => updateFields({ gender: g })}
                    className={`p-4 rounded-xl border text-center font-medium capitalize transition-all ${
                      formData.gender === g
                        ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-md shadow-blue-500/10"
                        : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: BODY METRICS (HEIGHT & DOB) */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Body Metrics
              </h2>
              <p className="text-sm text-slate-400">
                We use these numbers to accurately calculate baseline caloric
                profiles.
              </p>

              <div className="pt-2 space-y-5">
                {/* Date of Birth Input - Replaced Weight Slider */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    max={new Date().toISOString().split("T")[0]} // Prevents picking future dates
                    value={formData.dob}
                    onChange={(e) => updateFields({ dob: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-colors [color-scheme:dark]"
                  />
                  {formData.dob && (
                    <p className="pl-1 text-xs font-medium text-blue-400">
                      Calculated Age: {calculateAge(formData.dob)} years old
                    </p>
                  )}
                </div>

                {/* Height Input - Changed from Slider to Direct Number Entry */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="250"
                    placeholder="e.g. 170"
                    value={formData.height || ""}
                    onChange={(e) =>
                      updateFields({ height: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-3 text-sm text-white transition-colors border rounded-xl bg-slate-800 border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CYCLE TRACKING */}
          {step === 3 && formData.gender === "female" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Cycle Tracking
              </h2>
              <p className="text-sm text-slate-400">
                Would you like to integrate a menstrual cycle tracker into your
                dashboard?
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => updateFields({ useMenstrualTracker: true })}
                  className={`p-4 rounded-xl border text-center font-medium transition-all ${
                    formData.useMenstrualTracker === true
                      ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-md shadow-blue-500/10"
                      : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  Yes, please
                </button>
                <button
                  type="button"
                  onClick={() => updateFields({ useMenstrualTracker: false })}
                  className={`p-4 rounded-xl border text-center font-medium transition-all ${
                    formData.useMenstrualTracker === false
                      ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-md shadow-blue-500/10"
                      : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  No, thanks
                </button>
              </div>
            </div>
          )}
          {/* Step 4: Cycle initial data */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Cycle Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm text-slate-400">
                    Last Period Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.lastPeriodStart}
                    onChange={(e) =>
                      updateFields({ lastPeriodStart: e.target.value })
                    }
                    className="w-full p-3 text-white border rounded-xl bg-slate-800 border-slate-700"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-slate-400">
                    Average Cycle Length (Days)
                  </label>
                  <input
                    type="number"
                    value={formData.avgCycleLength}
                    onChange={(e) =>
                      updateFields({ avgCycleLength: Number(e.target.value) })
                    }
                    className="w-full p-3 text-white border rounded-xl bg-slate-800 border-slate-700"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-slate-400">
                    Avg Bleeding Days
                  </label>
                  <input
                    type="number"
                    value={formData.avgBleedingDays}
                    onChange={(e) =>
                      updateFields({ avgBleedingDays: Number(e.target.value) })
                    }
                    className="w-full p-3 text-white border rounded-xl bg-slate-800 border-slate-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ACTIONS FOOTER */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors text-sm font-medium"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white transition-colors text-sm font-medium shadow-lg shadow-blue-600/20"
            >
              {step === 3 || (step === 2 && formData.gender !== "female")
                ? "Complete Setup"
                : "Next Step"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
