import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";

export async function resizeForChatPage(): Promise<void> {
  await getCurrentWindow().setSize(new LogicalSize(1100, 750));
}

export async function resizeForServersPage(): Promise<void> {
  await getCurrentWindow().setSize(new LogicalSize(360, 628));
}