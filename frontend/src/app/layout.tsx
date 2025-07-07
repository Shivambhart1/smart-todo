import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import { ReactNode } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const inter = Inter({ subsets: ["latin"] });
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains",
})

export const metadata = {
  title: "Smart Todo with AI",
  description: "Manage tasks intelligently with AI-powered suggestions",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        <div className="flex min-h-screen w-full">
          <div className={`w-64 bg-white hidden md:block h-screen overflow-hidden border-r-2 border-r-gray-200 ${grotesk.className}`}>
            <Sidebar />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="bg-white px-6 py-2 sticky top-0 z-10">
              <Navbar />
            </div>
            <main className="flex-1 rounded-sm bg-white shadow-sm p-4 ml-2 mr-2 mt-2 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}