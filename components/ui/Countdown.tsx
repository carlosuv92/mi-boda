'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownProps {
  targetDate: Date | string;
  variant?: 'light' | 'dark';
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown({ targetDate, variant = 'light' }: CountdownProps) {
  const isDark = variant === 'dark';

  const calculateTimeLeft = (): TimeLeft => {
    const target = targetDate instanceof Date ? targetDate.getTime() : new Date(targetDate).getTime();
    const difference = target - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'Días', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Minutos', value: timeLeft.minutes },
    { label: 'Segundos', value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center gap-3 md:gap-5">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div
            className={`${
              isDark
                ? "bg-white/10 backdrop-blur-md border border-white/20"
                : "bg-white/80 backdrop-blur-sm shadow-sm"
            } rounded-lg px-3 py-2 md:px-5 md:py-3 min-w-[3.4375rem] md:min-w-[4.6875rem]`}
          >
            <span
              className={`text-3xl md:text-3xl lg:text-4xl font-cormorant font-semibold ${
                isDark ? "text-white" : "text-text-primary"
              }`}
            >
              {String(unit.value).padStart(2, "0")}
            </span>
          </div>
          <span
            className={`text-[10px] md:text-xs mt-1.5 uppercase tracking-widest ${
              isDark ? "text-white/90" : "text-text-secondary"
            }`}
          >
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
