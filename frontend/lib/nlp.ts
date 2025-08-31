export type ParsedCommand =
  | { intent: 'add', item: string, quantity?: number }
  | { intent: 'remove', item: string }
  | { intent: 'modify', item: string, quantity: number }
  | { intent: 'search', term: string, maxPrice?: number, brand?: string }
  | { intent: 'list' }
  | { intent: 'unknown', raw: string };

const qtyWords: Record<string, number> = {
  one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10
};

function parseQuantity(s: string): number | undefined {
  const num = s.match(/\b(\d+)\b/);
  if (num) return parseInt(num[1], 10);
  for (const [w, n] of Object.entries(qtyWords)) {
    if (new RegExp(`\\b${w}\\b`, 'i').test(s)) return n;
  }
  return undefined;
}

export function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s.%-]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function parseCommand(input: string): ParsedCommand {
  const s = normalize(input);

  // Add
  if (/\b(add|buy|get|need|want)\b/.test(s)) {
    const quantity = parseQuantity(s);
    // heuristic: last word is item (excluding 'to my list', etc.)
    const itemMatch = s.match(/\b(?:add|buy|get|need|want)\b(.*)/);
    const item = itemMatch ? itemMatch[1].replace(/to my list|to the list|to list|please/g,'').trim() : '';
    return { intent: 'add', item, quantity };
  }

  // Remove
  if (/\b(remove|delete|drop|clear)\b/.test(s)) {
    const item = s.replace(/.*\b(remove|delete|drop|clear)\b/,'').trim();
    return { intent: 'remove', item };
  }

  // Modify quantity
  if (/\b(update|change|set)\b.*\b(quantity|qty|amount)\b/.test(s)) {
    const quantity = parseQuantity(s) ?? 1;
    const itemMatch = s.match(/\b(?:of|for)\b\s+(.*)/);
    const item = itemMatch ? itemMatch[1] : '';
    return { intent: 'modify', item, quantity };
  }

  // Search with optional filters
  if (/\b(find|search|look for|show me)\b/.test(s)) {
    const termMatch = s.match(/\b(find|search|look for|show me)\b\s+(.*?)(?:\s+under\s+\$?(\d+(?:\.\d+)?))?(?:\s+by\s+([a-z0-9'\- ]+))?$/i);
    let term = '';
    let maxPrice;
    let brand;
    if (termMatch) {
      term = termMatch[2]?.trim();
      if (termMatch[3]) maxPrice = parseFloat(termMatch[3]);
      if (termMatch[4]) brand = termMatch[4].trim();
    } else {
      term = s.replace(/\b(find|search|look for|show me)\b/,'').trim();
    }
    return { intent: 'search', term, maxPrice, brand };
  }

  if (/\b(list|what(?:'| i)s on my list|show list)\b/.test(s)) {
    return { intent: 'list' };
  }

  return { intent: 'unknown', raw: input };
}
