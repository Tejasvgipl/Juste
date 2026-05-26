import React, { useState } from 'react';
import { Bell, Plus, Trash2, Clock, Repeat, X, AlarmClock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const REPEAT_LABELS = { none: 'Once', daily: 'Daily', weekly: 'Weekly', weekdays: 'Weekdays' };
const REPEAT_OPTIONS = ['none', 'daily', 'weekly', 'weekdays'];

const PRESET_REMINDERS = [
  { label: '🌅 Wake up', time: '07:00', repeat: 'daily' },
  { label: '💊 Take medicine', time: '09:00', repeat: 'daily' },
  { label: '🏋️ Gym time', time: '18:00', repeat: 'daily' },
  { label: '😴 Sleep', time: '23:00', repeat: 'daily' },
  { label: '💧 Drink water', time: '12:00', repeat: 'daily' },
  { label: '📚 Study', time: '20:00', repeat: 'weekdays' },
];

const TYPE_COLORS = {
  reminder: { bg: 'rgba(124,58,237,0.15)', icon: '#9f67ff' },
  alarm: { bg: 'rgba(236,72,153,0.12)', icon: '#ec4899' },
};

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle" onClick={e => { e.stopPropagation(); onChange(); }}>
      <input type="checkbox" checked={checked} onChange={() => {}} />
      <div className="toggle-track" />
      <div className="toggle-thumb" style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }} />
    </label>
  );
}

function AddReminderModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ label: '', time: '08:00', repeat: 'none', type: 'reminder' });
  const [tab, setTab] = useState('custom');

  const submit = () => {
    if (!form.label.trim()) return;
    onAdd(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-subtle)', margin: '0 auto 20px' }} />

        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 20 }}>
          New Reminder
        </div>

        {/* Tab */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['custom', 'preset'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                background: tab === t ? 'var(--purple-core)' : 'var(--bg-glass)',
                color: tab === t ? 'white' : 'var(--text-muted)',
                transition: 'all 0.2s'
              }}>
              {t === 'custom' ? '✏️ Custom' : '⚡ Presets'}
            </button>
          ))}
        </div>

        {tab === 'custom' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input className="input-field" placeholder="What's the reminder for?" value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))} autoFocus />

            <div>
              <div className="section-label">Time</div>
              <input className="input-field" type="time" value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            </div>

            <div>
              <div className="section-label">Repeat</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {REPEAT_OPTIONS.map(r => (
                  <button key={r} onClick={() => setForm(f => ({ ...f, repeat: r }))}
                    style={{
                      flex: 1, padding: '8px 4px', borderRadius: 10, border: '1px solid',
                      fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500,
                      borderColor: form.repeat === r ? 'var(--purple-bright)' : 'var(--border-subtle)',
                      background: form.repeat === r ? 'rgba(124,58,237,0.15)' : 'var(--bg-glass)',
                      color: form.repeat === r ? 'var(--purple-glow)' : 'var(--text-muted)',
                      transition: 'all 0.2s'
                    }}>{REPEAT_LABELS[r]}</button>
                ))}
              </div>
            </div>

            <div>
              <div className="section-label">Type</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['reminder', 'alarm'].map(t => (
                  <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 10, border: '1px solid', cursor: 'pointer',
                      fontFamily: 'var(--font-body)', fontSize: 13,
                      borderColor: form.type === t ? 'var(--purple-bright)' : 'var(--border-subtle)',
                      background: form.type === t ? 'rgba(124,58,237,0.15)' : 'var(--bg-glass)',
                      color: form.type === t ? 'var(--purple-glow)' : 'var(--text-muted)',
                    }}>
                    {t === 'reminder' ? '🔔 Reminder' : '⏰ Alarm'}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn-primary" onClick={submit} style={{ width: '100%', marginTop: 4 }}>
              Set Reminder
            </button>
          </div>
        ) : (
          <div>
            {PRESET_REMINDERS.map((p, i) => (
              <div key={i} className="reminder-card" onClick={() => { onAdd({ ...p, type: 'reminder' }); onClose(); }}>
                <div className="reminder-icon" style={{ background: 'rgba(124,58,237,0.12)' }}>
                  <span style={{ fontSize: 20 }}>{p.label.split(' ')[0]}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-primary)' }}>{p.label.slice(2)}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{p.time} · {REPEAT_LABELS[p.repeat]}</div>
                </div>
                <Plus size={16} color="var(--purple-glow)" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RemindersScreen() {
  const { reminders, addReminder, toggleReminder, deleteReminder } = useApp();
  const [showAdd, setShowAdd] = useState(false);

  const active = reminders.filter(r => r.active);
  const inactive = reminders.filter(r => !r.active);

  return (
    <div className="screen">
      <div className="scroll-content">
        {/* Header */}
        <div style={{ paddingTop: 20, paddingBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--text-primary)' }}>
              Reminders
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
              {active.length} active · {reminders.length} total
            </div>
          </div>
          <button className="btn-primary" onClick={() => setShowAdd(true)}
            style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
            <Plus size={16} /> New
          </button>
        </div>

        {reminders.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⏰</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 6 }}>No reminders yet</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>Add one or ask Juste to set it for you</div>
            <button className="btn-ghost" onClick={() => setShowAdd(true)}>Set first reminder</button>
          </div>
        )}

        {active.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div className="section-label">Active</div>
            {active.map((r, i) => (
              <div key={r.id} className="reminder-card" style={{ animationDelay: i * 0.05 + 's' }}>
                <div className="reminder-icon" style={{ background: (TYPE_COLORS[r.type] || TYPE_COLORS.reminder).bg }}>
                  {r.type === 'alarm' ? <AlarmClock size={20} color={TYPE_COLORS.alarm.icon} /> : <Bell size={20} color={TYPE_COLORS.reminder.icon} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.label}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: 'var(--text-muted)' }}>
                      <Clock size={10} /> {r.time}
                    </div>
                    {r.repeat !== 'none' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: 'var(--text-muted)' }}>
                        <Repeat size={10} /> {REPEAT_LABELS[r.repeat]}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Toggle checked={r.active} onChange={() => toggleReminder(r.id)} />
                  <button onClick={() => deleteReminder(r.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {inactive.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div className="section-label">Paused</div>
            {inactive.map((r, i) => (
              <div key={r.id} className="reminder-card" style={{ opacity: 0.5, animationDelay: i * 0.05 + 's' }}>
                <div className="reminder-icon" style={{ background: 'var(--bg-raised)' }}>
                  <Bell size={20} color="var(--text-muted)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'line-through' }}>{r.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{r.time}</div>
                </div>
                <Toggle checked={r.active} onChange={() => toggleReminder(r.id)} />
              </div>
            ))}
          </div>
        )}

        <div style={{ height: 20 }} />
      </div>

      {showAdd && <AddReminderModal onClose={() => setShowAdd(false)} onAdd={addReminder} />}
    </div>
  );
}
