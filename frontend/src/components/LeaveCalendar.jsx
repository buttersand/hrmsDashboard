function LeaveCalendar({ currentMonth, leaves, onNavigate }) {
  const renderCalendarDays = () => {
    const days = [];
    const firstDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const lastDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );
    const daysInMonth = lastDay.getDate();

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // Create empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Create cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );

      // Check if there are any leaves on this day
      const dayLeaves = leaves.filter((leave) => {
        const leaveDate = new Date(leave.date);
        return (
          leaveDate.getDate() === day &&
          leaveDate.getMonth() === currentMonth.getMonth() &&
          leaveDate.getFullYear() === currentMonth.getFullYear()
        );
      });

      const hasPendingLeave = dayLeaves.some(
        (leave) => leave.status === "pending"
      );
      const hasApprovedLeave = dayLeaves.some(
        (leave) => leave.status === "approved"
      );
      const hasRejectedLeave = dayLeaves.some(
        (leave) => leave.status === "rejected"
      );

      let dayClass = "calendar-day";
      if (hasApprovedLeave) dayClass += " has-approved";
      if (hasPendingLeave) dayClass += " has-pending";
      if (hasRejectedLeave) dayClass += " has-rejected";

      days.push(
        <div key={day} className={dayClass}>
          {day}
          {dayLeaves.length > 0 && (
            <div className="leave-indicators">
              {dayLeaves.map((leave, idx) => (
                <div key={idx} className={`leave-indicator ${leave.status}`}>
                  {idx + 1}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="leave-calendar">
      <div className="calendar-header">
        <h2>Leave Calendar</h2>
        <div className="month-navigation">
          <button onClick={() => onNavigate(-1)} className="nav-btn">
            &lt;
          </button>
          <span className="current-month">{monthName}</span>
          <button onClick={() => onNavigate(1)} className="nav-btn">
            &gt;
          </button>
        </div>
      </div>
      <div className="calendar-weekdays">
        <div className="weekday">S</div>
        <div className="weekday">M</div>
        <div className="weekday">T</div>
        <div className="weekday">W</div>
        <div className="weekday">T</div>
        <div className="weekday">F</div>
        <div className="weekday">S</div>
      </div>
      <div className="calendar-days">{renderCalendarDays()}</div>
    </div>
  );
}

export default LeaveCalendar;
