import { useEffect, useState, useRef } from "react";
import ServerCard from "../components/ServerCard";
import { updateNickname } from "../services/localServices/NicknameService";
import {
  addServer,
  createServer,
  joinServer,
  getServers,
  removeServer,
  updateServer,
} from "../services/cc/ServerCC";
import type { Server } from "../types/server";

import TitleBar from "../components/TitleBar";
import logoIcon from "../assets/icons/logorgb.png";
import settingsIcon from "../assets/icons/settingbtnicon.svg";
import confirmIcon from "../assets/icons/confirmbtnicon.svg";
import cancelIcon from "../assets/icons/cancelbtnicon.svg";
import arrowUpIcon from "../assets/icons/arrowupicon.svg";

type ServersPageProps = {
  nickname: string;
  onOpenServer: (serverId: string, serverName: string) => void;
  onNicknameChange?: (newNickname: string) => void;
  onOpenSettings?: () => void;
};
type View = "list" | "create" | "generated" | "add";

function ServersPage({ nickname, onOpenServer, onNicknameChange, onOpenSettings }: ServersPageProps) {
  const [servers, setServers] = useState<Server[]>([]);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(nickname);
  const [view, setView] = useState<View>("list");
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);
  const [newServerName, setNewServerName] = useState("");
  const [newServerTicket, setNewServerTicket] = useState("");
  const [error, setError] = useState<string | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getServers().then(setServers);
  }, []);

  const resetForm = () => {
    setNewServerName("");
    setNewServerTicket("");
    setKeyCopied(false);
    setError(null);
  };

  const handleAddServer = async () => {
    if (!newServerTicket.trim()) {
      setError("Server ticket can't be empty.");
      return;
    }
    if (servers.some((s) => s.ticket === newServerTicket.trim())) {
      setError("This server ticket already exists in your list.");
      return;
    }
    setError(null);
    try {
      await addServer({ ticket: newServerTicket });
      const updated = await getServers();
      setServers(updated);
      resetForm();
      setView("list");
    } catch {
      setError("Connection failed: Invalid or inactive link.");
    }
  };

  const handleCreateServer = async () => {
    if (!newServerName.trim()) {
      setError("Server name can't be empty.");
      return;
    }
    if (servers.some((s) => s.name === newServerName.trim())) {
      setError("This server name already exists in your list.");
      return;
    }
    setError(null);
    try {
      const created = await createServer({ nickname: newServerName });
      const updated = await getServers();
      setServers(updated);
      setNewServerTicket(created.ticket);
      setKeyCopied(false);
      setView("generated");
      } catch (e: any) {
      setError("Connection failed: Invalid or inactive link.");
    }
  }

  const handleCopyGeneratedKey = async () => {
    try {
      await navigator.clipboard.writeText(newServerTicket);
      setKeyCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setKeyCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy server ticket:", error);
    }
  };

  const handleCloseGenerated = () => {
    resetForm();
    setView("list");
  };


  const handleConnect = async (ticket: string) => {
    setError(null);
    try {
      await joinServer(ticket);
      const server = servers.find((s) => s.ticket === ticket);
      if (server) onOpenServer(server.id, server.name);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  };

  const handleSaveEdit = async (ticket: string, nickname: string) => {
    const updated = await updateServer(ticket, { nickname });
    setServers((prev) => prev.map((s) => (s.ticket === ticket ? updated : s)));
  };

  const handleCancel = () => {
    resetForm();
    setView("list");
  };

  const handleRemove = async (ticket: string) => {
    setError(null);
    try {
      await removeServer(ticket);
      setServers((prev) => prev.filter((s) => s.ticket !== ticket));
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  };

  const handleOpenCreateServer = () => {
    setShowPlusMenu(false);
    resetForm();
    setView("create");
  };

  const handleOpenAdd = () => {
    setShowPlusMenu(false);
    resetForm();
    setView("add");
  };

  const handleNicknameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleNicknameConfirm();
    if (e.key === "Escape") {
      setNicknameInput(nickname);
      setIsEditingNickname(false);
    }
  };

  const handleNicknameConfirm = async () => {
    const trimmed = nicknameInput.trim();
    if (!trimmed) {
      setError("Invalid nickname.");
      return;
    }
    try {
      await updateNickname(trimmed);
      setError(null);
      setIsEditingNickname(false);
      onNicknameChange?.(trimmed);
    } catch {
      setError("Invalid nickname.");
    }
  };

  const isFormView = view === "create" || view === "add" || view === "generated";

  return (
    <div className="servers-page">
      <TitleBar />
      <aside className="sidebar server-sidebar">
        <h1 className="logo">
          <img src={logoIcon} width="24" height="24" />
          quorthon
        </h1>

        <div className="sidebar-line" />

        {!isFormView && (
          <div className="server-top-row">
            {isEditingNickname ? (
              <div className="nickname-edit-row">
                <input
                  className="server-input nickname-edit-input"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  onKeyDown={handleNicknameKeyDown}
                  autoFocus
                  maxLength={32}
                />
                <button
                  className="nickname-confirm-inline-btn"
                  type="button"
                  onClick={handleNicknameConfirm}
                  title="Confirm nickname"
                >
                  <img src={confirmIcon} width="16" height="16" />
                </button>
              </div>
            ) : (
              <button
                className="server-user-box server-user-box-btn"
                type="button"
                onClick={() => {
                  setNicknameInput(nickname);
                  setIsEditingNickname(true);
                }}
                title="Click to edit nickname"
              >
                Hello {nickname}!
              </button>
            )}

            <div className="server-plus-wrapper">
              {!showPlusMenu ? (
                <button
                  className="server-plus-button"
                  type="button"
                  onClick={() => setShowPlusMenu(true)}
                >
                  +
                </button>
              ) : (
                <div className="server-plus-menu">
                  <button
                    className="server-plus-close"
                    type="button"
                    onClick={() => setShowPlusMenu(false)}
                  >
                      <img src={arrowUpIcon} width="16" height="16" />
                    </button>

                    <button
                      className="server-plus-option"
                      type="button"
                      onClick={handleOpenCreateServer}
                    >
                      create
                    </button>

                  <button
                    className="server-plus-option"
                    type="button"
                    onClick={handleOpenAdd}
                  >
                    add
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="server-content-area">
          {view === "create" && (
            <div className="server-create-overlay">
              <div className="server-create-panels">
                <div className="create-server-box">
                  <div className="create-panel-header">
                    <div className="server-edit-header">
                      <span>Preferred server name</span>
                    </div>
                    <button className="panel-close-btn" type="button" onClick={handleCancel}>
                      <img src={cancelIcon} width="16" height="16" />
                    </button>
                  </div>
                  {error && <p className="error-text-create">{error}</p>}
                  <div className="server-add-row">
                    <input
                      className="server-add-input"
                      value={newServerName}
                      onChange={(e) => setNewServerName(e.target.value)}
                      maxLength={32}
                      autoFocus
                    />
                    <button className="server-add-confirm-btn" type="button" onClick={handleCreateServer}>
                      confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "generated" && (
            <div className="server-create-overlay">
              <div className="generated-server-box">
                <div className="server-edit-header">
                  <span>Generated server ticket</span>
                </div>

                <div className="generated-key-row" style={{ position: "relative" }}>
                  <button
                    className="generated-key-text generated-key-btn"
                    type="button"
                    onClick={handleCopyGeneratedKey}
                    title="Click to copy server ticket"
                  >
                    {newServerTicket}
                  </button>

                  {keyCopied && (
                    <div className="copy-toast">
                      server ticket copied!
                    </div>
                  )}
                </div>

                <button
                  className="big-confirm-btn"
                  type="button"
                  onClick={handleCloseGenerated}
                >
                  close
                </button>
              </div>
            </div>
          )}

          {view === "add" && (
            <div className="server-create-overlay">
              <div className="server-create-panels">
                <div className="create-server-box">
                  <div className="create-panel-header">
                    <div className="server-edit-header">
                      <span>Server ticket</span>
                    </div>
                    <button className="panel-close-btn" type="button" onClick={handleCancel}>
                      <img src={cancelIcon} width="16" height="16" />
                    </button>
                  </div>
                  {error && <p className="error-text-create">{error}</p>}
                  <div className="server-add-row">
                    <input
                      className="server-add-input"
                      value={newServerTicket}
                      onChange={(e) => setNewServerTicket(e.target.value)}
                      autoFocus
                    />
                    <button className="server-add-confirm-btn" type="button" onClick={handleAddServer}>
                      confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "list" && error && <p className="error-text">{error}</p>}
          <div
            className={`server-list-container ${
              view !== "list" ? "server-list-hidden" : ""
            }`}
          >
            {servers.map((server) => (
              <ServerCard
                key={server.id}
                server={server}
                existingNames={servers.map((s) => s.name)}
                onSaveEdit={handleSaveEdit}
                onRemove={handleRemove}
                onConnect={handleConnect}
              />
            ))}
          </div>
        </div>

        <div className="sidebar-line bottom-line" />

        <div className="server-bottom-row">
          <div className="left-bottom-buttons">
            <div className="help-popup-wrapper">
              <button
                className="tiny-square-btn"
                type="button"
                onClick={() => setShowHelpPopup((prev) => !prev)}
              >
                ?
              </button>

              {showHelpPopup && (
                <div
                  className="help-popup"
                  onClick={() => setShowHelpPopup(false)}
                >
                  <div className="help-popup-content">
                    <p>In this page you can:</p>
                    <p>•  add / remove servers</p>
                    <p>• change your nickname</p>
                    <span className="help-popup-close-text">click to close</span>
                  </div>
                </div>
              )}
            </div>

            <button className="settings-btn" type="button" onClick={() => onOpenSettings?.()}>
              <img src={settingsIcon} width="16" height="16" />
            </button>
          </div>

          <p className="version-text">ver. 0.69</p>
        </div>
      </aside>
    </div>
  );
}

export default ServersPage;