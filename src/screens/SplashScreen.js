import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

// Star field component
function Stars() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    opacity: (Math.random() * 0.5 + 0.1).toFixed(2),
    dur: (Math.random() * 3 + 2).toFixed(1) + 's',
    delay: (Math.random() * 4).toFixed(1) + 's',
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {stars.map(s => (
        <div key={s.id} className="star" style={{
          top: s.top + '%', left: s.left + '%',
          '--dur': s.dur, '--delay': s.delay, '--opacity': s.opacity
        }} />
      ))}
    </div>
  );
}

// Logo SVG
function JusteLogo({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#9f67ff" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Outer ring */}
      <circle cx="30" cy="30" r="28" stroke="url(#logoGrad)" strokeWidth="1.5" opacity="0.4" />
      {/* Inner ring */}
      <circle cx="30" cy="30" r="20" stroke="url(#logoGrad)" strokeWidth="1" opacity="0.6" />
      {/* J letter */}
      <text x="30" y="37" textAnchor="middle" fontFamily="Syne, sans-serif" fontWeight="800"
        fontSize="24" fill="url(#logoGrad)" filter="url(#glow)">J</text>
      {/* Orbit dot */}
      <circle cx="30" cy="4" r="3" fill="#c084fc" opacity="0.9" />
      <circle cx="56" cy="30" r="2" fill="#7c3aed" opacity="0.7" />
      <circle cx="30" cy="56" r="2.5" fill="#ec4899" opacity="0.6" />
    </svg>
  );
}

export { JusteLogo };

// Onboarding steps
const STEPS = [
  {
    id: 'welcome',
    title: 'Meet Juste.',
    subtitle: 'Your personal AI that remembers, acts, and grows with you. Not a chatbot. Your companion.',
    cta: 'Get Started'
  },
  {
    id: 'name',
    title: 'What\'s your name?',
    subtitle: 'Juste will remember this always.',
    field: 'name', placeholder: 'Your first name', type: 'text'
  },
  {
    id: 'basics',
    title: 'Tell me about you.',
    subtitle: 'Age and what you do — so I can be actually useful.',
    fields: [
      { key: 'age', placeholder: 'Your age', type: 'number' },
      { key: 'occupation', placeholder: 'What you do (student, engineer...)', type: 'text' },
    ]
  },
  {
    id: 'routine',
    title: 'Your daily rhythm.',
    subtitle: 'When do you wake up and sleep? I\'ll work around your schedule.',
    fields: [
      { key: 'wakeTime', label: 'Wake up', type: 'time' },
      { key: 'sleepTime', label: 'Sleep', type: 'time' },
    ]
  },
  {
    id: 'interests',
    title: 'What do you love?',
    subtitle: 'Add your interests so I give better suggestions.',
    field: 'interests', placeholder: 'e.g. fitness, coding, music', type: 'tags'
  },
  {
    id: 'done',
    title: 'You\'re all set!',
    subtitle: 'Juste is ready. Start chatting, set reminders, schedule messages — all from one place.',
    cta: 'Open Juste'
  }
];

export default function SplashScreen() {
  const { completeOnboarding, setScreen, onboarded } = useApp();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '', age: '', occupation: '',
    wakeTime: '07:00', sleepTime: '23:00',
    interests: [], contacts: [], allergies: [], location: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (onboarded) {
      setTimeout(() => setScreen('app'), 1800);
    }
  }, [onboarded, setScreen]);

  const transition = (fn) => {
    setVisible(false);
    setTimeout(() => { fn(); setVisible(true); }, 200);
  };

  const next = () => {
    if (step === STEPS.length - 1) {
      completeOnboarding(formData);
    } else {
      transition(() => setStep(s => s + 1));
    }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setFormData(f => ({ ...f, interests: [...f.interests, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (t) => setFormData(f => ({ ...f, interests: f.interests.filter(x => x !== t) }));

  const current = STEPS[step];

  // Welcome & Done screens
  if (current.id === 'welcome' || current.id === 'done') {
    return (
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 32px', position: 'relative', gap: 32,
        opacity: visible ? 1 : 0, transition: 'opacity 0.2s'
      }}>
        <Stars />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, zIndex: 1 }}>
          <div className="splash-orb">
            <JusteLogo size={64} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800,
              color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 8,
              background: 'linear-gradient(135deg, #f0eeff, #c084fc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              {current.title}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, maxWidth: 280 }}>
              {current.subtitle}
            </div>
          </div>
          {current.id === 'done' && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {['💬 Chat', '⏰ Reminders', '📅 Schedules', '🧠 Memory'].map(f => (
                <span key={f} className="tag">{f}</span>
              ))}
            </div>
          )}
          <button className="btn-primary" onClick={next} style={{ width: 200, marginTop: 8 }}>
            {current.cta}
          </button>
        </div>

        {/* Progress dots */}
        {current.id !== 'done' && (
          <div style={{ display: 'flex', gap: 6, position: 'absolute', bottom: 48 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === step ? 20 : 6, height: 6, borderRadius: 3,
                background: i === step ? 'var(--purple-bright)' : 'var(--text-muted)',
                transition: 'all 0.3s'
              }} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      padding: '60px 24px 40px', position: 'relative',
      opacity: visible ? 1 : 0, transition: 'opacity 0.2s'
    }}>
      <Stars />

      {/* Header */}
      <div style={{ marginBottom: 40, zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <JusteLogo size={28} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--purple-glow)' }}>juste</span>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700,
          color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 8
        }}>{current.title}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{current.subtitle}</div>
      </div>

      {/* Fields */}
      <div style={{ zIndex: 1, flex: 1 }}>
        {current.field && current.type !== 'tags' && (
          <input
            className="input-field"
            type={current.type}
            placeholder={current.placeholder}
            value={formData[current.field] || ''}
            onChange={e => setFormData(f => ({ ...f, [current.field]: e.target.value }))}
            autoFocus
            style={{ marginBottom: 16 }}
          />
        )}

        {current.fields && current.fields.map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            {f.label && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</div>}
            <input
              className="input-field"
              type={f.type}
              placeholder={f.placeholder}
              value={formData[f.key] || ''}
              onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))}
            />
          </div>
        ))}

        {current.type === 'tags' && (
          <div>
            <input
              className="input-field"
              placeholder={current.placeholder}
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={addTag}
              style={{ marginBottom: 12 }}
            />
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>Press Enter to add</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {formData.interests.map(t => (
                <span key={t} className="tag" style={{ cursor: 'pointer' }} onClick={() => removeTag(t)}>
                  {t} ×
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, zIndex: 1 }}>
        {step > 0 && (
          <button className="btn-ghost" onClick={() => transition(() => setStep(s => s - 1))} style={{ flex: 1 }}>
            Back
          </button>
        )}
        <button className="btn-primary" onClick={next} style={{ flex: 2 }}>
          Continue →
        </button>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20, zIndex: 1 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 20 : 6, height: 6, borderRadius: 3,
            background: i === step ? 'var(--purple-bright)' : i < step ? 'var(--purple-dim)' : 'var(--text-muted)',
            transition: 'all 0.3s'
          }} />
        ))}
      </div>
    </div>
  );
}
