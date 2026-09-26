"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "⬡" },
  { href: "/scripts", label: "Control Script", icon: "⬡" },
  { href: "/logs", label: "Logs Admin", icon: "⬡" },
  { href: "/create-script", label: "Create Script", icon: "+" },
  { href: "/access", label: "Create Access", icon: "⬡" },
];

export default function Sidebar({ username, role }: { username: string; role: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="flex flex-col h-full p-4 gap-1">
      <div className="mb-4 px-2">
        <p className="text-xs text-indigo-400 uppercase tracking-widest">Admin Console</p>
        <h2 className="text-lg font-bold text-white">Porzz Control</h2>
      </div>

      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
            pathname === item.href
              ? "bg-accent/20 text-accent"
              : "text-muted hover:text-white hover:bg-white/5"
          }`}
        >
          <span className="text-base">{item.icon}</span>
          {item.label}
        </Link>
      ))}

      <div className="mt-auto border-t border-border pt-3">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-danger hover:bg-danger/10 transition-colors"
        >
          ⬡ Logout
        </button>
        <div className="flex items-center gap-2 px-3 py-2 mt-1">
          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent uppercase">
            {username[0]}
          </div>
          <div>
            <p className="text-xs text-white font-medium">{username}</p>
            <p className="text-xs text-muted uppercase">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
