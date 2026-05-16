import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './Calendar.module.css';

// Define the types for your props
interface CustomCalendarProps {
  value: Date;
  onChange: (date: Date) => void;
  entries: HealthEntry[];
}

const CustomCalendar = ({ value, onChange,entries }: CustomCalendarProps) => {
  // Function to check if a tile has data
  const tileContent = ({ date, view }: { date: Date, view: string }) => {
    // Only show dots on the month view
    if (view === 'month') {
      const dateString = date.toLocaleDateString();
      const hasData = entries.some(entry => entry.date === dateString);
      
      if (hasData) {
        return (
          <div className="flex bottom-1 left-1/2 mt-1">
            <div className="w-1.5 h-1.5 bg-blue-500/60 rounded-full animate-pulse" />
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }: { date: Date, view: string }) => {
  if (view === 'month') {
    const dateString = date.toLocaleDateString();
    if (entries.some(entry => entry.date === dateString)) {
      return styles.hasDataTile; // Create this class in your CSS module
    }
  }
  return null;
};
  return (
    <div className={styles.calendarContainer}>
      <Calendar 
        onChange={onChange} // This calls setSelectedDate in ActivityLog
        value={value} 
        tileContent={tileContent} 
        tileClassName={tileClassName}    // This shows the active border on the right day
        next2Label={null}
        prev2Label={null}
      />
    </div>
  );
};

export default CustomCalendar;