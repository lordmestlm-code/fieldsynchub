import { useState, useEffect } from 'react';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, [currentDate]);

  const loadEvents = async () => {
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const token = localStorage.getItem('fieldsynchub_token');
    const headers = token !== 'demo' ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`/api/calendar/events?start=${start.toISOString().split('T')[0]}&end=${end.toISOString().split('T')[0]}`, { headers });
    const data = await res.json();
    setEvents(data);
    setLoading(false);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Previous month days
    const startDay = firstDay.getDay();
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, isOther: true });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isOther: false });
    }
    
    // Next month days to fill grid
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isOther: true });
    }
    
    return days;
  };

  const getEventsForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(e => e.date === dateStr);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const todayMonth = () => setCurrentDate(new Date());

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-sm" onClick={prevMonth}>←</button>
            <button className="btn btn-secondary btn-sm" onClick={todayMonth}>Today</button>
            <button className="btn btn-ghost btn-sm" onClick={nextMonth}>→</button>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="calendar-grid">
            {dayNames.map(day => (
              <div className="calendar-header-cell" key={day}>{day}</div>
            ))}
            {getDaysInMonth().map((day, i) => {
              const dayEvents = getEventsForDay(day.date);
              return (
                <div 
                  className={`calendar-cell ${day.isOther ? 'other-month' : ''} ${isToday(day.date) ? 'today' : ''}`} 
                  key={i}
                >
                  <div className="calendar-date">{day.date.getDate()}</div>
                  {dayEvents.slice(0, 3).map(ev => (
                    <div className={`calendar-event ${ev.status}`} key={ev.id} title={ev.title}>
                      {ev.time?.slice(0, 5)} {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', padding: '2px 8px' }}>
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;