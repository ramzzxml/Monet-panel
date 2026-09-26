"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Script = { id: string; scriptId: string; name: string; version: number; updatedAt: string; _count: { keys: number } };

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>([]);

  useEffect(() => { fetch("/api/scripts").then((r) => r.json()).then(setScripts); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-indigo-400 uppercase tracking-widest">Control Script</p>
          <h1 className="text-2xl font-bold text-white">Script Library</h1>
          <p className="text-sm text-muted mt-0.5">Pilih script untuk membuka kontrol penuh satu layar.</p>
        </div>
        <Link href="/create-script" className="bg-accent hover:bg-accent-dark text-white text-sm px-4 py-2 rounded-lg transition-colors">
          + New Script
        </Link>
      </div>

      <div className="space-y-3">
        {scripts.map((s) => (
          <div key={s.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white font-medium">{s.name}</p>
                <p className="text-xs text-accent font-mono mt-0.5">{s.scriptId}</p>
              </div>
              <span className="text-xs bg-white/10 text-muted px-2 py-0.5 rounded-full">v{s.version}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-bg rounded-lg p-3">
                <p className="text-xs text-muted">KEYS</p>
                <p className="text-lg font-bold text-white">{s._count.keys}</p>
              </div>
              <div className="bg-bg rounded-lg p-3">
                <p className="text-xs text-muted">UPDATED</p>
                <p className="text-xs text-white mt-1">{new Date(s.updatedAt).toLocaleString("id-ID")}</p>
              </div>
            </div>
          </div>
        ))}
        {scripts.length === 0 && <p className="text-muted text-sm">Belum ada script.</p>}
      </div>
    </div>
  );
}
