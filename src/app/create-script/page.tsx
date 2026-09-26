"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateScriptPage() {
  const [scriptId, setScriptId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/scripts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scriptId, name, code }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    router.push("/scripts");
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCode(ev.target?.result as string);
    reader.readAsText(file);
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <p className="text-xs text-indigo-400 uppercase tracking-widest">Control Script</p>
        <h1 className="text-2xl font-bold text-white">Create Script</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="ID script, contoh: wallhack"
          value={scriptId}
          onChange={(e) => setScriptId(e.target.value)}
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-accent"
          required
        />
        <input
          placeholder="Nama script"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-accent"
          required
        />
        <label className="flex flex-col items-center justify-center w-full border border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-accent transition-colors">
          <span className="text-sm text-white">Pilih File</span>
          <span className="text-xs text-muted mt-1">Klik untuk upload .lua · isi otomatis ke editor</span>
          <input type="file" accept=".lua,.txt" className="hidden" onChange={handleFile} />
        </label>
        <textarea
          placeholder="-- kode Lua di sini"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-accent font-mono resize-none"
          rows={12}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent-dark text-white rounded-xl py-3 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "+ Create Script"}
        </button>
      </form>
    </div>
  );
}
