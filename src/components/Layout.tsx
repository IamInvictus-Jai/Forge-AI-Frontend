import React from "react";
import { Outlet } from "react-router-dom";
import { Zap } from "lucide-react";

const Layout: React.FC = () => {
  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-brand-black flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* --- Cinematic Background (Persistent across all pages) --- */}
      <div className="absolute top-[-20%] right-[-10%] w-[80vh] h-[80vh] bg-orange-600/25 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60vh] h-[60vh] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* --- Branding / Header (Persistent) --- */}
      <nav className="absolute top-0 left-0 w-full p-6 md:p-8 z-50 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto group cursor-default">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,85,0,0.4)] group-hover:shadow-[0_0_30px_rgba(255,85,0,0.6)] transition-shadow duration-500">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bebas text-2xl md:text-3xl text-white tracking-wider leading-none mt-1">
              FORGE <span className="text-orange-500">AI</span>
            </span>
          </div>
        </div>
      </nav>

      {/* --- Main Content Container --- */}
      <main className="flex-1 w-full relative z-10 overflow-y-auto overflow-x-hidden scroll-smooth">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
