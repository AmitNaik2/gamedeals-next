import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
  endDate: string;
}

export function Countdown({ endDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isEndingSoon, setIsEndingSoon] = useState(false);

  useEffect(() => {
    if (!endDate || endDate === 'N/A') return;

    // Fix Gamerpower API date string specifically
    const endStr = endDate.includes(' ') && !endDate.includes('Z') && !endDate.includes('GMT') 
        ? endDate.replace(' ', 'T') + 'Z' 
        : endDate;

    const calculateTimeLeft = () => {
      const end = new Date(endStr).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (isNaN(difference)) return '';

      if (difference <= 0) {
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
  }, [endDate]);

  if (!endDate || endDate === 'N/A' || !timeLeft) return null;

  return (
    <div className={`flex flex-col gap-0.5 ${isEndingSoon ? 'text-amber-400' : 'text-cyan-400'}`}>
      <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold">
        <Clock className="w-3 h-3" />
        {timeLeft === 'Expired' ? 'EXPIRED' : `EXPIRES IN: ${timeLeft}`}
      </span>
      {timeLeft !== 'Expired' && (
        <span className="text-[9px] text-white/40 tracking-widest pl-4.5">
          ENDS: {new Date(endDate.replace(' ', 'T') + 'Z').toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }).replace('IST', 'IST')}
        </span>
      )}
    </div>
  );
}
