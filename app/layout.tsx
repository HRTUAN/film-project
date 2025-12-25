// Fix: Added missing React import to resolve 'Cannot find namespace React' error for React.ReactNode type.
import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TuanPhim - Modern Movie Streaming",
  description: "Nền tảng xem phim hiện đại lấy cảm hứng từ Netflix, hỗ trợ quản lý danh sách và phát video tùy chỉnh.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      <div className="min-h-screen flex flex-col bg-neutral-950 text-white selection:bg-yellow-400 selection:text-black">
        <Header />
        <main className="flex-grow pt-16">
          {children}
        </main>
        
        <footer className="py-10 px-6 border-t border-neutral-800 bg-neutral-950">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Link to="/" className="text-2xl font-black text-yellow-400">TUAN<span className="text-white">PHIM</span></Link>
            </div>
            <p className="text-neutral-400 text-sm">© 2024 TuanPhim. Dự án demo giao diện phim hiện đại.</p>
            <div className="flex gap-6 text-neutral-400 text-sm">
              <Link to="/under-development" className="hover:text-yellow-400 transition-colors">Điều khoản</Link>
              <Link to="/under-development" className="hover:text-yellow-400 transition-colors">Bảo mật</Link>
              <Link to="/under-development" className="hover:text-yellow-400 transition-colors">Liên hệ</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
} 
