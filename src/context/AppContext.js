import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

const STORAGE_KEYS = {
  PROFILE: 'juste_profile',
  MEMORIES: 'juste_memories',
  REMINDERS: 'juste_reminders',
  SCHEDULES: 'juste_schedules',
  MESSAGES: 'juste_messages',
  ONBOARDED: 'juste_onboarded',
};

const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};

const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

export function AppProvider({ children }) {
  const [screen, setScreen] = useState('splash');
  const [tab, setTab] = useState('chat');
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);

  const [onboarded, setOnboarded] = useState(() => load(STORAGE_KEYS.ONBOARDED, false));
  const [profile, setProfile] = useState(() => load(STORAGE_KEYS.PROFILE, {
    name: '', age: '', occupation: '', wakeTime: '07:00', sleepTime: '23:00',
    interests: [], allergies: [], contacts: [], location: ''
  }));
  const [memories, setMemories] = useState(() => load(STORAGE_KEYS.MEMORIES, []));
  const [reminders, setReminders] = useState(() => load(STORAGE_KEYS.REMINDERS, []));
  const [schedules, setSchedules] = useState(() => load(STORAGE_KEYS.SCHEDULES, []));
  const [messages, setMessages] = useState(() => load(STORAGE_KEYS.MESSAGES, []));

  // Persist
  useEffect(() => { save(STORAGE_KEYS.PROFILE, profile); }, [profile]);
  useEffect(() => { save(STORAGE_KEYS.MEMORIES, memories); }, [memories]);
  useEffect(() => { save(STORAGE_KEYS.REMINDERS, reminders); }, [reminders]);
  useEffect(() => { save(STORAGE_KEYS.SCHEDULES, schedules); }, [schedules]);
  useEffect(() => { save(STORAGE_KEYS.MESSAGES, messages); }, [messages]);
  useEffect(() => { save(STORAGE_KEYS.ONBOARDED, onboarded); }, [onboarded]);

  // Toast
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  // Add memory
  const addMemory = useCallback((text, category = 'general') => {
    const mem = { id: Date.now(), text, category, createdAt: new Date().toISOString() };
    setMemories(prev => [mem, ...prev].slice(0, 100));
    return mem;
  }, []);

  // Add reminder
  const addReminder = useCallback((data) => {
    const r = { id: Date.now(), active: true, ...data, createdAt: new Date().toISOString() };
    setReminders(prev => [r, ...prev]);
    showToast(`⏰ Reminder set for ${data.time}`);
    return r;
  }, [showToast]);

  // Toggle reminder
  const toggleReminder = useCallback((id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  }, []);

  // Delete reminder
  const deleteReminder = useCallback((id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    showToast('Reminder deleted');
  }, [showToast]);

  // Add schedule
  const addSchedule = useCallback((data) => {
    const s = { id: Date.now(), active: true, ...data, createdAt: new Date().toISOString() };
    setSchedules(prev => [s, ...prev]);
    showToast(`📅 Scheduled: ${data.label}`);
    return s;
  }, [showToast]);

  // Toggle schedule
  const toggleSchedule = useCallback((id) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  }, []);

  // Delete schedule
  const deleteSchedule = useCallback((id) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    showToast('Schedule removed');
  }, [showToast]);

  // Add message
  const addMessage = useCallback((msg) => {
    const m = { id: Date.now(), timestamp: new Date().toISOString(), ...msg };
    setMessages(prev => [...prev, m]);
    return m;
  }, []);

  // Clear chat
  const clearChat = useCallback(() => {
    setMessages([]);
    showToast('Chat cleared');
  }, [showToast]);

  // Complete onboarding
  const completeOnboarding = useCallback((profileData) => {
    setProfile(profileData);
    setOnboarded(true);
    addMemory(`My name is ${profileData.name}. I'm ${profileData.age} years old. I work as ${profileData.occupation}.`, 'profile');
    if (profileData.interests.length) {
      addMemory(`I'm interested in: ${profileData.interests.join(', ')}.`, 'interests');
    }
    setScreen('app');
  }, [addMemory]);

  return (
    <AppContext.Provider value={{
      screen, setScreen,
      tab, setTab,
      toast, showToast,
      modal, setModal,
      profile, setProfile,
      memories, addMemory,
      reminders, addReminder, toggleReminder, deleteReminder,
      schedules, addSchedule, toggleSchedule, deleteSchedule,
      messages, addMessage, clearChat,
      onboarded, completeOnboarding,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
