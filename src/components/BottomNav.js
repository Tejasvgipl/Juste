import React from 'react';
import { MessageCircle, Bell, Calendar, Brain, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TABS = [
  { id: 'chat', icon: MessageCircle, label: 'Chat' },
  { id: 'reminders', icon: Bell, label: 'Alarms' },
  { id: 'schedules', icon: Calendar, label: 'Schedule' },
  { id: 'memory', icon: Brain, label: 'Memory' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function BottomNav() {
  const { tab, setTab, reminders, schedules } = useApp();
  const activeReminders = reminders.filter(r => r.active).length;
  const activeSchedules = schedules.filter(s => s.active).length;

  const getBadge = (id) => {
    if (id === 'reminders' && activeReminders > 0) return activeReminders;
    if (id === 'schedules' && activeSchedules > 0) return activeSchedules;
    return null;
  };

  return (
    <div className="bottom-nav">
      {TABS.map(({ id, icon: Icon, label }) => {
        const active = tab === id;
        const badge = getBadge(id);
        return (
          <button key={id} className={`nav-item ${active ? 'active' : ''}`}
            onClick={() => setTab(id)}
            style={{ position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              {badge && (
                <div style={{
                  position: 'absolute', top: -6, right: -8,
                  width: 16, height: 16, borderRadius: '50%',
                  background: 'var(--purple-core)', color: 'white',
                  fontSize: 9, fontWeight: 700, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  border: '1.5px solid var(--bg-void)'
                }}>{badge > 9 ? '9+' : badge}</div>
              )}
            </div>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
