export function generateUniqueSummary(title: string, rawDesc: string, type: string, platform: string): string {
  // A pseudo "AI" rewrite that creates unique punchy summaries
  const isFree = type.toLowerCase().includes('game') || type.toLowerCase().includes('freebie') || (rawDesc && rawDesc.toLowerCase().includes('100% off'));
  const action = isFree ? "Claim your free copy of" : "Don't miss this deal on";
  const safeDesc = rawDesc ? rawDesc : "";
  const firstSentence = safeDesc.split('.')[0];
  
  return `${action} ${title}, available now on ${platform.split(',')[0]}. ${firstSentence}. Add it to your library before this limited-time offer expires!`;
}

export function generateTags(title: string, platform: string, type: string, rawDesc: string): string[] {
    const base = [platform.split(',')[0], "Limited Time Drop"];
    if (type.toLowerCase().includes('dlc') || (rawDesc && rawDesc.toLowerCase().includes('dlc'))) {
        base.push("Expansion / DLC");
    } else {
        base.push("Free to Keep");
    }
    
    if (rawDesc && rawDesc.toLowerCase().includes('multiplayer')) base.push('Multiplayer');
    if (rawDesc && rawDesc.toLowerCase().includes('co-op')) base.push('Co-op');
    return base;
}
