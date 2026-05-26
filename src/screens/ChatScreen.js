import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, Sparkles, Trash2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { processMessage, localResponse } from '../utils/ai';
import { JusteLogo } from './SplashScreen';

const QUICK_ACTIONS = [
  { label: '⏰ Set reminder', prompt: 'Set a reminder for me' },
  { label: '📅 Schedule message', prompt: 'Schedule a daily message for me' },
  { label: '🧠 What do you know?', prompt: 'What do you know about me?' },
  { label: '🌅 Morning briefing', prompt: 'Give me my morning briefing' },
  { label: '💡 Suggest something', prompt: 'Suggest something useful I could do today' },
];

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: '4px 0' }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, var(--purple-core), var(--purple-bright))',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <JusteLogo size={16} />
      </div>
      <div className="bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '14px 18px' }}>
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-end', gap: 8, marginBottom: 12
    }}>
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--purple-core), var(--purple-bright))',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <JusteLogo size={16} />
        </div>
      )}
      <div>
        <div className={isUser ? 'bubble-user' : 'bubble-ai'}>
          {msg.content}
        </div>
        {msg.action && (
          <div style={{
            marginTop: 6, padding: '6px 10px', borderRadius: 10,
            background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
            fontSize: 11, color: 'var(--purple-glow)',
            display: 'flex', alignItems: 'center', gap: 5
          }}>
            <Sparkles size={10} />
            {msg.action.action === 'reminder' && `⏰ Reminder set: ${msg.action.label} at ${msg.action.time}`}
            {msg.action.action === 'alarm' && `🔔 Alarm: ${msg.action.label} at ${msg.action.time}`}
            {msg.action.action === 'schedule' && `📅 Scheduled: ${msg.action.label}`}
            {msg.action.action === 'memory' && `🧠 Saved to memory`}
          </div>
        )}
        <div style={{
          fontSize: 10, color: 'var(--text-muted)', marginTop: 4,
          textAlign: isUser ? 'right' : 'left', padding: '0 4px'
        }}>
          {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

export default function ChatScreen() {
  const { messages, addMessage, addMemory, addReminder, addSchedule, showToast, profile, memories, reminders, schedules, clearChat } = useApp();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('juste_apikey') || '');
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleAction = useCallback((action) => {
    if (!action) return;
    if (action.action === 'reminder' || action.action === 'alarm') {
      addReminder({ label: action.label, time: action.time, date: action.date || 'today', repeat: action.repeat || 'none', type: action.action });
    } else if (action.action === 'schedule') {
      addSchedule({ label: action.label, platform: action.platform, contact: action.contact, message: action.message, time: action.time, repeat: action.repeat || 'daily' });
    } else if (action.action === 'memory') {
      addMemory(action.text, action.category || 'general');
    }
  }, [addReminder, addSchedule, addMemory]);

  const sendMessage = useCallback(async (text = input.trim()) => {
    if (!text || loading) return;
    setInput('');

    const userMsg = addMessage({ role: 'user', content: text });
    setLoading(true);

    try {
      let result;
      if (apiKey) {
        const history = messages.map(m => ({ role: m.role, content: m.content }));
        result = await processMessage(text, profile, memories, reminders, schedules, history, apiKey);
      } else {
        await new Promise(r => setTimeout(r, 800));
        result = localResponse(text, profile, memories);
      }

      const aiMsg = addMessage({ role: 'assistant', content: result.text, action: result.action });
      if (result.action) handleAction(result.action);

      // Auto-save personal info shared in chat
      if (text.length > 20 && (text.includes('I am') || text.includes('I like') || text.includes('my ') || text.includes('I\'m'))) {
        addMemory(text, 'chat');
      }
    } catch (err) {
      addMessage({ role: 'assistant', content: `Something went wrong: ${err.message}. Check your API key in settings.` });
    } finally {
      setLoading(false);
    }
  }, [input, loading, apiKey, messages, profile, memories, reminders, schedules, addMessage, handleAction, addMemory]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const isEmpty = messages.length === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>

      {/* Header */}
      <div style={{
        padding: '16px 20px 12px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexShrink: 0,
        borderBottom: '1px solid var(--border-subtle)',
        background: 'linear-gradient(to bottom, var(--bg-deep), transparent)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--purple-core), var(--purple-bright))',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <JusteLogo size={22} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>Juste</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#22c55e' }}>
              <div className="pulse-dot" style={{ width: 6, height: 6 }} />
              {apiKey ? 'Connected · Claude' : 'Local mode'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!apiKey && (
            <button className="btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => setShowKeyPrompt(true)}>
              Add API Key
            </button>
          )}
          {messages.length > 0 && (
            <button className="btn-ghost" style={{ padding: '6px 10px' }} onClick={clearChat}>
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* API Key prompt */}
      {showKeyPrompt && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 50,
          background: 'rgba(7,7,15,0.9)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', padding: 24
        }}>
          <div className="glass-card" style={{ width: '100%', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>Anthropic API Key</div>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setShowKeyPrompt(false)}>
                <X size={20} />
              </button>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
              Get a free key at <span style={{ color: 'var(--purple-glow)' }}>console.anthropic.com</span>. Stored only on your device.
            </div>
            <input
              className="input-field"
              type="password"
              placeholder="sk-ant-..."
              defaultValue={apiKey}
              onChange={e => {
                const v = e.target.value;
                setApiKey(v);
                localStorage.setItem('juste_apikey', v);
              }}
              style={{ marginBottom: 16 }}
            />
            <button className="btn-primary" style={{ width: '100%' }} onClick={() => { setShowKeyPrompt(false); showToast('✓ API key saved'); }}>
              Save Key
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px' }}>

        {isEmpty && (
          <div style={{ textAlign: 'center', paddingTop: 40, paddingBottom: 24 }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
              color: 'var(--text-primary)', marginBottom: 8
            }}>
              Hey{profile.name ? `, ${profile.name}` : ''} 👋
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              What's on your mind? I remember everything.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {QUICK_ACTIONS.map(a => (
                <button key={a.label} className="btn-ghost"
                  style={{ fontSize: 13, padding: '8px 14px', borderRadius: 20 }}
                  onClick={() => sendMessage(a.prompt)}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => <Message key={msg.id} msg={msg} />)}
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 16px', paddingBottom: 'calc(88px)',
        borderTop: '1px solid var(--border-subtle)',
        background: 'linear-gradient(to top, var(--bg-void) 80%, transparent)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <textarea
              ref={inputRef}
              className="input-field"
              placeholder="Ask anything, set reminders..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              style={{
                resize: 'none', lineHeight: 1.5, maxHeight: 100,
                paddingRight: 44, overflowY: 'auto'
              }}
            />
          </div>
          <button
            className="btn-primary"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: 46, height: 46, padding: 0, borderRadius: 14, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: !input.trim() || loading ? 0.5 : 1
            }}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
