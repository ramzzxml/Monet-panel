"use client";
import { useEffect, useState } from "react";

type Log = { id: string; action: string; detail: string | null; createdAt: string; admin: { username: string; role: string } };

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);

  function load() { fetch("/api/logs").then((r) => r.json()).then(setLogs); }
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-indigo-400 uppercase tracking-widest">Audit Trail</p>
          <h1 className="text-2xl font-bold text-white">Logs Admin</h1>
          <p className="text-sm text-muted mt-0.5">Semua aksi admin: create key, create/update/delete script, access, dan perubahan lainnya.</p>
        </div>
        <button onClick={load} className="text-sm border border-border text-muted hover:text-white px-3 py-1.5 rounded-lg transition-colors">
          ↻ Refresh
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs text-muted px-4 py-3">WAKTU</th>
              <th className="text-left text-xs text-muted px-4 py-3">ADMIN</th>
              <th className="text-left text-xs text-muted px-4 py-3">ROLE</th>
              <th className="text-left text-xs text-muted px-4 py-3">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-border/50 hover:bg-white/5">
                <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{new Date(log.createdAt).toLocaleString("id-ID")}</td>
                <td className="px-4 py-3 text-white font-medium">{log.admin.username}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${log.admin.role === "OWNER" ? "bg-owner/20 text-owner" : "bg-accent/20 text-accent"}`}>
                    {log.admin.role.toLowerCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted">{log.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <p className="text-muted text-sm p-4">Belum ada log.</p>}
      </div>
    </div>
  );
}
