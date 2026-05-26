// Juste AI Brain — powered by Groq (FREE)
// Get your free API key at: console.groq.com

const SYSTEM_PROMPT = (profile, memories, reminders, schedules) => `
You are Juste, a deeply personal AI assistant. You are warm, intelligent, concise, and genuinely helpful.

PERSONALITY:
- Talk like a close, smart friend — not a corporate assistant
- Be brief (2-4 sentences usually). No lists unless needed.
- Use first name when natural. Remember everything.
- Proactively notice patterns and suggest things

USER PROFILE:
Name: ${profile.name || 'Unknown'}
Age: ${profile.age || 'Unknown'}
Occupation: ${profile.occupation || 'Unknown'}
Wake time: ${profile.wakeTime}
Sleep time: ${profile.sleepTime}
Location: ${profile.location || 'Unknown'}
Interests: ${profile.interests?.join(', ') || 'None saved yet'}
Allergies: ${profile.allergies?.join(', ') || 'None'}
Contacts: ${profile.contacts?.map(c => `${c.name} (${c.platform}: ${c.handle})`).join(', ') || 'None saved'}

MEMORY (what I know about this person):
${memories.slice(0, 20).map(m => `- ${m.text}`).join('\n') || 'No memories yet'}

ACTIVE REMINDERS: ${reminders.filter(r => r.active).length} set
ACTIVE SCHEDULES: ${schedules.filter(s => s.active).length} active

CAPABILITIES — when user asks, respond with action JSON at the end:
1. Set reminder: {"action":"reminder","label":"...","time":"HH:MM","date":"today|tomorrow","repeat":"none|daily|weekly"}
2. Schedule message: {"action":"schedule","label":"...","platform":"whatsapp|telegram","contact":"...","message":"...","time":"HH:MM","repeat":"daily|weekly|weekdays"}
3. Save to memory: {"action":"memory","text":"...","category":"profile|health|preference|contact|goal"}
4. Set alarm: {"action":"alarm","label":"...","time":"HH:MM","repeat":"none|daily|weekdays"}

IMPORTANT:
- If user tells you something personal, ALWAYS save it to memory
- If user asks to set reminder/alarm/schedule, include the action JSON
- Keep JSON on its own line at the very end
- Be conversational first, action second
- Current time: ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
- Current date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
`;

export async function processMessage(userMessage, profile, memories, reminders, schedules, conversationHistory, apiKey) {
  const systemPrompt = SYSTEM_PROMPT(profile, memories, reminders, schedules);

  const recentHistory = conversationHistory.slice(-12).map(m => ({
    role: m.role,
    content: m.content
  }));

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 600,
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          ...recentHistory,
          { role: 'user', content: userMessage }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Groq API error');
    }

    const data = await response.json();
    const fullText = data.choices[0]?.message?.content || '';

    // Parse action JSON if present
    let text = fullText;
    let action = null;

    const jsonMatch = fullText.match(/\{"action"[^}]+\}/);
    if (jsonMatch) {
      try {
        action = JSON.parse(jsonMatch[0]);
        text = fullText.replace(jsonMatch[0], '').trim();
      } catch {}
    }

    return { text, action };
  } catch (error) {
    throw error;
  }
}

// Fallback local responses when no API key is set
export function localResponse(userMessage, profile, memories) {
  const msg = userMessage.toLowerCase();
  const name = profile.name || 'there';

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    return { text: `${greeting}, ${name}! What can I do for you today?`, action: null };
  }

  if (msg.includes('remind') || msg.includes('alarm')) {
    const timeMatch = msg.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
    if (timeMatch) {
      return {
        text: `Got it! I'll remind you at that time.`,
        action: { action: 'reminder', label: userMessage, time: timeMatch[0], date: 'today', repeat: 'none' }
      };
    }
    return { text: `When would you like the reminder? Tell me the time.`, action: null };
  }

  if (msg.includes('remember') || msg.includes('know that') || msg.includes('save')) {
    return {
      text: `Saved! I'll remember that.`,
      action: { action: 'memory', text: userMessage, category: 'general' }
    };
  }

  if (msg.includes('schedule') || msg.includes('whatsapp') || msg.includes('telegram')) {
    return { text: `I can schedule that. Who should I message, on which platform, and at what time?`, action: null };
  }

  if (msg.includes('who am i') || msg.includes('what do you know')) {
    if (memories.length === 0) return { text: `I don't know much yet, ${name}. Tell me about yourself!`, action: null };
    return { text: `Here's what I know: ${memories.slice(0, 3).map(m => m.text).join(' ')}`, action: null };
  }

  if (msg.includes('time')) {
    return { text: `It's ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}.`, action: null };
  }

  if (msg.includes('date') || msg.includes('today')) {
    return { text: `Today is ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}.`, action: null };
  }

  return {
    text: `Add your free Groq API key in Settings to unlock my full brain! Get it free at console.groq.com — takes 2 minutes.`,
    action: null
  };
}