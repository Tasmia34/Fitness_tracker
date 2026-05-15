import { useState, useEffect } from 'react';
import CustomCalendar from './CustomCalendar';
import { Pencil, Trash2 ,Scale, Droplets, Activity, Calendar as CalendarIcon, Plus} from 'lucide-react'; // Make sure to install lucide-react
import styles from './ActivityLog.module.css';


interface HealthEntry {
  id: number;
  date: string;
  weight: string;
  sugar: string;
  bpSystolic: string;
  bpDiastolic: string;
  
}

const ActivityLog = () => {
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
const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
const [activeMetric, setActiveMetric] = useState<'weight' | 'sugar' | 'bp'>('weight');


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

  const trendData = entries
  .filter(e => {
    const d = new Date(e.date);
    // Ensure we match the selected month and the current year
    return d.getMonth() === selectedMonth && d.getFullYear() === new Date().getFullYear();
  })
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .map(e => ({
    day: new Date(e.date).getDate(),
    weight: parseFloat(e.weight),
    sugar: parseFloat(e.sugar),
    systolic: parseFloat(e.bpSystolic),
    diastolic: parseFloat(e.bpDiastolic),
  }));

const COLORS = { weight: '#10b981', sugar: '#f87171', bp: '#3b82f6' };

  // This filters your logs to only show entries matching the calendar date
const filteredEntries = entries.filter(entry => 
  entry.date === selectedDate.toLocaleDateString()
);

// We also keep track if ANY data exists for this day to show the "No entry found" card
const hasEntryForSelectedDate = filteredEntries.length > 0;

  return (
   <div className="p-6 min-h-screen  text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* --- MAIN CONTENT AREA --- */}
        <div className="flex-1 space-y-8">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Activity Log</h1>
              <p className="text-slate-500 text-sm mt-1">Track your vital signs and health progression</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsEditMode(!isEditMode)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 border ${
                  isEditMode 
                  ? "bg-amber-500/10 border-amber-500/50 text-amber-500" 
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Pencil size={16} /> {isEditMode ? "Finish Editing" : "Manage Logs"}
              </button>
              <button 
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-900/20 font-semibold"
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
    <div className="py-8 bg-slate-900/50 rounded-4xl border-2 border-dashed border-slate-800 text-center animate-in fade-in duration-500">
      <div className="p-4 bg-amber-500/10 w-fit mx-auto rounded-full mb-4">
        <CalendarIcon size={32} className="text-amber-500/50" />
      </div>
      <p className="text-white font-bold text-lg">No entry found</p>
      <p className="text-slate-500 font-medium mt-1">
        There are no records for {selectedDate.toLocaleDateString()}
      </p>
      <button 
        onClick={handleOpenAddModal}
        className="mt-6 text-blue-400 hover:text-blue-300 font-bold text-sm flex items-center gap-2 mx-auto transition-all"
      >
        <Plus size={16} /> Create log for this date
      </button>
    </div>
  ) : (
    /* If entries exist for this specific date, 
       we map through 'filteredEntries' instead of 'entries'
    */
    filteredEntries.map((entry) => (
      <div 
        key={entry.id} 
        className="group relative bg-blue-900/20 border-blue-800/50 hover:bg-[#161e31] p-1 rounded-2xl border transition-all duration-300 shadow-xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6 p-5">
          
          {/* Date Column */}
          <div className="flex items-center gap-4 min-w-35">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <CalendarIcon size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Record Date</p>
              <p className="font-bold text-white">{entry.date}</p>
            </div>
          </div>

          {/* Stats Grid filtered ones */}
          <div className="flex-1 grid grid-cols-3 gap-4 md:gap-8 border-l border-slate-800/50 pl-0 md:pl-8">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Scale size={14} />
                <span className="antialiased text-[10px] uppercase font-bold tracking-wider">Weight</span>
              </div>
              <p className="antialiased text-xl font-bold text-white">{entry.weight}<span className="text-xs text-slate-500 ml-1">kg</span></p>
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
              <p className="antialiased text-xl font-bold text-emerald-500">{entry.bpSystolic}<span className="text-slate-600 mx-0.5">/</span>{entry.bpDiastolic}</p>
            </div>
          </div>

          {/* Actions */}
          {isEditMode ? (
            <div className="flex gap-2 animate-in slide-in-from-right-4 duration-300">
              <button 
                onClick={() => handleOpenEditModal(entry)}
                className="antialiased p-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all"
              >
                <Pencil size={18} />
              </button>
              <button 
                onClick={() => handleDelete(entry.id)}
                className="antialiased p-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500/30 hover:text-white rounded-xl transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ) : (
            <div className="hidden md:block w-1 bg-blue-600/0 group-hover:bg-blue-600/30 h-12 rounded-full transition-all" />
          )}
        </div>
      </div>
    ))
  )}
</div>

          {/* --- LOG ENTRIES --- */}
          <div className="space-y-4">
            {entries.length === 0 ? (
              <div className="py-24 bg-slate-900/50 rounded-4xl border-2 border-dashed border-slate-800 text-center">
                <Activity size={48} className="mx-auto text-slate-700 mb-4" />
                <p className="text-slate-500 font-medium">Your health journey starts here. Add your first log.</p>
              </div>
            ) : (
              entries.map((entry) => (
                <div 
                  key={entry.id} 
                  className="group relative bg-[#111827] hover:bg-[#161e31] p-1 rounded-2xl border border-slate-800 transition-all duration-300 shadow-xl overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6 p-5">
                    
                    {/* Date Column */}
                    <div className="flex items-center gap-4 min-w-35">
                      <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                        <CalendarIcon size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Record Date</p>
                        <p className="font-bold text-white">{entry.date}</p>
                      </div>
                    </div>
                  

                    

                    {/* Stats Grid */}
                    <div className="flex-1 grid grid-cols-3 gap-4 md:gap-8 border-l border-slate-800/50 pl-0 md:pl-8">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Scale size={14} />
                          <span className="antialiased text-[10px] uppercase font-bold tracking-wider">Weight</span>
                        </div>
                        <p className="antialiased text-xl font-bold text-white">{entry.weight}<span className="text-xs text-slate-500 ml-1">kg</span></p>
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
                        <p className="antialiased text-xl font-bold text-emerald-500">{entry.bpSystolic}<span className="text-slate-600 mx-0.5">/</span>{entry.bpDiastolic}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    {isEditMode ? (
                      <div className="flex gap-2 animate-in slide-in-from-right-4 duration-300">
                        <button 
                          onClick={() => handleOpenEditModal(entry)}
                          className="antialiased p-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(entry.id)}
                          className="antialiased p-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500/30 hover:text-white rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="hidden md:block w-1 bg-blue-600/0 group-hover:bg-blue-600/30 h-12 rounded-full transition-all" />
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
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Select Date</h2>
            <div className="bg-white dark:bg-slate-900 p-2 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
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
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold dark:text-white">
                  {editingEntry ? "Edit Health Log" : "New Health Log"}
                </h2>
               <button 
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="flex items-center gap-2 mt-2 group cursor-pointer"
          >
            <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
              <CalendarIcon size={14} />
            </div>
            <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">
              {selectedDate.toDateString()}
            </span>
          </button>
          
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
        {/* INLINE CALENDAR POPPER */}
        {isDatePickerOpen && (
          <div className="animate-in fade-in zoom-in-3 duration-400 bg-slate-900 border border-slate-800 p-4 rounded-3xl mb-4 shadow-inner">
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
                  <label className="block text-xs font-bold mb-1 uppercase text-slate-400">Weight (kg)</label>
                  <input type="number" step="0.1" required value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase text-slate-400">Sugar Level</label>
                  <input type="number" required value={sugar} onChange={(e) => setSugar(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 uppercase text-slate-400">Blood Pressure (Sys/Dia)</label>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="120" required value={bpSystolic} onChange={(e) => setBpSystolic(e.target.value)} className="w-1/2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none" />
                  <span className="text-slate-400 text-xl">/</span>
                  <input type="number" placeholder="80" required value={bpDiastolic} onChange={(e) => setBpDiastolic(e.target.value)} className="w-1/2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white outline-none" />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-800 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg mt-2">
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