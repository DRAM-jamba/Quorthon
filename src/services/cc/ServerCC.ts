import type { Server } from "../../types/server";

const USE_MOCKS = true;

let mockServers: Server[] = [
  {
    id: "mock-1",
    ticket: "127.0.0.1:8080",
    name: "Test Server",
    user_key: "mock-user-key-1",
  },
];

export async function getServers(): Promise<Server[]> {
  if (USE_MOCKS) return [...mockServers];
  // real: return invoke("get_servers");
  throw new Error("real backend not wired yet");
}

export async function addServer(args: { ticket: string }): Promise<void> {
  if (USE_MOCKS) {
    mockServers.push({
      id: `mock-${Date.now()}`,
      ticket: args.ticket.trim(),
      name: `server-${args.ticket.trim().slice(0, 6)}`,  // fake "fetched" name for now
      user_key: `mock-key-${Date.now()}`,
    });
    return;
  }
  // real: return invoke("add_server", { ticket: args.ticket });
  throw new Error("real backend not wired yet");
}

export async function createServer(args: { nickname: string }): Promise<Server> {
  if (USE_MOCKS) {
    const server: Server = {
      id: `mock-${Date.now()}`,
      ticket: `mock-ticket-${Date.now()}`,
      name: args.nickname.trim(),
      user_key: `mock-key-${Date.now()}`,
    };
    mockServers.push(server);
    return server;
  }
  throw new Error("real backend not wired yet");
  // real: return invoke("create_server", { nickname: args.nickname });
}

export async function joinServer(ticket: string): Promise<void> {
  if (USE_MOCKS) {
    console.log("[mock] connect to", ticket);
    return; // pretend it worked → page calls onOpenSessions()
  }
  // real: return invoke("connect_server", { ticket });
}

export async function updateServer(ticket: string, args: { nickname: string }): Promise<Server> {
  if (USE_MOCKS) {
    const s = mockServers.find((s) => s.ticket === ticket);
    if (!s) throw new Error("not found");
    s.name = args.nickname;
    return { ...s };
  }
  // real: return invoke("update_server", { ticket, nickname: args.nickname });
  throw new Error("real backend not wired yet");
}

export async function removeServer(ticket: string): Promise<void> {
  if (USE_MOCKS) {
    mockServers = mockServers.filter((s) => s.ticket !== ticket);
    return;
  }
  // real: return invoke("remove_server", { ticket });
}