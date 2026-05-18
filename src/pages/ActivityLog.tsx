import { useState, useEffect } from 'react';
import CustomCalendar from './CustomCalendar';
import { Pencil, Trash2 ,Scale, Droplets, Activity, Calendar as CalendarIcon, Plus} from 'lucide-react'; // Make sure to install lucide-react
import { useAppContext } from '../context/Appcontext';
// import styles from './ActivityLog.module.css';


interface HealthEntry {
  id: number;
  date: string;
  weight: string;
  sugar: string;
  bpSystolic: string;
  bpDiastolic: string;
  
}

const ActivityLog = () => {
   const { user } = useAppContext();
  const [entries, setEntries] = useState<HealthEntry[]>(() => {
    const savedEntries = localStorage.getItem('health_logs');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEntry, setEditingEntry] = useState<HealthEntry | null>(null); // NEW: Track which entry is being edited

  // Form States
  const [weight, setWeight] = useState('');
  const [sugar, setSugar] = useState('');
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');

//monthly trend
// const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
// const [activeMetric, setActiveMetric] = useState<'weight' | 'sugar' | 'bp'>('weight');


  useEffect(() => {
    localStorage.setItem('health_logs', JSON.stringify(entries));
  }, [entries]);

  // Handle opening modal for NEW entry
  const handleOpenAddModal = () => {
    setEditingEntry(null);
    setWeight('');  setSugar(''); setBpSystolic(''); setBpDiastolic('');
    setIsModalOpen(true);
  };

  // Handle opening modal to EDIT existing entry
  const handleOpenEditModal = (entry: HealthEntry) => {
    setEditingEntry(entry);
    setWeight(entry.weight);
    setSugar(entry.sugar);
    setBpSystolic(entry.bpSystolic);
    setBpDiastolic(entry.bpDiastolic);
    setIsModalOpen(true);
  };

  // NEW: Delete Function
  const handleDelete = (id: number) => {
    if (window.confirm("Delete this health record?")) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

 const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the date based on what is currently selected in the calendar
    const dateToSave = selectedDate.toLocaleDateString();

    if (editingEntry) {
      // UPDATE logic
      setEntries(entries.map(e => e.id === editingEntry.id ? {
        ...editingEntry, 
        date: dateToSave, // <--- This now updates the date to the calendar selection
        weight, 
        sugar, 
        bpSystolic, 
        bpDiastolic
      } : e));
    } else {

      // CREATE logic
      const heightInMeters = (user?.height || 160) / 100;
const currentWeight = parseFloat(weight);
const calculatedBmi = currentWeight > 0 ? (currentWeight / (heightInMeters * heightInMeters)).toFixed(1) : "";
      const newEntry: HealthEntry = {
        id: Date.now(),
        date: dateToSave,
        weight, 
        sugar, 
        bpSystolic, 
        bpDiastolic,
        
      };
      setEntries([newEntry, ...entries]);
    }

    setIsModalOpen(false);
    setEditingEntry(null);
  };



  // This filters your logs to only show entries matching the calendar date
const filteredEntries = entries.filter(entry => 
  entry.date === selectedDate.toLocaleDateString()
);

// We also keep track if ANY data exists for this day to show the "No entry found" card
const hasEntryForSelectedDate = filteredEntries.length > 0;

  return (
   <div className="min-h-screen p-6 transition-colors duration-300 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300">
      <div className="flex flex-col gap-8 mx-auto max-w-7xl lg:flex-row">
        
        {/* --- MAIN CONTENT AREA --- */}
      {/* --- MAIN CONTENT AREA --- */}
        <div className="flex-1 space-y-8">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              {/* 2. Heading - Adaptive */}
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Activity Log</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track your vital signs and health progression</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsEditMode(!isEditMode)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 border ${
                  isEditMode 
                  ? "bg-amber-500/10 border-amber-500/50 text-amber-600 dark:text-amber-500" 
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm"
                }`}
              >
                <Pencil size={16} /> {isEditMode ? "Finish Editing" : "Manage Logs"}
              </button>
              <button 
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 font-semibold"
              >
                <Plus size={20} /> Add New Entry
              </button>
            </div>
          </header>

{/* --- LOG ENTRIES --- */}
<div className="space-y-4">
  {/* Check 'hasEntryForSelectedDate' first. 
     If false, show the "No Entry Found" state.
  */}
 {!hasEntryForSelectedDate ? (
              /* 3. Empty State Card - Adaptive */
              <div className="py-8 text-center bg-white border-2 border-dashed dark:bg-slate-900/50 rounded-3xl border-slate-200 dark:border-slate-800">
                <div className="p-4 mx-auto mb-4 rounded-full bg-amber-500/10 w-fit">
                  <CalendarIcon size={32} className="text-amber-500" />
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">No entry found</p>
                <p className="mt-1 font-medium text-slate-500 dark:text-slate-400">
                  There are no records for {selectedDate.toLocaleDateString()}
                </p>
                <button 
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-2 mx-auto mt-6 text-sm font-bold text-blue-600 transition-all dark:text-blue-400 hover:underline"
                >
                  <Plus size={16} /> Create log for this date
                </button>
              </div>
            ) : (
    /* If entries exist for this specific date, 
       we map through 'filteredEntries' instead of 'entries'
    */
  filteredEntries.map((entry) => (
                /* 4. Log Row - Adaptive */
                <div 
                  key={entry.id} 
                  className="relative p-1 transition-all duration-300 bg-white border shadow-sm group dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-900 rounded-2xl hover:shadow-md"
                >
                  <div className="flex flex-col gap-6 p-5 md:flex-row md:items-center">
                    
                    <div className="flex items-center gap-4 min-w-35">
                      <div className="p-3 text-blue-600 bg-blue-500/10 rounded-xl dark:text-blue-400">
                        <CalendarIcon size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Record Date</p>
                        <p className="font-bold text-slate-900 dark:text-white">{entry.date}</p>
                      </div>
                    </div>

          {/* Stats Grid filtered ones */}
          <div className="grid flex-1 grid-cols-3 gap-4 pl-0 border-l md:gap-8 border-slate-800/50 md:pl-8">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Scale size={14} />
                <span className="antialiased text-[10px] uppercase font-bold tracking-wider">Weight</span>
              </div>
              <p className="text-xl antialiased font-bold text-black dark:text-white">{entry.weight}<span className="ml-1 text-xs text-slate-500">kg</span></p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Droplets size={14} />
                <span className="antialiased text-[10px] uppercase font-bold tracking-wider">Sugar</span>
              </div>
              <p className="antialiased text-xl font-bold text-[#f87171]">{entry.sugar}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Activity size={14} />
                <span className="antialiased text-[10px] uppercase font-bold tracking-wider">Blood Pressure</span>
              </div>
              <p className="text-xl antialiased font-bold text-emerald-500">{entry.bpSystolic}<span className="text-slate-600 mx-0.5">/</span>{entry.bpDiastolic}</p>
            </div>
          </div>

          {/* Actions */}
          {isEditMode ? (
            <div className="flex gap-2 duration-300 animate-in slide-in-from-right-4">
              <button 
                onClick={() => handleOpenEditModal(entry)}
                className="p-3 antialiased text-blue-400 transition-all bg-blue-500/10 hover:bg-blue-500 hover:text-white rounded-xl"
              >
                <Pencil size={18} />
              </button>
              <button 
                onClick={() => handleDelete(entry.id)}
                className="p-3 antialiased transition-all bg-rose-500/10 text-rose-400 hover:bg-rose-500/30 hover:text-white rounded-xl"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ) : (
            <div className="hidden w-1 h-12 transition-all rounded-full md:block bg-blue-600/0 group-hover:bg-blue-600/30" />
          )}
        </div>
      </div>
    ))
  )}
</div>

          {/* --- LOG ENTRIES --- */}
          <div className="space-y-4">
            {entries.length === 0 ? (
              <div className="py-24 text-center bg-white border-2 border-dashed dark:bg-slate-900/50 rounded-4xl border-slate-800">
                <Activity size={48} className="mx-auto mb-4 text-slate-700" />
                <p className="font-medium text-slate-500">Your health journey starts here. Add your first log.</p>
              </div>
            ) : (
              entries.map((entry) => (
               <div 
  key={entry.id} 
  className="relative p-1 overflow-hidden transition-all duration-300 bg-white border shadow-sm group dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-900 rounded-2xl hover:shadow-md"
>
                  <div className="flex flex-col gap-6 p-5 md:flex-row md:items-center">
                    
                    {/* Date Column */}
                    <div className="flex items-center gap-4 min-w-35">
                      <div className="p-3 text-blue-500 bg-blue-500/10 rounded-xl">
                        <CalendarIcon size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Record Date</p>
                        <p className="font-bold text-black dark:text-white">{entry.date}</p>
                      </div>
                    </div>
                  

                    

                    {/* Stats Grid */}
                   <div className="grid flex-1 grid-cols-3 gap-4 pl-4 border-l md:gap-8 border-slate-100 dark:border-slate-800 md:pl-8">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Scale size={14} />
                          <span className="text-[10px] uppercase font-bold tracking-wider">Weight</span>
                        </div>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{entry.weight}<span className="ml-1 text-xs text-slate-400">kg</span></p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Droplets size={14} />
                          <span className="text-[10px] uppercase font-bold tracking-wider">Sugar</span>
                        </div>
                        <p className="text-xl font-bold text-rose-500 dark:text-rose-400">{entry.sugar}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Activity size={14} />
                          <span className="text-[10px] uppercase font-bold tracking-wider">Blood Pressure</span>
                        </div>
                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-500">{entry.bpSystolic}<span className="text-slate-300 dark:text-slate-600 mx-0.5">/</span>{entry.bpDiastolic}</p>
                      </div>
                    </div>

                    {/* Actions */}
                   {isEditMode && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(entry)}
                          className="p-3 text-blue-600 transition-all bg-blue-500/10 dark:text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(entry.id)}
                          className="p-3 transition-all bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white rounded-xl"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- RIGHT SIDE: CALENDAR (Remains same) --- */}
        <div className="w-full md:w-87.5">
          <div className="sticky top-6">
            <h2 className="mb-4 text-lg font-semibold dark:text-white">Select Date</h2>
            <div className="p-2 bg-white border shadow-sm dark:bg-slate-900 rounded-3xl border-slate-100 dark:border-slate-800">
              <CustomCalendar value={selectedDate} onChange={setSelectedDate} entries={entries} />
            </div>

           <div className={`mt-4 p-4 rounded-2xl border transition-all duration-300 ${
  hasEntryForSelectedDate 
    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800" 
    : "bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30"
}`}>
  <p className={`text-xs font-bold uppercase tracking-wider ${
    hasEntryForSelectedDate ? "text-blue-600 dark:text-blue-400" : "text-amber-600 dark:text-amber-500"
  }`}>
    {hasEntryForSelectedDate ? "Entry Found" : "No Entry Found"}
  </p>
  <p className={`text-lg font-bold ${
    hasEntryForSelectedDate ? "text-blue-800 dark:text-blue-200" : "text-amber-800 dark:text-amber-200"
  }`}>
    {selectedDate.toDateString()}
  </p>
</div>
          </div>
        </div>
      </div>


    
      {/* --- MODAL (Handles both Create and Update) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="w-full max-w-md overflow-hidden bg-white shadow-2xl dark:bg-slate-900 rounded-3xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-xl font-bold dark:text-white">
                  {editingEntry ? "Edit Health Log" : "New Health Log"}
                </h2>
               <button 
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="flex items-center gap-2 mt-2 cursor-pointer group"
          >
            <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
              <CalendarIcon size={14} />
            </div>
            <span className="text-xs font-bold tracking-wider text-blue-400 uppercase">
              {selectedDate.toDateString()}
            </span>
          </button>
          
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
        {/* INLINE CALENDAR POPPER */}
        {isDatePickerOpen && (
          <div className="p-4 mb-4 border shadow-inner animate-in fade-in zoom-in-3 duration-400 bg-slate-900 border-slate-800 rounded-3xl">
            <CustomCalendar entries={entries}
              value={selectedDate} 
              onChange={(date) => {
                setSelectedDate(date);
                setIsDatePickerOpen(false); // Close after selection
              }} 
            />
          </div>
        )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-bold uppercase text-slate-400">Weight (kg)</label>
                  <input type="number" step="0.1" required value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full p-3 outline-none rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-bold uppercase text-slate-400">Sugar Level</label>
                  <input type="number" required value={sugar} onChange={(e) => setSugar(e.target.value)} className="w-full p-3 outline-none rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white" />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-bold uppercase text-slate-400">Blood Pressure (Sys/Dia)</label>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="120" required value={bpSystolic} onChange={(e) => setBpSystolic(e.target.value)} className="w-1/2 p-3 outline-none rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white" />
                  <span className="text-xl text-slate-400">/</span>
                  <input type="number" placeholder="80" required value={bpDiastolic} onChange={(e) => setBpDiastolic(e.target.value)} className="w-1/2 p-3 outline-none rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white" />
                </div>
              </div>

              <button type="submit" className="w-full py-4 mt-2 font-bold text-white transition-all bg-blue-800 shadow-lg rounded-2xl hover:bg-blue-700">
                {editingEntry ? "Update Changes" : "Save Entry"}
              </button>
            </form>
          </div>
          
        </div>
      )}


      

    </div>
  );
};

export default ActivityLog;