'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Music, Volume2, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MusicPlayerProps {
  src: string;
  title?: string;
}

interface Note {
  id: number;
  x: number;
  symbol: string;
  size: number;
  duration: number;
  delay: number;
}

const musicSymbols = ['♪', '♫', '♬', '♩', '♭'];

export function MusicPlayer({ src, title = 'Canción' }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const noteIdRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const spawnNote = useCallback(() => {
    const note: Note = {
      id: noteIdRef.current++,
      x: Math.random() * 40 - 10,
      symbol: musicSymbols[Math.floor(Math.random() * musicSymbols.length)],
      size: 16 + Math.random() * 20,
      duration: 2 + Math.random() * 2,
      delay: 0,
    };
    setNotes((prev) => [...prev.slice(-15), note]);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(spawnNote, 400);
      spawnNote();
      return () => clearInterval(interval);
    } else {
      setNotes([]);
    }
  }, [isPlaying, spawnNote]);

  const cleanupNote = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        setShowTooltip(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src={src} preload="metadata" loop />
      <div className="fixed bottom-6 left-6 z-50">
        <AnimatePresence>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{
                opacity: 1,
                x: 0,
                y: 0,
                scale: 0.5,
                rotate: -10,
              }}
              animate={{
                opacity: 0,
                x: note.x,
                y: -(80 + Math.random() * 60),
                scale: 1.2,
                rotate: 15,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: note.duration,
                ease: 'easeOut',
              }}
              onAnimationComplete={() => cleanupNote(note.id)}
              className="absolute bottom-16 left-6 pointer-events-none text-detalle"
              style={{ fontSize: note.size }}
            >
              {note.symbol}
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {showTooltip && !isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-16 left-0 bg-charcoal text-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap"
            >
              <p className="text-sm font-cormorant">Dale play a la música</p>
              <div className="absolute -bottom-1.5 left-5 w-3 h-3 bg-charcoal rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={togglePlay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isPlaying
              ? 'bg-charcoal/90 backdrop-blur-sm'
              : 'bg-charcoal/90 backdrop-blur-sm ring-2 ring-detalle/50 animate-pulse'
          }`}
          aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
        >
          {isPlaying ? (
            <Volume2 className="w-6 h-6 text-detalle" />
          ) : (
            <Play className="w-6 h-6 text-detalle ml-0.5" />
          )}
        </motion.button>
      </div>
    </>
  );
}
