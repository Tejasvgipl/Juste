import React, { useEffect } from 'react';
import './index.css';
import { AppProvider, useApp } from './context/AppContext';
import SplashScreen from './screens/SplashScreen';
import ChatScreen from './screens/ChatScreen';
import RemindersScreen from './screens/RemindersScreen';
import SchedulesScreen from './screens/SchedulesScreen';
import MemoryScreen from './screens/MemoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import BottomNav from './components/BottomNav';

// Star field for background
function CosmicBackground() {
  return (
    <div className="cosmic-bg">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
    </div>
  );
}

// Toast notification
function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return <div className="toast">{toast}</div>;
}

// Main app content
function AppContent() {
  const { screen, setScreen, tab, onboarded } = useApp();

  useEffect(() => {
    if (screen === 'splash') {
      if (onboarded) {
        const t = setTimeout(() => setScreen('app'), 1600);
        return () => clearTimeout(t);
      }
    }
  }, [screen, onboarded, setScreen]);

  const renderScreen = () => {
    switch (tab) {
      case 'chat': return <ChatScreen />;
      case 'reminders': return <RemindersScreen />;
      case 'schedules': return <SchedulesScreen />;
      case 'memory': return <MemoryScreen />;
      case 'settings': return <SettingsScreen />;
      default: return <ChatScreen />;
    }
  };

  return (
    <>
      <CosmicBackground />
      <div className="app-shell">
        {screen === 'splash' || screen !== 'app' ? (
          <SplashScreen />
        ) : (
          <>
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              {renderScreen()}
            </div>
            <BottomNav />
          </>
        )}
      </div>
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
