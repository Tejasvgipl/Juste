import React, { useState } from 'react';
import { User, Key, Bell, Smartphone, ChevronRight, Plus, Trash2, Moon, Sun, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { JusteLogo } from './SplashScreen';

const PLATFORM_OPTIONS = ['whatsapp', 'telegram', 'sms', 'instagram'];

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div className="section-label">{title}</div>
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

function Row({ icon, label, value, onClick, danger, last }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
      borderBottom: last ? 'none' : '1px solid var(--border-subtle)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'background 0.15s',
    }}
      onTouchStart={e => { if (onClick) e.currentTarget.style.background = 'var(--bg-glass)'; }}
      onTouchEnd={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: danger ? 'rgba(239,68,68,0.1)' : 'rgba(124,58,237,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: danger ? '#ef4444' : 'var(--purple-glow)'
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, color: danger ? '#ef4444' : 'var(--text-primary)', fontWeight: 500 }}>{label}</div>
        {value && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{value}</div>}
      </div>
      {onClick && <ChevronRight size={16} color="var(--text-muted)" />}
    </div>
  );
}

function EditProfileModal({ onClose }) {
  const { profile, setProfile, addMemory, showToast } = useApp();
  const [form, setForm] = useState({ ...profile });

  const save = () => {
    setProfile(form);
    addMemory(`Updated profile: ${form.name}, ${form.age} yrs, ${form.occupation}`, 'profile');
    showToast('✓ Profile updated');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" style={{ maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-subtle)', margin: '0 auto 20px' }} />
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 20 }}>Edit Profile</div>

        {[
          { key: 'name', label: 'Name', placeholder: 'Your name', type: 'text' },
          { key: 'age', label: 'Age', placeholder: 'Your age', type: 'number' },
          { key: 'occupation', label: 'Occupation', placeholder: 'What you do', type: 'text' },
          { key: 'location', label: 'City', placeholder: 'Your city', type: 'text' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <div className="section-label">{f.label}</div>
            <input className="input-field" type={f.type} placeholder={f.placeholder}
              value={form[f.key] || ''} onChange={e => setForm(d => ({ ...d, [f.key]: e.target.value }))} />
          </div>
        ))}

        <div style={{ marginBottom: 14 }}>
          <div className="section-label">Wake time</div>
          <input className="input-field" type="time" value={form.wakeTime || '07:00'}
            onChange={e => setForm(d => ({ ...d, wakeTime: e.target.value }))} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <div className="section-label">Sleep time</div>
          <input className="input-field" type="time" value={form.sleepTime || '23:00'}
            onChange={e => setForm(d => ({ ...d, sleepTime: e.target.value }))} />
        </div>

        <button className="btn-primary" onClick={save} style={{ width: '100%' }}>Save Profile</button>
      </div>
    </div>
  );
}

function AddContactModal({ onClose }) {
  const { profile, setProfile, showToast } = useApp();
  const [form, setForm] = useState({ name: '', platform: 'whatsapp', handle: '' });

  const save = () => {
    if (!form.name.trim()) return;
    const contacts = [...(profile.contacts || []), { id: Date.now(), ...form }];
    setProfile(p => ({ ...p, contacts }));
    showToast(`✓ ${form.name} added`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-subtle)', margin: '0 auto 20px' }} />
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 20 }}>Add Contact</div>

        <div style={{ marginBottom: 14 }}>
          <div className="section-label">Name</div>
          <input className="input-field" placeholder="Contact name" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div className="section-label">Platform</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {PLATFORM_OPTIONS.map(p => (
              <button key={p} onClick={() => setForm(f => ({ ...f, platform: p }))} style={{
                flex: 1, padding: '8px 4px', borderRadius: 10, border: '1px solid', cursor: 'pointer',
                fontSize: 11, fontFamily: 'var(--font-body)', textTransform: 'capitalize',
                borderColor: form.platform === p ? 'var(--purple-bright)' : 'var(--border-subtle)',
                background: form.platform === p ? 'rgba(124,58,237,0.15)' : 'var(--bg-glass)',
                color: form.platform === p ? 'var(--purple-glow)' : 'var(--text-muted)',
              }}>{p}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div className="section-label">Number / Handle</div>
          <input className="input-field" placeholder="+91 phone or @username" value={form.handle}
            onChange={e => setForm(f => ({ ...f, handle: e.target.value }))} />
        </div>

        <button className="btn-primary" onClick={save} style={{ width: '100%' }}>Add Contact</button>
      </div>
    </div>
  );
}

function ApiKeyModal({ onClose }) {
  const { showToast } = useApp();
  const [key, setKey] = useState(() => localStorage.getItem('juste_apikey') || '');

  const save = () => {
    localStorage.setItem('juste_apikey', key);
    showToast('✓ API key saved');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-subtle)', margin: '0 auto 20px' }} />
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Anthropic API Key</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
          Get your free key at <span style={{ color: 'var(--purple-glow)' }}>console.anthropic.com</span>. Stored only on your device — never sent anywhere else.
        </div>
        <input className="input-field" type="password" placeholder="sk-ant-api03-..."
          value={key} onChange={e => setKey(e.target.value)} style={{ marginBottom: 16 }} />
        <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(124,58,237,0.06)', border: '1px solid var(--border-subtle)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          💡 Uses Claude Haiku — costs less than $0.01 per conversation. Very cheap.
        </div>
        <button className="btn-primary" onClick={save} style={{ width: '100%' }}>Save Key</button>
      </div>
    </div>
  );
}

export default function SettingsScreen() {
  const { profile, setProfile, memories, reminders, schedules, showToast, setScreen } = useApp();
  const [modal, setModal] = useState(null);
  const apiKey = localStorage.getItem('juste_apikey');

  const deleteContact = (id) => {
    setProfile(p => ({ ...p, contacts: p.contacts.filter(c => c.id !== id) }));
    showToast('Contact removed');
  };

  const clearAll = () => {
    if (window.confirm('Reset everything? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="screen">
      <div className="scroll-content">
        <div style={{ paddingTop: 20, paddingBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--text-primary)' }}>
            Settings
          </div>
        </div>

        {/* Profile header */}
        <div className="glass-card" style={{ padding: 20, marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--purple-core), var(--cosmic-pink))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'white'
          }}>
            {profile.name ? profile.name[0].toUpperCase() : '?'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
              {profile.name || 'Set your name'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
              {[profile.occupation, profile.location].filter(Boolean).join(' · ') || 'Add your details'}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              {[
                { label: 'Memories', val: memories.length },
                { label: 'Reminders', val: reminders.length },
                { label: 'Schedules', val: schedules.length },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--purple-glow)' }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Section title="Profile">
          <Row icon={<User size={16} />} label="Edit Profile"
            value={profile.name ? `${profile.name}, ${profile.age || '?'} · ${profile.occupation || 'No occupation'}` : 'Not set'}
            onClick={() => setModal('profile')} />
          <Row icon={<span style={{ fontSize: 14 }}>⏰</span>} label="Daily Schedule"
            value={`Wake ${profile.wakeTime || '07:00'} · Sleep ${profile.sleepTime || '23:00'}`}
            onClick={() => setModal('profile')} last />
        </Section>

        <Section title="AI Brain">
          <Row icon={<Key size={16} />} label="Anthropic API Key"
            value={apiKey ? '••••••••' + apiKey.slice(-4) : 'Not connected — tap to add'}
            onClick={() => setModal('apikey')} />
          <Row icon={<span style={{ fontSize: 14 }}>🤖</span>} label="AI Model"
            value="Claude Haiku 4.5 (fast & cheap)" last />
        </Section>

        <Section title="Contacts">
          {(profile.contacts || []).map((c, i) => (
            <div key={c.id} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
              borderBottom: i < (profile.contacts.length - 1) ? '1px solid var(--border-subtle)' : 'none'
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, background: 'rgba(124,58,237,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--purple-glow)', fontSize: 14
              }}>{c.name[0].toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, textTransform: 'capitalize' }}>
                  {c.platform} · {c.handle}
                </div>
              </div>
              <button onClick={() => deleteContact(c.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <Row icon={<Plus size={16} />} label="Add Contact"
            value="For scheduling messages" onClick={() => setModal('contact')} last />
        </Section>

        <Section title="Integrations">
          <Row icon={<span style={{ fontSize: 14 }}>💬</span>} label="WhatsApp"
            value="Connect via Hermes Agent on your VPS" />
          <Row icon={<span style={{ fontSize: 14 }}>✈️</span>} label="Telegram"
            value="Connect via Hermes Gateway" />
          <Row icon={<span style={{ fontSize: 14 }}>📧</span>} label="Email"
            value="Coming soon" last />
        </Section>

        <Section title="About">
          <Row icon={<JusteLogo size={16} />} label="Juste" value="Version 1.0 · Made with ♥" />
          <Row icon={<Info size={16} />} label="How it works"
            value="Powered by Hermes Agent + Claude" last />
        </Section>

        <Section title="Danger Zone">
          <Row icon={<Trash2 size={16} />} label="Reset Everything"
            value="Delete all data and start over" onClick={clearAll} danger last />
        </Section>

        <div style={{ height: 20 }} />
      </div>

      {modal === 'profile' && <EditProfileModal onClose={() => setModal(null)} />}
      {modal === 'contact' && <AddContactModal onClose={() => setModal(null)} />}
      {modal === 'apikey' && <ApiKeyModal onClose={() => setModal(null)} />}
    </div>
  );
}
