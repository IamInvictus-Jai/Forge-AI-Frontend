import React from "react";
import { Settings, Layers, MonitorPlay } from "lucide-react";

const EditorPage: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in relative z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-orange-950/20 z-0" />

      <div className="relative z-10 max-w-2xl flex flex-col items-center space-y-8">
        {/* Icon Cluster */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <Layers className="w-8 h-8 text-neutral-400" />
          </div>
          <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(255,85,0,0.2)]">
            <MonitorPlay className="w-10 h-10 text-orange-500" />
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <Settings className="w-8 h-8 text-neutral-400" />
          </div>
        </div>

        <h2 className="text-6xl md:text-8xl font-bebas text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">
          Forge Editor
        </h2>

        <p className="text-xl md:text-2xl font-exo text-orange-500 font-semibold tracking-wide uppercase">
          Next Phase Implementation
        </p>

        <p className="text-neutral-500 max-w-md leading-relaxed">
          The video has been successfully uploaded to the cloud. The editing
          interface with AI-driven captioning, keyframing, and effects is
          currently under development.
        </p>
      </div>
    </div>
  );
};

export default EditorPage;
