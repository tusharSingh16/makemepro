import React, { useState } from "react";
import { 
  format, 
  eachDayOfInterval, 
  startOfMonth, 
  endOfMonth, 
  parseISO, 
  isWithinInterval, 
  isSameDay,
  getDay,
  addDays,
  isPast,
  startOfDay
} from "date-fns";

type CalendarProps = {
  days: string[];
  startDate: string;
  endDate: string;
};

const dayMap: { [key: string]: number } = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

const Calendar: React.FC<CalendarProps> = ({ days, startDate, endDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());  // Initialize with current date
  const daysIndices = days.map(day => dayMap[day]);
  const highlightStart = parseISO(startDate);
  const highlightEnd = parseISO(endDate);
  const today = startOfDay(new Date()); // Get start of today for comparison

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Calculate empty days at the start
  const startDay = getDay(monthStart);
  const emptyDays = Array.from({ length: startDay }, (_, i) => i);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const isHighlightedDay = (date: Date) => {
    const isInRange = isWithinInterval(date, { start: highlightStart, end: highlightEnd }) ||
                     isSameDay(date, highlightStart) ||
                     isSameDay(date, highlightEnd);
    const isSelectedDay = daysIndices.includes(date.getDay());
    return isInRange && isSelectedDay;
  };

  const getHighlightColor = (date: Date) => {
    if (!isHighlightedDay(date)) return "text-gray-500";
    
    const isPastClass = isPast(date);
    if (isPastClass) {
      return "bg-red-600 text-white font-medium";
    }
    return "bg-green-600 text-white font-medium";
  };

  return (
    <div className="w-full bg-white">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={prevMonth} 
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50"
        >
          Previous
        </button>
        <h2 className="text-2xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
        <button 
          onClick={nextMonth} 
          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      <div className="grid grid-cols-7 gap-x-6 gap-y-4">
        {/* Week day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="text-center font-medium text-gray-600 text-sm mb-2">
            {day}
          </div>
        ))}
        {/* Empty cells for days before the start of the month */}
        {emptyDays.map(i => (
          <div 
            key={`empty-${i}`} 
            className="h-10 flex items-center justify-center"
          />
        ))}
        {/* Actual days of the month */}
        {allDays.map(date => {
          const highlightColor = getHighlightColor(date);
          return (
            <div
              key={date.toISOString()}
              className={`h-10 flex items-center justify-center text-sm rounded-xl ${highlightColor}`}
            >
              {format(date, "d")}
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="mt-6 flex gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-green-600"></div>
          <span>Upcoming Classes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-md bg-red-600"></div>
          <span>Past Classes</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
