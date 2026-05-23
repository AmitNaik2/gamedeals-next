"use client";
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
  endDate: string;
}

/** Format a date string to a deterministic UTC string, safe for SSR + client. */
function formatEndDate(raw: string): string {
  const normalized = raw.includes(' ') && !raw.includes('Z') && !raw.includes('GMT')
    ? raw.replace(' ', 'T') + 'Z'
    : raw;
  const d = new Date(normalized);
  if (isNaN(d.getTime())) return '';
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()} ${hh}:${mm} UTC`;
}

export function Countdown({ endDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isEndingSoon, setIsEndingSoon] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (!endDate || endDate === 'N/A') return;

    const endStr = endDate.includes(' ') && !endDate.includes('Z') && !endDate.includes('GMT')
      ? endDate.replace(' ', 'T') + 'Z'
      : endDate;

    const calculateTimeLeft = () => {
      const end = new Date(endStr).getTime();
      const now = Date.now();
      const difference = end - now;

      if (isNaN(difference)) return '';

      if (difference <= 0 || end < new Date("2026-05-20").getTime()) {
        setIsEndingSoon(false);
        return 'Expired';
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setIsEndingSoon(days === 0);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      return parts.join(' ');
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, isMounted]);

  // Return nothing until client-side mount — prevents hydration mismatch & "Loading..." flash
  if (!isMounted) return null;

  if (!endDate || endDate === 'N/A' || !timeLeft) return null;

  const formattedEnd = formatEndDate(endDate);

  return (
    <div className={`flex flex-col gap-0.5 ${isEndingSoon ? 'text-amber-400' : 'text-cyan-400'}`}>
      <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold">
        <Clock className="w-3 h-3" />
        {timeLeft === 'Expired' ? 'EXPIRED' : `EXPIRES IN: ${timeLeft}`}
      </span>
      {timeLeft !== 'Expired' && formattedEnd && (
        <span className="text-[9px] text-white/40 tracking-widest pl-4.5">
          ENDS: {formattedEnd}
        </span>
      )}
    </div>
  );
}
