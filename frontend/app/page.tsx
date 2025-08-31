'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store/useStore';
import { parseCommand } from '@/lib/nlp';
import { categories, substitutes, seasonalByMonth } from '@/lib/data';
import { Mic, Trash2, Sparkles, Search, Languages } from 'lucide-react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Optionally, you can define a type for SpeechRecognition if you want type safety, or just use 'any' for compatibility.
type SpeechRecognitionType = typeof window extends { SpeechRecognition: any } ? InstanceType<typeof window.SpeechRecognition> : any;

export default function HomePage() {
  const { items, addItem, removeItem, setQuantity, load, history } = useStore();
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState<string>('en-US');
  const [log, setLog] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return;
    const recog = new SR();
    recog.continuous = false;
    recog.lang = lang;
    recog.interimResults = false;
    recog.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join(' ');
      handleVoice(transcript);
    };
    recog.onend = () => setListening(false);
    recognitionRef.current = recog;
  }, [lang]);

  const handleVoice = async (input: string) => {
    setLog(l => [`“${input}”`, ...l].slice(0, 10));
    const cmd = parseCommand(input);

    if (cmd.intent === 'add') {
      const name = cmd.item.trim() || 'item';
      const category = categories[name as keyof typeof categories];
      addItem(name, cmd.quantity ?? 1, category);
    } else if (cmd.intent === 'remove') {
      const name = cmd.item.trim();
      if (name) removeItem(name);
    } else if (cmd.intent === 'modify') {
      if (cmd.item) setQuantity(cmd.item.trim(), cmd.quantity);
    } else if (cmd.intent === 'search') {
      // simple client-side search using bundled products
      const res = await fetch('/api/search?term=' + encodeURIComponent(cmd.term)
        + (cmd.maxPrice ? `&max=${cmd.maxPrice}` : '')
        + (cmd.brand ? `&brand=${encodeURIComponent(cmd.brand)}` : ''));
      const data = await res.json();
      setSearchResults(data.results);
    } else if (cmd.intent === 'list') {
      // no-op, list is visible
    }
  };

  const toggle = () => {
    const recog = recognitionRef.current;
    if (!recog) {
      alert('SpeechRecognition not supported in this browser.');
      return;
    }
    if (listening) {
      recog.stop();
      setListening(false);
    } else {
      recog.lang = lang;
      recog.start();
      setListening(true);
    }
  };

  const month = new Date().getMonth() + 1;
  const seasonal = seasonalByMonth[month] || [];

  const suggestFromHistory = history.slice(0, 5).filter(h => !items.find(i => i.name.toLowerCase() === h.toLowerCase()));

  return (
    <main className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">🛒 Voice Shopping Assistant</h1>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm opacity-80">
            <Languages size={16} />
            <select
              className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1"
              value={lang}
              onChange={e => setLang(e.target.value)}
              title="Recognition language"
            >
              <option value="en-US">English (US)</option>
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">Hindi (भारत)</option>
              <option value="es-ES">Español (ES)</option>
              <option value="fr-FR">Français</option>
            </select>
          </label>
          <button
            onClick={toggle}
            className={`rounded-2xl px-3 py-2 border flex items-center gap-2 ${listening ? 'border-green-500' : 'border-neutral-700'}`}
            aria-pressed={listening}
          >
            <Mic className={listening ? 'animate-pulse' : ''} size={16} />
            {listening ? 'Listening…' : 'Start Voice'}
          </button>
        </div>
      </header>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Shopping List</h2>
            <button
              onClick={() => { if (confirm('Clear all items?')) location.reload(); }}
              className="text-xs opacity-70 hover:opacity-100 flex items-center gap-1"
              title="Reload to clear local state"
            >
              <Trash2 size={14} /> Reset
            </button>
          </div>
          <ul className="space-y-2">
            {items.map(i => (
              <li key={i.id} className="flex items-center justify-between bg-neutral-800 rounded-xl px-3 py-2">
                <div>
                  <div className="font-medium capitalize">{i.name}</div>
                  <div className="text-xs opacity-70">
                    Qty: {i.quantity} {i.category ? `• ${i.category}` : ''}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={i.quantity}
                    onChange={e => setQuantity(i.name, Math.max(1, Number(e.target.value)))}
                    className="w-16 bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm"
                    aria-label={`Set quantity for ${i.name}`}
                  />
                  <button onClick={() => removeItem(i.name)} className="text-sm underline">Remove</button>
                </div>
              </li>
            ))}
            {items.length === 0 && (
              <li className="text-sm opacity-70">Say “Add milk” or “Add two apples”.</li>
            )}
          </ul>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
          <h2 className="font-semibold flex items-center gap-2"><Sparkles size={16}/> Smart Suggestions</h2>
          <div className="text-sm opacity-80">Tap to add</div>
          <div className="flex flex-wrap gap-2">
            {suggestFromHistory.map(s => (
              <button key={s} onClick={() => addItem(s, 1)} className="px-3 py-1 rounded-full border border-neutral-700 text-sm">
                {s}
              </button>
            ))}
            {seasonal.map(s => (
              <button key={s} onClick={() => addItem(s, 1, 'produce')} className="px-3 py-1 rounded-full border border-neutral-700 text-sm">
                {s} (seasonal)
              </button>
            ))}
          </div>
          <div className="text-xs opacity-70">
            Substitutes example: try saying “Add milk” and we might suggest almond milk.
          </div>
        </div>
      </section>

      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold flex items-center gap-2"><Search size={16}/> Voice-Activated Search</h2>
        <div className="text-sm opacity-80">Say “Find organic apples under 5 dollars” or “Find toothpaste under 5”.</div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {searchResults.map(p => (
            <div key={p.id} className="rounded-xl border border-neutral-800 p-3">
              <div className="font-medium">{p.name}</div>
              <div className="text-xs opacity-70">{p.brand} • {p.category}</div>
              <div className="mt-1 text-sm">${p.price} / {p.unit}</div>
              <button onClick={() => addItem(p.name, 1, p.category)} className="mt-2 text-sm underline">Add</button>
            </div>
          ))}
          {searchResults.length === 0 && <div className="text-sm opacity-70">No results yet. Try a voice search.</div>}
        </div>
      </section>

      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-2">
        <h3 className="font-semibold">Recent voice</h3>
        <ul className="text-sm opacity-80 list-disc pl-5">
          {log.map((l, i) => <li key={i}>{l}</li>)}
        </ul>
      </section>

      <footer className="opacity-60 text-xs">
        Works offline in your browser storage. Speech recognition depends on your browser (best on Chrome). 
      </footer>
    </main>
  );
}
