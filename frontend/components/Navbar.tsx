'use client';
import Link from "next/link";
import React from "react";
import { NAV_LINKS } from "../constants";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname()
  const TITLE = pathname === '/tasks' ? 'Tasks' : 'Context';

  return (
    <nav className="bg-white">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">{TITLE}</h1>
        <ul className="flex space-x-4">
          {NAV_LINKS.map((link) => (
            <li key={link.name}>
              <Link href={link.path}>{link.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
