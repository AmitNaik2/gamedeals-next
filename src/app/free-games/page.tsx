import { Metadata } from 'next';
import { getActiveGames } from '../../lib/gamerpower';
import ClientHome from '../ClientHome';

export const metadata: Metadata = {
  title: 'Free PC Games Right Now | GamesDealsHub',
  description: 'All 100% free PC games available now on Epic Games, Steam, GOG and more. Updated every hour.',
  openGraph: {
    title: 'Free PC Games Right Now | GamesDealsHub',
    description: 'All 100% free PC games available now on Epic Games, Steam, GOG and more. Updated every hour.',
    url: 'https://www.gamesdealshub.me/free-games'
  },
  alternates: { canonical: 'https://www.gamesdealshub.me/free-games' }
};

export const revalidate = 300;

export default async function Page() { 
  const activeGames = await getActiveGames();
  return <ClientHome initialActiveGames={activeGames} />;
}
