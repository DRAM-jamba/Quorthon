const USE_MOCKS = true;

// --- HOST-facing: tell the host your nickname so other members see it ---
export async function submitNickname(nickname: string): Promise<void> {
  if (USE_MOCKS) {
    console.log("[mock] submit nickname to host:", nickname);
    return;
  }
  // real: return invoke("set_nickname", { nickname });
}

// updateNickname is the same host-facing action, used by SessionsPage's edit flow.
// Alias it to submitNickname so there's one source of truth.
export async function updateNickname(nickname: string): Promise<void> {
  return submitNickname(nickname);
}

// --- LOCAL: persist the nickname on this machine ---
export async function saveNickname(nickname: string): Promise<void> {
  localStorage.setItem("nickname", nickname);
}

export async function getSavedNickname(): Promise<string | null> {
  return localStorage.getItem("nickname");
}