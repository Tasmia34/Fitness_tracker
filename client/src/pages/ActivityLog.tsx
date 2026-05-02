import { useState, useEffect } from 'react';
import CustomCalendar from './CustomCalendar';
import { Pencil, Trash2 } from 'lucide-react'; // Make sure to install lucide-react

interface HealthEntry {
  id: number;
  date: string;
  weight: string;
  sugar: string;
  bpSystolic: string;
  bpDiastolic: string;
  bmi: string;
}

const ActivityLog = () => {
  const [entries, setEntries] = useState<HealthEntry[]>(() => {
    const savedEntries = localStorage.getItem('health_logs');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // NEW: Track if we are in "Edit Mode"
  const [editingEntry, setEditingEntry] = useState<HealthEntry | null>(null); // NEW: Track which entry is being edited

  // Form States
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [sugar, setSugar] = useState('');
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');

  useEffect(() => {
    localStorage.setItem('health_logs', JSON.stringify(entries));
  }, [entries]);

  // Handle opening modal for NEW entry
  const handleOpenAddModal = () => {
    setEditingEntry(null);
    setWeight(''); setBmi(''); setSugar(''); setBpSystolic(''); setBpDiastolic('');
    setIsModalOpen(true);
  };

  // Handle opening modal to EDIT existing entry
  const handleOpenEditModal = (entry: HealthEntry) => {
    setEditingEntry(entry);
    setWeight(entry.weight);
    setBmi(entry.bmi);
    setSugar(entry.sugar);
    setBpSystolic(entry.bpSystolic);
    setBpDiastolic(entry.bpDiastolic);
    setIsModalOpen(true);
  };

  // NEW: Delete Function
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this log?")) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEntry) {
      // UPDATE logic
      setEntries(entries.map(e => e.id === editingEntry.id ? {
        ...editingEntry, weight, sugar, bpSystolic, bpDiastolic
      } : e));
    } else {
      // CREATE logic
      const newEntry: HealthEntry = {
        id: Date.now(),
        date: selectedDate.toLocaleDateString(),
        weight, sugar, bpSystolic, bpDiastolic
      };
      setEntries([newEntry, ...entries]);
    }

    setIsModalOpen(false);
    setEditingEntry(null);
  };

  return (
    <div className="p-6 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
        
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold dark:text-white">Activity Log</h1>
            <div className="flex gap-3">
              {/* Toggle Edit Mode Button */}
              <button 
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-6 py-2 rounded-xl font-medium transition-all border ${
                  isEditMode 
                  ? "bg-amber-100 border-amber-300 text-amber-700" 
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {isEditMode ? "Done Editing" : "Edit"}
              </button>
              <button 
                onClick={handleOpenAddModal}
                className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-all shadow-lg"
              >
                + Add Entry
              </button>
            </div>
          </div>

          {entries.length === 0 ? (
            <div className="py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
              <p className="text-slate-500 font-medium">No entries recorded yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* CONDITIONAL CRUD BUTTONS */}
                    {isEditMode && (
                      <div className="flex gap-2 mr-2">
                        <button 
                          onClick={() => handleOpenEditModal(entry)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(entry.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-slate-500">{entry.date}</p>
                      <p className="font-bold text-lg dark:text-white">Daily Metrics</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Weight</p>
                      <p className="font-semibold dark:text-slate-200">{entry.weight}kg</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">Sugar</p>
                      <p className="font-semibold text-red-400">{entry.sugar}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase">BP</p>
                      <p className="font-semibold text-emerald-500">{entry.bpSystolic}/{entry.bpDiastolic}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- RIGHT SIDE: CALENDAR (Remains same) --- */}
        <div className="w-full md:w-87.5">
          <div className="sticky top-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Select Date</h2>
            <div className="bg-white dark:bg-slate-900 p-2 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <CustomCalendar value={selectedDate} onChange={setSelectedDate} />
            </div>

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase">Active Date</p>
              <p className="text-lg font-bold text-blue-800 dark:text-blue-200">{selectedDate.toDateString()}</p>
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
                <p className="text-xs text-blue-500 font-bold">
                  {editingEntry ? editingEntry.date : selectedDate.toDateString()}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
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