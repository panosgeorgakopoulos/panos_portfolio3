// A toy re-creation of MedBot's routing for the page. The real system trains its models; this one fakes layers 2 and 3 with small lookup tables.

export type Layer = 1 | 2 | 3;

export interface Parse {
  layer: Layer | null;
  intent: 'administer' | 'restock' | 'check' | null;
  qty: number | null;
  item: string | null;
  ward: string | null;
  note: string;
}

export interface Plan {
  ok: boolean;
  message: string;
}

export const WORLD: Record<string, { stock: number; expired: boolean }> = {
  paracetamol: { stock: 40, expired: false },
  insulin: { stock: 6, expired: false },
  amoxicillin: { stock: 12, expired: true },
  morphine: { stock: 10, expired: false },
};

const ALIASES: Record<string, string> = {
  paracetamol: 'paracetamol', depon: 'paracetamol', panadol: 'paracetamol', acetaminophen: 'paracetamol',
  insulin: 'insulin', amoxicillin: 'amoxicillin', amoxil: 'amoxicillin', morphine: 'morphine',
};

// Layer 2 stand-in: noisy verbs a classifier would learn.
const NOISY_VERBS: Record<string, Parse['intent']> = { gimme: 'administer', hand: 'administer', send: 'administer', bring: 'administer', topup: 'restock', 'top-up': 'restock', order: 'restock', howmany: 'check', left: 'check' };

// Layer 3 stand-in: paraphrases an embedding model would place near an intent.
const SEMANTIC: [RegExp, Parse['intent'], string?][] = [
  [/(pain ?killer|something for (the )?pain|fever reducer)/, 'administer', 'paracetamol'],
  [/(blood sugar|diabet)/, 'administer', 'insulin'],
  [/(running (low|out)|replenish)/, 'restock'],
  [/(do we (still )?have|is there any)/, 'check'],
];

const num = (s: string) => {
  const words: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, ten: 10 };
  const m = s.match(/\b(\d+)\b/);
  if (m) return parseInt(m[1], 10);
  const w = Object.keys(words).find(k => new RegExp(`\\b${k}\\b`).test(s));
  return w ? words[w] : null;
};
const findItem = (s: string) => {
  const k = Object.keys(ALIASES).find(a => s.includes(a));
  return k ? ALIASES[k] : null;
};
const findWard = (s: string) => s.match(/\bward\s*(\d+)\b/)?.[1] ?? null;

export function parse(input: string): Parse {
  const s = input.toLowerCase().trim();
  const base = { qty: num(s), item: findItem(s), ward: findWard(s) };

  const l1 = s.match(/^(give|administer)\s+(\d+|\w+)\s+(\w+)\s+to\s+ward\s*(\d+)$/) || s.match(/^(restock)\s+(\w+)$/) || s.match(/^(check)\s+(\w+)$/);
  if (l1) {
    const verb = l1[1];
    const intent = verb === 'restock' ? 'restock' : verb === 'check' ? 'check' : 'administer';
    return { layer: 1, intent, ...base, note: 'Exact template match' };
  }

  const tokens = s.replace(/how many/g, 'howmany').split(/\s+/);
  const noisy = tokens.map(t => NOISY_VERBS[t]).find(Boolean);
  if (noisy && (base.item || noisy === 'check')) {
    return { layer: 2, intent: noisy, ...base, note: 'Classifier: noisy verb, slots tagged' };
  }

  for (const [re, intent, item] of SEMANTIC) {
    if (re.test(s)) {
      return { layer: 3, intent, ...base, item: base.item ?? item ?? null, note: 'Embedding: nearest intent by meaning' };
    }
  }
  return { layer: null, intent: null, ...base, note: 'No layer is confident' };
}

export function plan(p: Parse): Plan {
  if (!p.intent) return { ok: false, message: 'I didn’t understand. Try “give 2 paracetamol to ward 3”.' };
  if (!p.item) return { ok: false, message: 'Which medication?' };
  const rec = WORLD[p.item];
  if (p.intent === 'check') return { ok: true, message: `${cap(p.item)}: ${rec.stock} in stock${rec.expired ? ', batch expired' : ''}.` };
  if (p.intent === 'restock') return { ok: true, message: `Restock request raised for ${p.item}.` };
  if (rec.expired) return { ok: false, message: `Refused: the ${p.item} batch is past its expiry date.` };
  if (p.qty == null) return { ok: false, message: `How many ${p.item}?` };
  if (!p.ward) return { ok: false, message: 'Which ward?' };
  if (p.qty > rec.stock) return { ok: false, message: `Refused: only ${rec.stock} ${p.item} in stock.` };
  return { ok: true, message: `Dispensed ${p.qty} ${p.item} to ward ${p.ward}. Stock now ${rec.stock - p.qty}.` };
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export const MEDBOT_EXAMPLES = ['give 2 paracetamol to ward 3', 'gimme 4 depon for ward 1', 'something for the pain, 2 for ward 5', 'give 1 amoxicillin to ward 2'];
