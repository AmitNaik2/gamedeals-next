import { useState, useEffect } from 'react';

export function useRawg(title: string) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!title) return;
    
    // We only fetch if it's visible or you hover to save API quota,
    // but a simple approach:
    const timer = setTimeout(() => {
      fetch(`/api/rawg?title=${encodeURIComponent(title)}`)
        .then(async res => {
          const text = await res.text();
          try { return JSON.parse(text); } catch { return null; }
        })
        .then(json => {
          if (json && !json.not_found && !json.error) setData(json);
        })
        .catch(err => console.error(err));
    }, 1000 + Math.random() * 2000); // stagger to prevent burst

    return () => clearTimeout(timer);
  }, [title]);

  return data;
}
