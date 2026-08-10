import { useState, useEffect } from "react";
import ServersPage from "./pages/ServersPage";
import NicknamePage from "./pages/NicknamePage";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import { getSavedNickname } from "./services/localServices/NicknameService";
import { loadTheme, loadFont } from "./services/localServices/AppearanceService";
import "./App.css";

type Page =
  | { name: "loading" }
  | { name: "nickname" }
  | { name: "servers"; nickname: string }
  | { name: "chat"; serverId: string; serverName: string; nickname: string }
  | { name: "settings"; nickname: string };

document.documentElement.setAttribute("data-theme", loadTheme());
document.documentElement.setAttribute("data-font", loadFont());

function App() {
  const [page, setPage] = useState<Page>({ name: "loading" });

  useEffect(() => {
    getSavedNickname().then((saved) => {
      setPage(saved ? { name: "servers", nickname: saved } : { name: "nickname" });
    });
  }, []);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => stream.getTracks().forEach((track) => track.stop()))
      .catch(async () => {
        const { invoke } = await import("@tauri-apps/api/core");
        await invoke("reset_mic_permission").catch(() => {});
      });
  }, []);

  useEffect(() => {
    const disableContext = (e: MouseEvent) => e.preventDefault();
    const disableShortcuts = (e: KeyboardEvent) => {
      if (
        e.key === "F5" || e.key === "F7" || e.key === "F3" ||
        (e.ctrlKey && e.key === "r") ||
        (e.ctrlKey && e.shiftKey && e.key === "R") ||
        (e.ctrlKey && e.key === "p") ||
        (e.ctrlKey && e.key === "s") ||
        (e.ctrlKey && e.key === "u") ||
        (e.ctrlKey && e.key === "f")
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", disableContext);
    document.addEventListener("keydown", disableShortcuts);
    return () => {
      document.removeEventListener("contextmenu", disableContext);
      document.removeEventListener("keydown", disableShortcuts);
    };
  }, []);

  // ── render: page routing lives here, at the top level ──
  if (page.name === "loading") {
    return null;
  }

  if (page.name === "nickname") {
    return <NicknamePage onNicknameSet={(nickname) => setPage({ name: "servers", nickname })} />;
  }

  if (page.name === "chat") {
    return (
      <ChatPage
        sessionName={page.serverName}
        sessionKey={page.serverId}
        nickname={page.nickname}
        onLeaveSession={() => setPage({ name: "servers", nickname: page.nickname })}
      />
    );
  }

  if (page.name === "settings") {
    return <SettingsPage onBack={() => setPage({ name: "servers", nickname: page.nickname })} />;
  }

  return (
    <ServersPage
      nickname={page.nickname}
      onOpenServer={(serverId, serverName) =>
        setPage({ name: "chat", serverId, serverName, nickname: page.nickname })
      }
      onNicknameChange={(newNickname) => setPage({ name: "servers", nickname: newNickname })}
      onOpenSettings={() => setPage({ name: "settings", nickname: page.nickname })}
    />
  );
}

export default App;