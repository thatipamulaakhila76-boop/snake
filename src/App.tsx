import { useState } from 'react';
import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] flex flex-col font-sans border border-[#1a1a1a] overflow-hidden">
      {/* Background decorations - keep subtle gradients if needed, but adapt to new colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-20 h-16 flex items-center justify-between px-8 border-b border-[#1a1a1a] bg-[#0a0a0a] shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gradient-to-tr from-[#00f3ff] to-[#ff00ff] rounded-lg shadow-[0_0_15px_rgba(0,243,255,0.4)]"></div>
          <h1 className="text-xl font-bold tracking-widest text-white uppercase mt-0.5">
            Neon Sync <span className="text-[#00f3ff] text-xs align-top opacity-50 ml-1">v1.0</span>
          </h1>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-[#00f3ff] opacity-70 leading-relaxed">Score</span>
            <span className="text-lg font-mono font-bold text-white drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] leading-none mt-1">
              {score.toString().padStart(6, '0')}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row overflow-hidden p-6 gap-6">
        
        {/* Left Side: Playlist/Music Player */}
        <section className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4 opacity-0 animate-fade-in-right h-full">
          <MusicPlayer />
        </section>

        {/* Right Side: Game */}
        <section className="flex-1 relative flex flex-col opacity-0 animate-fade-in-up h-full">
          <SnakeGame onScoreChange={setScore} />
        </section>

      </main>
    </div>
  );
}
