import {
  Home,
  ListChecks,
  FileText,
} from "lucide-react";
import { JetBrains_Mono } from "next/font/google";

export const NAV_LINKS = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Tasks",
    path: "/tasks",
  }
]

export const SIDEBAR_ITEMS = [
  {
    name: "Tasks",
    href: "/tasks",
    icon: ListChecks,
  },
  {
    name: "Add Context",
    href: "/context",
    icon: FileText,
  },
]

export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains",
})