"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_ITEMS } from "../constants";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-lg h-full p-4 hidden md:block">
      <h2 className="text-2xl font-grotesk font-bold text-pink-600 text-center mb-6">
        Smart Todo
        </h2>
      <nav className="space-y-1">
        {SIDEBAR_ITEMS.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-sans font-semibold transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              {name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
