import type { Server } from "../../types/server";

const USE_MOCKS = true;

let mockServers: Server[] = [
  {
    id: "mock-1",
    ipAddress: "127.0.0.1:8080",
    name: "Test Server",
    user_key: "mock-user-key-1",
  },
];

export async function getServers(): Promise<Server[]> {
  if (USE_MOCKS) return [...mockServers];
  // real: return invoke("get_servers");
  throw new Error("real backend not wired yet");
}

export async function addServer(args: { nickname: string; ip: string }): Promise<void> {
  if (USE_MOCKS) {
    mockServers.push({
      id: `mock-${Date.now()}`,
      ipAddress: args.ip.trim(),
      name: args.nickname.trim(),
      user_key: `mock-key-${Date.now()}`,
    });
    return;
  }
  // real: return invoke("add_server", { ip: args.ip, nickname: args.nickname });
}

export async function connectServer(ip: string): Promise<void> {
  if (USE_MOCKS) {
    console.log("[mock] connect to", ip);
    return; // pretend it worked → page calls onOpenSessions()
  }
  // real: return invoke("connect_server", { ip });
}

export async function updateServer(ip: string, args: { nickname: string }): Promise<Server> {
  if (USE_MOCKS) {
    const s = mockServers.find((s) => s.ipAddress === ip);
    if (!s) throw new Error("not found");
    s.name = args.nickname;
    return { ...s };
  }
  // real: return invoke("update_server", { ip, nickname: args.nickname });
  throw new Error("real backend not wired yet");
}

export async function removeServer(ip: string): Promise<void> {
  if (USE_MOCKS) {
    mockServers = mockServers.filter((s) => s.ipAddress !== ip);
    return;
  }
  // real: return invoke("remove_server", { ip });
}