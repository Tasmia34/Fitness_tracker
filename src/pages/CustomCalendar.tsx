import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './Calendar.module.css';
import { Heart } from 'lucide-react';
import { useAppContext } from '../context/Appcontext'; // Import context

interface CustomCalendarProps {
  value: Date;
  onChange: (date: Date) => void;
  entries: HealthEntry[];
}

const CustomCalendar = ({ value, onChange, entries }: CustomCalendarProps) => {
  const { user } = useAppContext(); // Access user context

  const tileContent = ({ date, view }: { date: Date, view: string }) => {
    if (view !== 'month') return null;

    const dateString = date.toLocaleDateString();
    const hasData = entries.some(entry => entry.date === dateString);

    // Calculate Ovulation Day
    const lastStart = new Date(user?.lastPeriodStart || new Date());
    const cycleLength = user?.avgCycleLength || 28;
    
    // Normalize time for comparison
    const diffTime = date.getTime() - lastStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const currentCycleDay = ((diffDays - 1) % cycleLength) + 1;
    
    const isOvulationDay = currentCycleDay === 14-1;

    return (
      <div className="relative flex flex-col items-center justify-center w-full h-full">
        {/* Data Dot */}
        {hasData && (
          <div className="absolute mt-1 bottom-3 right-1/7">
            <div className="w-1.5 h-1.5 bg-blue-500/60 rounded-full animate-pulse" />
          </div>
        )}
        
        {/* Ovulation Heart */}
        {isOvulationDay && (
          <div className="absolute top-1 right-1">
            <Heart size={10} className="text-rose-500 animate-pulse" />
          </div>
        )}
      </div>
    );
  };

  const tileClassName = ({ date, view }: { date: Date, view: string }) => {
    if (view === 'month') {
      const dateString = date.toLocaleDateString();
      if (entries.some(entry => entry.date === dateString)) {
        return styles.hasDataTile;
      }
    }
    return null;
  };

  return (
    <div className={styles.calendarContainer}>
      <Calendar 
        onChange={onChange}
        value={value} 
        tileContent={tileContent} 
        tileClassName={tileClassName}
        next2Label={null}
        prev2Label={null}
      />
    </div>
  );
};

export default CustomCalendar;