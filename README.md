# Juste — Your Personal AI Assistant

A cosmic-themed personal AI app that:
- 💬 Chats with memory (remembers you forever)
- ⏰ Sets reminders & alarms
- 📅 Schedules WhatsApp/Telegram messages
- 🧠 Stores your personal memories
- 📱 Installs on Android as a real app (PWA)

---

## ⚡ Setup (5 minutes)

### Step 1 — Install Node.js
Download from: https://nodejs.org (choose LTS version)

### Step 2 — Install dependencies
Open terminal/command prompt in the `juste` folder:
```
npm install
```

### Step 3 — Run the app
```
npm start
```
This opens http://localhost:3000 in your browser.

### Step 4 — Install on Android
1. Open Chrome on your Android phone
2. Go to your computer's IP address:
   - Find your IP: run `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - Open: http://YOUR_IP:3000
3. Chrome will show "Add to Home screen" banner
4. Tap it → Juste installs as a real app!

---

## 🤖 Adding AI (Claude API)

1. Go to https://console.anthropic.com
2. Create a free account
3. Generate an API key (starts with sk-ant-)
4. Open Juste → Settings → API Key → paste it

**Cost:** Less than ₹1 per day of heavy use.

---

## 📁 Project Structure

```
juste/
├── public/
│   ├── index.html       — App shell
│   ├── manifest.json    — PWA config
│   ├── sw.js            — Offline support
│   ├── icon-192.png     — App icon
│   └── icon-512.png     — App icon (large)
├── src/
│   ├── App.js           — Root router
│   ├── index.css        — All styles (cosmic theme)
│   ├── context/
│   │   └── AppContext.js — Global state & storage
│   ├── utils/
│   │   └── ai.js        — Claude AI integration
│   ├── screens/
│   │   ├── SplashScreen.js   — Onboarding
│   │   ├── ChatScreen.js     — AI chat
│   │   ├── RemindersScreen.js — Alarms
│   │   ├── SchedulesScreen.js — Auto-messages
│   │   ├── MemoryScreen.js   — Memory viewer
│   │   └── SettingsScreen.js — Profile & config
│   └── components/
│       └── BottomNav.js — Navigation bar
└── package.json
```

---

## 🔧 Connecting to Hermes Agent (Advanced)

To enable real WhatsApp/Telegram scheduling:
1. Install Hermes on a $5 VPS: https://github.com/NousResearch/hermes-agent
2. Connect Hermes Telegram/WhatsApp gateway
3. Juste sends schedule commands to Hermes via webhook

---

## 💡 Tips

- Just talk naturally — Juste saves important info automatically
- Ask: "What do you know about me?" to see your memory
- Say: "Remind me at 8am daily" — it creates the reminder
- Say: "Message Mom on WhatsApp at 9am every day good morning"
- All data stored locally on your device — fully private

