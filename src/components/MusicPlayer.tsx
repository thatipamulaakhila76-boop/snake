import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Gamepad2 } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Drift',
    artist: 'AI Generator',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12'
  },
  {
    id: 2,
    title: 'Cybernetic Pulse',
    artist: 'AI Generator',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05'
  },
  {
    id: 3,
    title: 'Digital Horizon',
    artist: 'AI Generator',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44'
  }
];

interface MusicPlayerProps {
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export default function MusicPlayer({ onPlayStateChange }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Audio play blocked", e));
    } else {
      audioRef.current?.pause();
    }
    
    if (onPlayStateChange) {
      onPlayStateChange(isPlaying);
    }
  }, [isPlaying, currentTrackIndex, onPlayStateChange]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="w-full h-full rounded-xl bg-[#0f0f0f] border border-[#1a1a1a] p-6 shadow-lg flex flex-col items-center justify-center relative">
      <h2 className="absolute top-6 left-6 text-[10px] uppercase tracking-[0.2em] text-[#666] font-semibold">AI Audio</h2>
      
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleEnded} 
      />
      
      <div className="flex flex-col items-center gap-8 w-full mt-4">
        {/* Album Art Placeholder */}
        <div className="w-48 h-48 rounded-full border border-[#00f3ff]/30 flex items-center justify-center bg-[#050505] shadow-[0_0_20px_rgba(0,243,255,0.1)] relative">
           <div className={`w-32 h-32 rounded-full border border-[#ff00ff]/30 flex items-center justify-center ${isPlaying ? 'animate-spin-slow shadow-[0_0_15px_rgba(255,0,255,0.2)]' : ''}`}>
             <Gamepad2 className="w-8 h-8 text-[#00f3ff] opacity-80" />
           </div>
        </div>

        {/* Track Info */}
        <div className="text-center">
          <p className="text-[10px] font-mono text-[#00f3ff] mb-2 tracking-widest opacity-80">
            {isPlaying ? 'ACTIVE' : 'READY'}
          </p>
          <h2 className="text-lg font-medium text-white tracking-wide">
            {currentTrack.title}
          </h2>
          <p className="text-[#666] text-xs tracking-widest mt-1">
            {currentTrack.artist}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mt-2">
          <button 
            onClick={handlePrev}
            className="text-[#666] hover:text-white transition-colors"
          >
            <SkipBack className="w-5 h-5" fill="currentColor" />
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" fill="currentColor" />
            ) : (
              <Play className="w-6 h-6 ml-1" fill="currentColor" />
            )}
          </button>

          <button 
            onClick={handleNext}
            className="text-[#666] hover:text-white transition-colors"
          >
            <SkipForward className="w-5 h-5" fill="currentColor" />
          </button>
        </div>

        {/* Volume & Details */}
        <div className="w-full flex justify-between items-center text-[10px] font-mono text-[#444] mt-4 border-t border-[#1a1a1a] pt-6">
          <div className="flex items-center gap-2">
             <Volume2 className="w-3 h-3 text-[#ff00ff] opacity-70" />
             <span>100%</span>
          </div>
          <span>{currentTrack.duration}</span>
        </div>
      </div>
    </div>
  );
}
