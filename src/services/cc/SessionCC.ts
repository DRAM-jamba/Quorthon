import type { Session } from "../../types/session";

const USE_MOCKS = true;

let mockSessions: Session[] = [
  {
    id: "sess-1",
    name: "general",
    lastConnected: "2026-07-24",
    userRole: "admin",
  },
  {
    id: "sess-2",
    name: "dev-talk",
    lastConnected: "2026-07-23",
    userRole: "user",
  },
];

export async function getSessions(): Promise<Session[]> {
  if (USE_MOCKS) return [...mockSessions];
  // real: return invoke("get_sessions");
  throw new Error("real backend not wired yet");
}

// Page expects: { session: Session, generatedKey: string }
export async function createSession(args: {
  sessionName: string;
  sessionKey: string;
}): Promise<{ session: Session; generatedKey: string }> {
  if (USE_MOCKS) {
    const session: Session = {
      id: `sess-${Date.now()}`,
      name: args.sessionName.trim(),
      lastConnected: new Date().toISOString().slice(0, 10),
      userRole: "admin", // creator is admin
    };
    mockSessions.push(session);
    // fake ticket string — later this is the real iroh ticket the host returns
    const generatedKey = `mock-ticket-${Math.random().toString(36).slice(2, 10)}`;
    return { session, generatedKey };
  }
  // real: return invoke("create_session", { sessionName: args.sessionName });
  throw new Error("real backend not wired yet");
}

export async function addSession(args: { sessionKey: string }): Promise<void> {
  if (USE_MOCKS) {
    mockSessions.push({
      id: `sess-${Date.now()}`,
      name: `joined-${args.sessionKey.slice(0, 6)}`,
      lastConnected: new Date().toISOString().slice(0, 10),
      userRole: "user",
    });
    return;
  }
  // real: return invoke("add_session", { sessionKey: args.sessionKey });
}

export async function updateSession(
  id: string,
  args: { name: string }
): Promise<Session> {
  if (USE_MOCKS) {
    const s = mockSessions.find((s) => s.id === id);
    if (!s) throw new Error("not found");
    s.name = args.name;
    return { ...s };
  }
  // real: return invoke("update_session", { id, name: args.name });
  throw new Error("real backend not wired yet");
}

export async function forgetSession(sessionKey: string): Promise<void> {
  if (USE_MOCKS) {
    mockSessions = mockSessions.filter((s) => s.id !== sessionKey);
    return;
  }
  // real: return invoke("forget_session", { sessionKey });
}

export async function deleteSession(sessionKey: string): Promise<void> {
  if (USE_MOCKS) {
    mockSessions = mockSessions.filter((s) => s.id !== sessionKey);
    return;
  }
  // real: return invoke("delete_session", { sessionKey });
}

export async function disconnectFromServer(): Promise<void> {
  if (USE_MOCKS) {
    console.log("[mock] disconnect from server");
    return;
  }
  // real: return invoke("disconnect_from_server");
}

export async function joinSession(sessionKey: string): Promise<void> {
  if (USE_MOCKS) { console.log("[mock] join session", sessionKey); return; }
  // real: return invoke("join_session", { sessionKey });
}