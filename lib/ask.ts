import { FACTS, ABSTAIN_TOPICS } from '../constants';
import type { Fact } from '../types';

export type AskResult =
  | { kind: 'answer'; fact: Fact }
  | { kind: 'abstain'; reason: string }
  | { kind: 'clarify'; options: Fact[] };

const tokenize = (q: string) =>
  q.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9-]+/).filter(Boolean);

const STOP = new Set(['does', 'did', 'is', 'are', 'can', 'he', 'his', 'him', 'the', 'a', 'an', 'of', 'to', 'in', 'with', 'and', 'or', 'for', 'on', 'any', 'have', 'has', 'you', 'me', 'i', 'it', 'about']);

// Same shape as Sophie's public boundary: matching picks an approved fact, it never writes one.
export function ask(question: string): AskResult {
  const tokens = tokenize(question).filter(t => !STOP.has(t) || t === 'who' || t === 'what');
  if (tokens.length === 0) return { kind: 'abstain', reason: 'Ask a question about Panos or his work.' };

  if (tokens.some(t => ABSTAIN_TOPICS.includes(t))) {
    return { kind: 'abstain', reason: 'Nothing approved on file for that. Ask him directly: pangegeorg@gmail.com' };
  }

  const scored = FACTS.map(fact => ({
    fact,
    score: tokens.reduce((s, t) => s + (fact.keywords.includes(t) ? (t.length > 3 ? 2 : 1) : 0), 0),
  }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return { kind: 'abstain', reason: 'No approved fact matches that question, so the file won’t guess.' };
  }
  if (scored.length > 1 && scored[0].score === scored[1].score && scored[0].score < 3) {
    return { kind: 'clarify', options: scored.slice(0, 3).map(x => x.fact) };
  }
  return { kind: 'answer', fact: scored[0].fact };
}

export const SUGGESTIONS = ['Is he available?', 'Has he built RAG?', 'Biggest project?', 'What’s his salary?'];
