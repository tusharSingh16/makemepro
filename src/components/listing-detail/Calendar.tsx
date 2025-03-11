import React, { useState } from "react";
import { format, eachDayOfInterval, startOfMonth, endOfMonth, parseISO } from "date-fns";

type CalendarProps = {
  year: number;
  days: string[];
  startDate: string;
  endDate: string;
};

const dayMap: { [key: string]: number } = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

const Calendar: React.FC<CalendarProps> = ({ year, days, startDate, endDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(year, 0, 1));
  const daysIndices = days.map(day => dayMap[day]);
  const highlightStart = parseISO(startDate);
  const highlightEnd = parseISO(endDate);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  return (
    <div className="p-4 border rounded-lg w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-3 py-1 border rounded bg-gray-200">Previous</button>
        <h2 className="font-bold text-lg">{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={nextMonth} className="px-3 py-1 border rounded bg-gray-200">Next</button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="font-bold text-center">{day}</div>
        ))}
        {allDays.map(date => {
          const isHighlighted = daysIndices.includes(date.getDay());
          return (
            <div
              key={date.toISOString()}
              className={`p-2 border rounded-md text-center ${
                isHighlighted ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {format(date, "dd")}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
