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
      .then(async json => {
        if (!isMounted) return;
        if (json && !json.not_found && !json.error) {
           const hasDevelopers = json.involved_companies && json.involved_companies.length > 0;
           const hasGallery = json.gallery && json.gallery.length > 0;
           const hasVideo = json.gallery && json.gallery.some((m: any) => m.type === 'video' || m.type === 'youtube');
           
           if (!hasDevelopers || !hasVideo) {
              try {
                 const rawgRes = await fetch(`/api/rawg?title=${encodeURIComponent(title)}`);
                 if (rawgRes.ok) {
                    const rawgJson = await rawgRes.json();
                    if (rawgJson && !rawgJson.error && !rawgJson.not_found) {
                       if (!hasDevelopers) {
                          json.developers = rawgJson.developers;
                          json.publishers = rawgJson.publishers;
                       }
                       if (!hasVideo && rawgJson.gallery) {
                          const merged = [...(json.gallery || [])];
                          rawgJson.gallery.forEach((rm: any) => {
                              if (!merged.some(im => im.url === rm.url)) {
                                  if (rm.type === 'video' || rm.type === 'youtube') merged.unshift(rm);
                                  else if (!hasGallery) merged.push(rm);
                              }
                          });
                          json.gallery = merged;
                       }
                    }
                 }
              } catch (e) {}
           }
           
           const stillHasVideo = json.gallery && json.gallery.some((m: any) => m.type === 'video' || m.type === 'youtube');
           if (!stillHasVideo) {
              try {
                 const steamRes = await fetch(`/api/steam?title=${encodeURIComponent(title)}`);
                 if (steamRes.ok) {
                    const steamJson = await steamRes.json();
                    if (steamJson && !steamJson.error && !steamJson.not_found && steamJson.gallery) {
                       const merged = [...(json.gallery || [])];
                       steamJson.gallery.forEach((sm: any) => {
                          if (sm.type === 'video' || sm.type === 'youtube') {
                              if (!merged.some(im => im.url === sm.url)) merged.unshift(sm);
                          } else if (!hasGallery) {
                              if (!merged.some(im => im.url === sm.url)) merged.push(sm);
                          }
                       });
                       json.gallery = merged;
                    }
                 }
              } catch (e) {}
           }

           if (isMounted) setData(json);
        } else {
           // Fallback to RAWG if IGDB didn't find it or no keys configured
           try {
              const rawgRes = await fetch(`/api/rawg?title=${encodeURIComponent(title)}`);
              if (rawgRes.ok) {
                  const rawgJson = await rawgRes.json();
                  if (rawgJson && !rawgJson.not_found && !rawgJson.error) {
                     const rawgHasVideo = rawgJson.gallery && rawgJson.gallery.some((m: any) => m.type === 'video' || m.type === 'youtube');
                     if (!rawgHasVideo) {
                         const steamRes = await fetch(`/api/steam?title=${encodeURIComponent(title)}`);
                         if (steamRes.ok) {
                             const steamJson = await steamRes.json();
                             if (steamJson && !steamJson.error && !steamJson.not_found && steamJson.gallery) {
                                 const merged = [...(rawgJson.gallery || [])];
                                 steamJson.gallery.forEach((sm: any) => {
                                     if (!merged.some(im => im.url === sm.url)) {
                                         if (sm.type === 'video' || sm.type === 'youtube') merged.unshift(sm);
                                         else if (!rawgJson.gallery || rawgJson.gallery.length === 0) merged.push(sm);
                                     }
                                 });
                                 rawgJson.gallery = merged;
                             }
                         }
                     }
                     if (isMounted) setData(rawgJson);
                     return;
                  }
              }
              
              // Ultimate Fallback: Steam (Requires NO API Keys and has perfect release dates)
              const steamRes = await fetch(`/api/steam?title=${encodeURIComponent(title)}`);
              if (steamRes.ok) {
                  const steamJson = await steamRes.json();
                  if (steamJson && !steamJson.not_found && !steamJson.error && isMounted) {
                      setData(steamJson);
                  }
              }
           } catch(e) {}
        }
      })
      .catch(err => {
         // Silently fail on network/adblocker errors
      });

    return () => { isMounted = false; };
  }, [title]);

  return data;
}
