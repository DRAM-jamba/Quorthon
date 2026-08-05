import { useEffect, useState } from "react";
import ServerCard from "../components/ServerCard";
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

type ServersPageProps = {
  onOpenSessions?: () => void;
};

function ServersPage({ onOpenSessions }: ServersPageProps) {
  const [servers, setServers] = useState<Server[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddOrCreateForm, setShowAddOrCreateForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newServerName, setNewServerName] = useState("");
  const [newServerTicket, setNewServerTicket] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getServers().then(setServers);
  }, []);


  const handleAddServer = async () => {
    if (!newServerName.trim() && !newServerTicket.trim()) {
      setError("Server Name and Ticket can't be empty.");
      return;
    }
    if (!newServerName.trim()) {
      setError("Server Name can't be empty.");
      return;
    }
    if (!newServerTicket.trim()) {
      setError("Server Ticket can't be empty.");
      return;
    }
    if (servers.some((s) => s.ticket === newServerTicket.trim())) {
      setError("This server ticket already exists in your list.");
      return;
    }
    if (servers.some((s) => s.name === newServerName.trim())) {
      setError("This server name already exists in your list.");
      return;
    }
    setError(null);
    try {
      await addServer({ nickname: newServerName, ticket: newServerTicket });
      const updated = await getServers();
      setServers(updated);
      setNewServerName("");
      setNewServerTicket("");
      setShowAddForm(false);
    } catch (e: any) {
      setError("Connection failed: Invalid or inactive link.");
    }
  };

  const handleCreateServer = async () => {
    if (!newServerName.trim()) {
      setError("Server Name can't be empty.");
      return;
    }
    if (servers.some((s) => s.name === newServerName.trim())) {
      setError("This server Name already exists in your list.");
      return;
    }
    setError(null);
    try {
      await createServer({ nickname: newServerName});
      const updated = await getServers();
      setServers(updated);
      setNewServerName("");
      setShowCreateForm(false);
      } catch (e: any) {
      setError("Connection failed: Invalid or inactive link.");
    }
  }

  const handleConnect = async (ticket: string) => {
    setError(null);
    try {
      await joinServer(ticket);
      onOpenSessions?.();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
  };

  const handleSaveEdit = async (ticket: string, nickname: string) => {
    const updated = await updateServer(ticket, { nickname });
    setServers((prev) =>
      prev.map((s) => (s.ticket === ticket ? updated : s))
    );
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

  return (
    <div className="servers-page">
      <TitleBar />
      <aside className="sidebar">
        <h1 className="logo">
          <img src={logoIcon} width="24" height="24" />
          quorthon
        </h1>

        <div className="sidebar-line" />

        <div className="server-list-container">
          {servers.length === 0 ? (
            <p className="empty-list-text" style={{ textAlign: "center" }}>
              Your server list is empty
            </p>
          ) : (
            servers.map((server) => (
              <ServerCard
                key={server.id}
                server={server}
                onSaveEdit={handleSaveEdit}
                onRemove={handleRemove}
                onConnect={handleConnect}
              />
            ))
          )}
        </div>

        <p className="trusted-text">Connect only to trusted servers</p>

        {error && <p className="error-text">{error}</p>}

        {!showAddOrCreateForm ? (
          <button
            className="plus-button"
            type="button"
            onClick={() => setShowAddOrCreateForm(true)}
          >
            +
          </button>
        ) : !showAddForm && !showCreateForm ? (
          <div className="add-server-box">
            <div className="add-server-actions add-server-actions--stacked">
              <button
                className="settings-option-btn"
                type="button"
                onClick={() => setShowAddForm(true)}
              >
                add an existing server
              </button>

              <button
                className="settings-option-btn"
                type="button"
                onClick={() => setShowCreateForm(true)}
              >
                create a new server
              </button>

              <button
                className="settings-option-btn"
                type="button"
                onClick={() => setShowAddOrCreateForm(false)}
              >
                back
              </button>
            </div>
          </div>
        ) : showCreateForm ? (
          <div className="add-server-box">
            <label className="input-label">Preferred server name</label>
            <input
              className="server-input"
              value={newServerName}
              onChange={(e) => setNewServerName(e.target.value)}
            />

            <div className="add-server-actions">
              <button
                className="cancel-btn"
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewServerName("");
                  setError(null);
                }}
              >
                back
              </button>

              <button
                className="big-confirm-btn"
                type="button"
                onClick={handleCreateServer}
              >
                confirm
              </button>
            </div>
          </div>
        ) : (
          <div className="add-server-box">
            <label className="input-label">Preferred server name</label>
            <input
              className="server-input"
              value={newServerName}
              onChange={(e) => setNewServerName(e.target.value)}
            />

            <label className="input-label">Ticket</label>
            <input
              className="server-input"
              value={newServerTicket}
              onChange={(e) => setNewServerTicket(e.target.value)}
            />

            <div className="add-server-actions">
              <button
                className="cancel-btn"
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewServerName("");
                  setNewServerTicket("");
                  setError(null);
                }}
              >
                back
              </button>

              <button
                className="big-confirm-btn"
                type="button"
                onClick={handleAddServer}
              >
                confirm
              </button>
            </div>
          </div>
        )}

        <div className="sidebar-line bottom-line" />
        <p className="version-text">ver. 0.69</p>
      </aside>
    </div>
  );
}

export default ServersPage;