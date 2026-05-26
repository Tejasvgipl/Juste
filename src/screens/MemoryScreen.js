import React, { useState } from 'react';
import { Brain, Plus, Trash2, Search, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CATEGORY_CONFIG = {
  profile: { label: 'Profile', color: '#9f67ff', bg: 'rgba(159,103,255,0.12)', emoji: '👤' },
  interests: { label: 'Interests', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', emoji: '💡' },
  health: { label: 'Health', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', emoji: '🏥' },
  preference: { label: 'Preference', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', emoji: '⭐' },
  contact: { label: 'Contact', color: '#ec4899', bg: 'rgba(236,72,153,0.1)', emoji: '👥' },
  goal: { label: 'Goal', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', emoji: '🎯' },
  chat: { label: 'From chat', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', emoji: '💬' },
  general: { label: 'General', color: '#6b7280', bg: 'rgba(107,114,128,0.1)', emoji: '📝' },
};

const ALL_CATEGORIES = ['all', ...Object.keys(CATEGORY_CONFIG)];

export default function MemoryScreen() {
  const { memories, addMemory, setMemories, profile } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [newMem, setNewMem] = useState('');
  const [newCat, setNewCat] = useState('general');

  const filtered = memories.filter(m => {
    const matchSearch = !search || m.text.toLowerCase().includes(search.toLowerCase());
    const matchCat = filter === 'all' || m.category === filter;
    return matchSearch && matchCat;
  });

  const deleteMemory = (id) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const saveNew = () => {
    if (!newMem.trim()) return;
    addMemory(newMem.trim(), newCat);
    setNewMem('');
    setShowAdd(false);
  };

  const memStats = Object.keys(CATEGORY_CONFIG).reduce((acc, cat) => {
    acc[cat] = memories.filter(m => m.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="screen">
      <div className="scroll-content">
        {/* Header */}
        <div style={{ paddingTop: 20, paddingBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--text-primary)' }}>
              Memory
            </div>
            <button className="btn-primary" onClick={() => setShowAdd(true)}
              style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
              <Plus size={16} /> Add
            </button>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            {memories.length} things Juste knows about you
          </div>
        </div>

        {/* Profile card */}
        {profile.name && (
          <div className="glass-card" style={{ padding: 16, marginTop: 16, marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--purple-core), var(--cosmic-pink))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'white'
              }}>
                {profile.name[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{profile.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  {[profile.age && `${profile.age} yrs`, profile.occupation].filter(Boolean).join(' · ')}
                </div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <div style={{
                  padding: '4px 10px', borderRadius: 20,
                  background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
                  fontSize: 11, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4
                }}>
                  <div className="pulse-dot" style={{ width: 5, height: 5 }} />
                  Learning
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16, overflowX: 'auto', paddingBottom: 4 }}>
          {Object.entries(CATEGORY_CONFIG).filter(([k]) => memStats[k] > 0).map(([k, cfg]) => (
            <div key={k} onClick={() => setFilter(filter === k ? 'all' : k)}
              style={{
                flexShrink: 0, padding: '8px 12px', borderRadius: 12, cursor: 'pointer',
                background: filter === k ? cfg.bg : 'var(--bg-glass)',
                border: `1px solid ${filter === k ? cfg.color + '40' : 'var(--border-subtle)'}`,
                transition: 'all 0.2s'
              }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{cfg.emoji}</div>
              <div style={{ fontSize: 11, color: filter === k ? cfg.color : 'var(--text-muted)', fontWeight: 500 }}>{cfg.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: filter === k ? cfg.color : 'var(--text-secondary)' }}>{memStats[k]}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginTop: 16, marginBottom: 16 }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input className="input-field" placeholder="Search memories..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36 }} />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0
            }}><X size={14} /></button>
          )}
        </div>

        {/* Memories list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🧠</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              {search ? 'No memories match your search' : 'No memories yet'}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>
              Just chat — Juste learns automatically
            </div>
          </div>
        ) : (
          filtered.map((m, i) => {
            const cfg = CATEGORY_CONFIG[m.category] || CATEGORY_CONFIG.general;
            return (
              <div key={m.id} className="memory-chip" style={{ animationDelay: i * 0.04 + 's' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, background: cfg.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, flexShrink: 0
                }}>{cfg.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{m.text}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: cfg.color }}>{cfg.label}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      {new Date(m.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
                <button onClick={() => deleteMemory(m.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })
        )}

        <div style={{ height: 20 }} />
      </div>

      {/* Add memory modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-subtle)', margin: '0 auto 20px' }} />
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 20 }}>
              Add Memory
            </div>
            <textarea className="input-field" placeholder="Something you want Juste to always remember..."
              value={newMem} onChange={e => setNewMem(e.target.value)}
              rows={3} style={{ resize: 'none', marginBottom: 14 }} autoFocus />
            <div className="section-label">Category</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {Object.entries(CATEGORY_CONFIG).map(([k, cfg]) => (
                <button key={k} onClick={() => setNewCat(k)} style={{
                  padding: '6px 12px', borderRadius: 20, border: '1px solid', cursor: 'pointer',
                  fontSize: 12, fontFamily: 'var(--font-body)',
                  borderColor: newCat === k ? cfg.color : 'var(--border-subtle)',
                  background: newCat === k ? cfg.bg : 'var(--bg-glass)',
                  color: newCat === k ? cfg.color : 'var(--text-muted)',
                }}>
                  {cfg.emoji} {cfg.label}
                </button>
              ))}
            </div>
            <button className="btn-primary" onClick={saveNew} style={{ width: '100%' }}>
              Save to Memory
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
