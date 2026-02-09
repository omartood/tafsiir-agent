const KEY = "tafsiir_chat_history";
const MAX_CONVERSATIONS = 50;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

function genId(): string {
  return `c_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function getConversations(): ChatConversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function getConversation(id: string): ChatConversation | null {
  const list = getConversations();
  return list.find((c) => c.id === id) ?? null;
}

function saveConversations(list: ChatConversation[]): void {
  try {
    const sorted = [...list].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_CONVERSATIONS);
    localStorage.setItem(KEY, JSON.stringify(sorted));
  } catch {}
}

export function addConversation(conv: Omit<ChatConversation, "id" | "updatedAt">): ChatConversation {
  const list = getConversations();
  const newConv: ChatConversation = {
    ...conv,
    id: genId(),
    updatedAt: Date.now(),
  };
  list.unshift(newConv);
  saveConversations(list);
  return newConv;
}

export function updateConversation(
  id: string,
  updates: Partial<Pick<ChatConversation, "title" | "messages">>
): void {
  const list = getConversations();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return;
  list[idx] = { ...list[idx], ...updates, updatedAt: Date.now() };
  saveConversations(list);
}

export function deleteConversation(id: string): void {
  saveConversations(getConversations().filter((c) => c.id !== id));
}

export function createTitleFromFirstMessage(content: string, maxLen = 40): string {
  const trimmed = content.trim();
  if (!trimmed) return "Su'aal cusub";
  return trimmed.length <= maxLen ? trimmed : trimmed.slice(0, maxLen) + "…";
}
