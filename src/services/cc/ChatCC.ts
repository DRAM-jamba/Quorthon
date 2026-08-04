import type { Message, Member } from "../../types/message";

const USE_MOCKS = true;

// Hold the callbacks the page hands us, so we can push data back later.
let messageCallback: ((msg: Message) => void) | null = null;
let memberEventCallback: ((msg: Message) => void) | null = null;
let membersCallback: ((members: Member[]) => void) | null = null;

let friendTimer: ReturnType<typeof setInterval> | null = null;

// --- messages ---
export async function subscribeToMessages(cb: (msg: Message) => void): Promise<() => void> {
  if (USE_MOCKS) {
    messageCallback = cb;
    return () => { messageCallback = null; };
  }
  // real: return listen("message_received", e => cb(e.payload)).then(...)
  return () => {};
}

export async function sendMessage(content: string): Promise<void> {
  if (USE_MOCKS) {
    // echo our own message back so it appears in the list
    messageCallback?.({
      authorUsername: "me",
      content,
      timestamp: new Date().toLocaleTimeString(),
      date: new Date().toISOString().slice(0, 10),
      id: `msg-${Date.now()}-${Math.random()}`,
    });
    return;
  }
  // real: return invoke("send_message", { content });
}

// --- member list updates ---
export async function subscribeToMemberUpdates(cb: (members: Member[]) => void): Promise<() => void> {
  if (USE_MOCKS) {
    membersCallback = cb;
    // push a starting member list shortly after subscribing
    setTimeout(() => cb([{ username: "me" }, { username: "friend_bob" }]), 300);
    return () => { membersCallback = null; };
  }
  // real: return listen("members_updated", e => cb(e.payload)).then(...)
  return () => {};
}

// --- member join/leave events (these arrive as system messages) ---
export async function subscribeToMemberEvents(cb: (msg: Message) => void): Promise<() => void> {
  if (USE_MOCKS) {
    memberEventCallback = cb;
    return () => { memberEventCallback = null; };
  }
  // real: return listen("member_event", e => cb(e.payload)).then(...)
  return () => {};
}

// --- session join/leave ---
export async function joinSession(sessionKey: string): Promise<void> {
  if (USE_MOCKS) {
    console.log("[mock] joinSession", sessionKey);
    // system message: you joined
    setTimeout(() => memberEventCallback?.({
      authorUsername: "system",
      content: "friend_bob joined the session",
      timestamp: new Date().toLocaleTimeString(),
      date: new Date().toISOString().slice(0, 10),
      id: `sys-${Date.now()}`,
      system: true,
    }), 600);

    // a fake friend sends a message every 8s so the chat feels live
    friendTimer = setInterval(() => {
      messageCallback?.({
        authorUsername: "friend_bob",
        content: "yo, this is a mock message",
        timestamp: new Date().toLocaleTimeString(),
        date: new Date().toISOString().slice(0, 10),
        id: `msg-${Date.now()}-${Math.random()}`,
      });
    }, 8000);
    return;
  }
  // real: return invoke("join_session", { sessionKey });
}

export async function leaveSession(): Promise<void> {
  if (USE_MOCKS) {
    if (friendTimer) { clearInterval(friendTimer); friendTimer = null; }
    console.log("[mock] leaveSession");
    return;
  }
  // real: return invoke("leave_session");
}

// --- voice join/leave (host-side: joining the voice channel) ---
export async function joinVoiceChat(sessionKey: string): Promise<void> {
  if (USE_MOCKS) { console.log("[mock] joinVoiceChat", sessionKey); return; }
  // real: return invoke("join_voice", { sessionKey });
}

export async function leaveVoiceChat(): Promise<void> {
  if (USE_MOCKS) { console.log("[mock] leaveVoiceChat"); return; }
  // real: return invoke("leave_voice");
}