"use client";
import { useEffect, useState } from "react";

type Admin = { id: string; username: string; role: string; createdAt: string };

export default function AccessPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const r = await fetch("/api/access");
    if (r.ok) setAdmins(await r.json());
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    setUsername(""); setPassword(""); setLoading(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus akun ini?")) return;
    await fetch(`/api/access/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <p className="text-xs text-indigo-400 uppercase tracking-widest">Owner Control</p>
        <h1 className="text-2xl font-bold text-white">Create Access</h1>
        <p className="text-sm text-muted mt-0.5">Buat akun admin baru. Menu ini dikunci untuk owner.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white">Create Admin Account</p>
          <span className="text-xs bg-owner/20 text-owner px-2 py-0.5 rounded">OWNER</span>
        </div>
        <form onSubmit={handleCreate} className="space-y-3">
          <input
            placeholder="username admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-muted focus:outline-none focus:border-accent"
            required
          />
          <input
            type="password"
            placeholder="password min. 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-muted focus:outline-none focus:border-accent"
            required minLength={6}
          />
          {error && <p className="text-xs text-danger">{error}</p>}
          <button type="submit" disabled={loading} className="bg-accent hover:bg-accent-dark text-white text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
            {loading ? "Creating..." : "+ Create Access"}
          </button>
        </form>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-white">Admin Accounts</p>
          <span className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs text-white">{admins.length}</span>
        </div>
        <div className="space-y-3">
          {admins.map((a) => (
            <div key={a.id} className="border border-border rounded-lg p-3">
              <p className="text-sm font-medium text-white">{a.username}</p>
              <p className="text-xs text-muted">{a.role.toLowerCase()} · {new Date(a.createdAt).toLocaleString("id-ID")}</p>
              {a.role === "OWNER" ? (
                <div className="mt-2 bg-owner/10 border border-owner/30 rounded px-3 py-1.5">
                  <span className="text-xs text-owner font-medium">OWNER</span>
                </div>
              ) : (
                <button
                  onClick={() => handleDelete(a.id)}
                  className="mt-2 w-full bg-danger/10 hover:bg-danger/20 border border-danger/30 text-danger text-sm rounded px-3 py-1.5 transition-colors"
                >
                  Hapus
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
