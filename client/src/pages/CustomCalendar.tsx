import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './Calendar.module.css';

// Define the types for your props
interface CustomCalendarProps {
  value: Date;
  onChange: (date: Date) => void;
}

const CustomCalendar = ({ value, onChange }: CustomCalendarProps) => {
  return (
    <div className={styles.calendarContainer}>
      <Calendar 
        onChange={onChange} // This calls setSelectedDate in ActivityLog
        value={value}      // This shows the active border on the right day
        next2Label={null}
        prev2Label={null}
      />
    </div>
  );
};

export default CustomCalendar;