
export function saveMicHotkey(key: string | null): void {
  if (key === null) localStorage.removeItem("micHotkey");
  else localStorage.setItem("micHotkey", key);
}
export function loadMicHotkey(): string | null {
  return localStorage.getItem("micHotkey");
}

export function saveHeadphonesHotkey(key: string | null): void {
  if (key === null) localStorage.removeItem("headphonesHotkey");
  else localStorage.setItem("headphonesHotkey", key);
}
export function loadHeadphonesHotkey(): string | null {
  return localStorage.getItem("headphonesHotkey");
}

// Builds a string like "Ctrl+Shift+M" from a keyboard event
export function getHotkeyString(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.ctrlKey) parts.push("Ctrl");
  if (e.shiftKey) parts.push("Shift");
  if (e.altKey) parts.push("Alt");
  const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
  if (!["Control", "Shift", "Alt"].includes(key)) parts.push(key);
  return parts.join("+");
}