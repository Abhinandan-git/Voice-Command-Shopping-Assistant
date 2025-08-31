import { create } from 'zustand';

export type ListItem = {
  id: string;
  name: string;
  quantity: number;
  category?: string;
};

type State = {
  items: ListItem[];
  history: string[]; // for suggestions
  addItem: (name: string, quantity?: number, category?: string) => void;
  removeItem: (name: string) => void;
  setQuantity: (name: string, q: number) => void;
  clear: () => void;
  load: () => void;
};

const persistKey = 'vsa_state_v1';

export const useStore = create<State>((set, get) => ({
  items: [],
  history: [],
  addItem: (name, quantity = 1, category) => {
    const items = [...get().items];
    const idx = items.findIndex(i => i.name.toLowerCase() === name.toLowerCase());
    if (idx >= 0) {
      items[idx].quantity += quantity;
    } else {
      items.push({ id: crypto.randomUUID(), name, quantity, category });
    }
    const history = Array.from(new Set([name, ...get().history])).slice(0, 50);
    set({ items, history });
    localStorage.setItem(persistKey, JSON.stringify({ items, history }));
  },
  removeItem: (name) => {
    const items = get().items.filter(i => i.name.toLowerCase() != name.toLowerCase());
    set({ items });
    localStorage.setItem(persistKey, JSON.stringify({ items, history: get().history }));
  },
  setQuantity: (name, q) => {
    const items = get().items.map(i => i.name.toLowerCase()===name.toLowerCase()? {...i, quantity: q} : i);
    set({ items });
    localStorage.setItem(persistKey, JSON.stringify({ items, history: get().history }));
  },
  clear: () => {
    set({ items: [] });
    localStorage.setItem(persistKey, JSON.stringify({ items: [], history: get().history }));
  },
  load: () => {
    try {
      const raw = localStorage.getItem(persistKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        set({ items: parsed.items ?? [], history: parsed.history ?? [] });
      }
    } catch {}
  }
}));
