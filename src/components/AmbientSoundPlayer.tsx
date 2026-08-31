import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Headphones, Volume2, VolumeX, Music, Sparkles, CloudRain, Radio, Disc } from 'lucide-react';
import { soundFx, AmbientChannel } from '../utils/audio';

export const AmbientSoundPlayer: React.FC = () => {
  const [currentChannel, setCurrentChannel] = useState<AmbientChannel>('off');
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const channels: Array<{
    id: AmbientChannel;
    name: string;
    desc: string;
    icon: React.ElementType;
    color: string;
  }> = [
    {
      id: 'cyber-lofi',
      name: 'Cyber Lo-Fi Chords',
      desc: 'Procedural 7th/9th jazz chords & ambient vinyl',
      icon: Disc,
      color: 'text-purple-400',
    },
    {
      id: 'synthwave-pad',
      name: 'Synthwave Horizon',
      desc: 'Warm analog lowpass pad synthesizer',
      icon: Radio,
      color: 'text-cyan-400',
    },
    {
      id: 'deep-space',
      name: 'Sub-Bass Drone',
      desc: 'Deep focus binaural meditation tone',
      icon: Sparkles,
      color: 'text-indigo-400',
    },
    {
      id: 'rain-zen',
      name: 'Kathmandu Rain',
      desc: 'Procedural synthesized monsoon rainfall',
      icon: CloudRain,
      color: 'text-emerald-400',
    },
  ];

  const handleSelectChannel = (channel: AmbientChannel) => {
    soundFx.playClick();
    if (currentChannel === channel) {
      soundFx.setAmbientChannel('off');
      setCurrentChannel('off');
      setIsPlaying(false);
    } else {
      soundFx.setAmbientChannel(channel);
      setCurrentChannel(channel);
      setIsPlaying(true);
    }
  };

  const handleTogglePlay = () => {
    soundFx.playClick();
    if (isPlaying) {
      soundFx.setAmbientChannel('off');
      setIsPlaying(false);
    } else {
      const target = currentChannel === 'off' ? 'cyber-lofi' : currentChannel;
      soundFx.setAmbientChannel(target);
      setCurrentChannel(target);
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          soundFx.playClick();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => soundFx.playHover()}
        data-cursor="LO-FI"
        title="Ambient Coding Soundscapes"
        className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-mono transition-all ${
          isPlaying
            ? 'border-purple-500/50 bg-purple-500/15 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
            : 'border-slate-800 bg-slate-900/90 text-slate-400 hover:border-slate-700 hover:text-slate-200'
        }`}
      >
        <Headphones className={`h-3.5 w-3.5 ${isPlaying ? 'text-purple-400 animate-pulse' : 'text-slate-400'}`} />
        <span className="hidden sm:inline font-bold">
          {isPlaying ? 'LO-FI PLAYING' : 'LO-FI BEATS'}
        </span>
        {isPlaying && (
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-0.5 h-2 bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 h-3 bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 h-1.5 bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-12 z-50 w-72 sm:w-80 rounded-3xl border border-purple-500/30 bg-slate-950/95 p-4 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl font-mono text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-purple-400" />
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Generative Lo-Fi Engine
                </span>
              </div>

              <button
                onClick={handleTogglePlay}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                  isPlaying
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </button>
            </div>

            <p className="mt-2 text-[10px] font-sans text-slate-400 leading-relaxed">
              100% real-time synthesized procedural soundscapes generated via Web Audio API. Zero streaming bandwidth.
            </p>

            <div className="mt-3 space-y-1.5">
              {channels.map((ch) => {
                const isSelected = currentChannel === ch.id && isPlaying;
                const Icon = ch.icon;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectChannel(ch.id)}
                    className={`w-full p-2.5 rounded-2xl text-left transition-all border flex items-center justify-between ${
                      isSelected
                        ? 'border-purple-500/50 bg-purple-500/15 text-white'
                        : 'border-slate-800/80 bg-slate-900/50 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-slate-800/80 ${ch.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-syne font-bold text-xs text-white">{ch.name}</div>
                        <div className="text-[9px] text-slate-400">{ch.desc}</div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-[9px] font-bold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                        LIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
