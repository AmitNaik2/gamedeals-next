import { useState, useEffect } from 'react';

export function useIgdb(title: string) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!title) return;
    
    let isMounted = true;
    
    // First try IGDB
    fetch(`/api/igdb?title=${encodeURIComponent(title)}`)
      .then(async res => {
          const text = await res.text();
          try { return JSON.parse(text); } catch { return null; }
      })
      .then(json => {
        if (!isMounted) return;
        if (json && !json.not_found && !json.error) {
           setData(json);
        } else {
           // Fallback to RAWG if IGDB didn't find it or no keys configured
           return fetch(`/api/rawg?title=${encodeURIComponent(title)}`);
        }
      })
      .then(async res => {
        if (!res || !isMounted) return null;
        const text = await res.text();
        try { return JSON.parse(text); } catch { return null; }
      })
      .then(json => {
         if (json && !json.not_found && !json.error && isMounted) {
           setData(json);
         }
      })
      .catch(err => console.error(err));

    return () => { isMounted = false; };
  }, [title]);

  return data;
}
