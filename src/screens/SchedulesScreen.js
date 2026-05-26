import React, { useState } from 'react';
import { Plus, Trash2, Clock, Repeat, MessageCircle, Send, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PLATFORM_CONFIG = {
  whatsapp: { color: '#25D366', bg: 'rgba(37,211,102,0.1)', label: 'WhatsApp', emoji: '💬' },
  telegram: { color: '#2AABEE', bg: 'rgba(42,171,238,0.1)', label: 'Telegram', emoji: '✈️' },
  sms: { color: '#9f67ff', bg: 'rgba(159,103,255,0.1)', label: 'SMS', emoji: '📱' },
};

const REPEAT_LABELS = { daily: 'Daily', weekly: 'Weekly', weekdays: 'Weekdays', once: 'Once' };

const PRESET_SCHEDULES = [
  { label: '🌅 Good morning message', platform: 'whatsapp', message: 'Good morning! Have an amazing day! ☀️', time: '08:00', repeat: 'daily' },
  { label: '🌙 Good night', platform: 'whatsapp', message: 'Good night! Sweet dreams 🌙', time: '22:00', repeat: 'daily' },
  { label: '💪 Gym motivation', platform: 'telegram', message: 'Time to crush it at the gym! 💪🔥', time: '17:30', repeat: 'weekdays' },
  { label: '📰 Daily news brief', platform: 'telegram', message: 'Hey! Check today\'s news 📰', time: '09:00', repeat: 'weekdays' },
];

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle" onClick={e => { e.stopPropagation(); onChange(); }}>
      <input type="checkbox" checked={checked} onChange={() => {}} />
      <div className="toggle-track" />
      <div className="toggle-thumb" style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }} />
    </label>
  );
}

function AddScheduleModal({ onClose, onAdd }) {
  const { profile } = useApp();
  const [tab, setTab] = useState('custom');
  const [form, setForm] = useState({
    label: '', platform: 'whatsapp', contact: '',
    message: '', time: '09:00', repeat: 'daily'
  });

  const contactOptions = profile.contacts || [];

  const submit = () => {
    if (!form.label.trim() || !form.message.trim()) return;
    onAdd(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" style={{ maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-subtle)', margin: '0 auto 20px' }} />
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 20 }}>
          Schedule Message
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['custom', 'preset'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
              background: tab === t ? 'var(--purple-core)' : 'var(--bg-glass)',
              color: tab === t ? 'white' : 'var(--text-muted)', transition: 'all 0.2s'
            }}>{t === 'custom' ? '✏️ Custom' : '⚡ Presets'}</button>
          ))}
        </div>

        {tab === 'custom' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input className="input-field" placeholder="Schedule name (e.g. Morning message to Mom)"
              value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} autoFocus />

            <div>
              <div className="section-label">Platform</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {Object.entries(PLATFORM_CONFIG).map(([key, cfg]) => (
                  <button key={key} onClick={() => setForm(f => ({ ...f, platform: key }))} style={{
                    flex: 1, padding: '10px 4px', borderRadius: 12, border: '1px solid', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
                    borderColor: form.platform === key ? cfg.color : 'var(--border-subtle)',
                    background: form.platform === key ? cfg.bg : 'var(--bg-glass)',
                    color: form.platform === key ? cfg.color : 'var(--text-muted)',
                    transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
                  }}>
                    <span style={{ fontSize: 18 }}>{cfg.emoji}</span>
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            <input className="input-field" placeholder="Contact name or number"
              value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />

            <div>
              <div className="section-label">Message</div>
              <textarea className="input-field" placeholder="What should Juste send?"
                value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                rows={3} style={{ resize: 'none' }} />
            </div>

            <div>
              <div className="section-label">Time</div>
              <input className="input-field" type="time" value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            </div>

            <div>
              <div className="section-label">Frequency</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {Object.entries(REPEAT_LABELS).map(([k, v]) => (
                  <button key={k} onClick={() => setForm(f => ({ ...f, repeat: k }))} style={{
                    flex: 1, padding: '8px 4px', borderRadius: 10, border: '1px solid', cursor: 'pointer',
                    fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 500,
                    borderColor: form.repeat === k ? 'var(--purple-bright)' : 'var(--border-subtle)',
                    background: form.repeat === k ? 'rgba(124,58,237,0.15)' : 'var(--bg-glass)',
                    color: form.repeat === k ? 'var(--purple-glow)' : 'var(--text-muted)',
                  }}>{v}</button>
                ))}
              </div>
            </div>

            <button className="btn-primary" onClick={submit} style={{ width: '100%', marginTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Zap size={16} /> Activate Schedule
              </div>
            </button>
          </div>
        ) : (
          <div>
            {PRESET_SCHEDULES.map((p, i) => {
              const cfg = PLATFORM_CONFIG[p.platform];
              return (
                <div key={i} className="reminder-card" onClick={() => { onAdd({ ...p }); onClose(); }}>
                  <div className="reminder-icon" style={{ background: cfg.bg }}>
                    <span style={{ fontSize: 20 }}>{p.label.split(' ')[0]}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-primary)' }}>{p.label.slice(2)}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 3, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: cfg.color }}>{cfg.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.time} · {REPEAT_LABELS[p.repeat]}</span>
                    </div>
                  </div>
                  <Plus size={16} color="var(--purple-glow)" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SchedulesScreen() {
  const { schedules, addSchedule, toggleSchedule, deleteSchedule } = useApp();
  const [showAdd, setShowAdd] = useState(false);

  const active = schedules.filter(s => s.active);
  const inactive = schedules.filter(s => !s.active);

  return (
    <div className="screen">
      <div className="scroll-content">
        <div style={{ paddingTop: 20, paddingBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--text-primary)' }}>
              Schedules
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
              Auto-message on WhatsApp, Telegram & more
            </div>
          </div>
          <button className="btn-primary" onClick={() => setShowAdd(true)}
            style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
            <Plus size={16} /> New
          </button>
        </div>

        {/* Info banner */}
        <div style={{
          padding: '12px 14px', borderRadius: 14, marginTop: 16, marginBottom: 4,
          background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)',
          display: 'flex', gap: 10, alignItems: 'flex-start'
        }}>
          <Zap size={16} color="var(--purple-glow)" style={{ marginTop: 1, flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Juste will send these automatically via your connected platforms. Connect WhatsApp/Telegram in Settings to activate.
          </div>
        </div>

        {schedules.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 6 }}>No schedules yet</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>Schedule daily messages, briefings, and more</div>
            <button className="btn-ghost" onClick={() => setShowAdd(true)}>Create schedule</button>
          </div>
        )}

        {active.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div className="section-label">Running</div>
            {active.map((s, i) => {
              const cfg = PLATFORM_CONFIG[s.platform] || PLATFORM_CONFIG.whatsapp;
              return (
                <div key={s.id} className="schedule-row" style={{ animationDelay: i * 0.05 + 's' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                      background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18
                    }}>{cfg.emoji}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.label}
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                        {s.contact && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>→ {s.contact}</span>}
                        <span style={{ fontSize: 11, color: cfg.color }}>{cfg.label}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.time} · {REPEAT_LABELS[s.repeat]}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <Toggle checked={s.active} onChange={() => toggleSchedule(s.id)} />
                    <button onClick={() => deleteSchedule(s.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {inactive.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div className="section-label">Paused</div>
            {inactive.map((s, i) => {
              const cfg = PLATFORM_CONFIG[s.platform] || PLATFORM_CONFIG.whatsapp;
              return (
                <div key={s.id} className="schedule-row" style={{ opacity: 0.5, animationDelay: i * 0.05 + 's' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                      {cfg.emoji}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.time}</div>
                    </div>
                  </div>
                  <Toggle checked={s.active} onChange={() => toggleSchedule(s.id)} />
                </div>
              );
            })}
          </div>
        )}

        <div style={{ height: 20 }} />
      </div>
      {showAdd && <AddScheduleModal onClose={() => setShowAdd(false)} onAdd={addSchedule} />}
    </div>
  );
}
