const USE_MOCKS = true;

// --- persisted settings (real localStorage, no host needed) ---
export function saveMicDevice(id: string): void { localStorage.setItem("micDevice", id); }
export function loadMicDevice(): string { return localStorage.getItem("micDevice") ?? "default"; }

export function saveMicLevel(v: number): void { localStorage.setItem("micLevel", String(v)); }
export function loadMicLevel(): number { return Number(localStorage.getItem("micLevel") ?? 100); }

export function saveSpeakerDevice(id: string): void { localStorage.setItem("speakerDevice", id); }
export function loadSpeakerDevice(): string { return localStorage.getItem("speakerDevice") ?? "default"; }

export function saveSpeakerLevel(v: number): void { localStorage.setItem("speakerLevel", String(v)); }
export function loadSpeakerLevel(): number { return Number(localStorage.getItem("speakerLevel") ?? 100); }

export function loadNoiseSuppression(): boolean { return localStorage.getItem("rnnoise") === "true"; }
export function setUseRnnoise(on: boolean): void { localStorage.setItem("rnnoise", String(on)); }

// --- live audio hardware actions: stubbed until the real voice pipeline exists ---
export function updateMicLevel(v: number): void {
  if (USE_MOCKS) { console.log("[mock] mic level ->", v); return; }
}
export function updateSpeakerLevel(v: number): void {
  if (USE_MOCKS) { console.log("[mock] speaker level ->", v); return; }
}
export function updateSpeakerDevice(id: string): void {
  if (USE_MOCKS) { console.log("[mock] speaker device ->", id); return; }
}
export function isInVoiceChat(): boolean {
  if (USE_MOCKS) return false; // never "in a call" while mocking → reconnectMic never fires
  return false;
}
export function reconnectMic(): void {
  if (USE_MOCKS) { console.log("[mock] reconnect mic"); return; }
}

export async function setMicMuted(muted: boolean): Promise<void> {
  if (USE_MOCKS) { console.log("[mock] mic muted:", muted); return; }
}
export async function setDeafened(deafened: boolean): Promise<void> {
  if (USE_MOCKS) { console.log("[mock] deafened:", deafened); return; }
}
export function setParticipantVolume(username: string, volume: number): void {
  if (USE_MOCKS) { console.log("[mock] volume", username, volume); return; }
}
export async function subscribeToVoiceList(
  onList: (members: string[]) => void
): Promise<() => void> {
  if (USE_MOCKS) {
    onList([]); // nobody in voice while mocking
    return () => {};
  }
  return () => {};
}