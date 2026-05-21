import React, { useState, useEffect } from 'react';

export function CountdownTimer({ expiryDate }: { expiryDate: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const tick = () => {
      const diff = new Date(expiryDate).getTime() - Date.now();
      if (diff <= 0) { 
        setTimeLeft('Expired'); 
        return; 
      }
      
      const parts = [];
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);

      if (d > 0) parts.push(`${d}d`);
      if (h > 0) parts.push(`${h}h`);
      if (m > 0 || parts.length > 0) parts.push(`${m}m`);

      setTimeLeft(`Expires in ${parts.join(' ')}`);
    };
    
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [expiryDate]);

  return <span className="text-red-500 font-semibold">{timeLeft}</span>;
}
