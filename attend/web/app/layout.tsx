import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LATIO Chấm Công — Admin",
  description: "Quản lý chấm công, ca làm, nghỉ phép và bảng lương cho LATIO Agency",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased bg-bg text-text">{children}</body>
    </html>
  );
}
