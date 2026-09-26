"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Stats = {
  scripts: number;
  keys: number;
  activeKeys: number;
  bannedKeys: number;
  downloads: number;
  uniqueDevices: number;
  trend: { day: string; count: number }[];
};

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-owner mt-0.5">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats);
  }, []);

  if (!stats) return <div className="text-muted text-sm">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-indigo-400 uppercase tracking-widest">Mission Control</p>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-sm text-muted mt-0.5">Realtime statistik key, pengguna, script, dan aktivitas sistem.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Scripts" value={stats.scripts} sub="Live script terdaftar" />
        <StatCard label="Total Keys" value={stats.keys} sub={`${stats.activeKeys} active · ${stats.bannedKeys} banned`} />
        <StatCard label="Total Pengguna" value={stats.uniqueDevices} sub="Unique devices terdaftar" />
        <StatCard label="Download Success" value={stats.downloads} sub="↑ Naik vs periode sebelumnya" />
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-sm font-medium text-white mb-1">Script Usage Trend</p>
        <p className="text-xs text-muted mb-4">Successful downloads · 30 hari</p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={stats.trend}>
            <XAxis dataKey="day" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, fontSize: 12 }}
              labelFormatter={(v) => new Date(v).toLocaleDateString("id-ID")}
            />
            <Line type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
