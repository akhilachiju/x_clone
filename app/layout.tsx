"use client"
import "./globals.css";
//import type { Metadata } from "next";
import LeftBar from "./components/layouts/LeftBar";
import RightBar from "./components/layouts/RightBar";
import LoginModal from "./components/model/LoginModal";
import RegisterModal from "./components/model/RegisterModal";

/*export const metadata: Metadata = {
  title: "X Clone",
  description: "Next.js X clone application project",
};*/

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-3xl lg:max-w-screen-5xl xl:max-w-screen-7xl mx-auto flex justify-between">
          <RegisterModal />
          <LoginModal />
          <div className="px-2 sm:px-2 2xl:px-8">
            <LeftBar />
          </div>

          <div className="flex-1 lg:min-w-[600px] border-x border-x-neutral-800">
            {children}
          </div>

          <div className="hidden lg:flex ml-4 md:ml-8 flex-1">
            <RightBar />
          </div>
        </div>
      </body>
    </html>
  );
}
