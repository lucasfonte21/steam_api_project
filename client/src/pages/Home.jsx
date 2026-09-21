import { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/PageHeader';
import SectionTitle from '../components/SectionTitle';
import NowPlaying from '../components/NowPlaying';
import GameCard from '../components/GameCard';
import TopGamesList from '../components/TopGamesList';
import FriendActivity from '../components/FriendActivity';
import Select from '../components/Select';
import { apiFetch } from '../lib/api';
import { DEFAULT_RANGE, RANGES } from '../lib/ranges';
import { timeAgo } from '../lib/format';

const TOP_GAMES_SHOWN = 5;
const REFRESH_MS = 60000;

function Home() {
  const { user } = useOutletContext();
  const [range, setRange] = useState(DEFAULT_RANGE);

  const activity = useQuery({
    queryKey: ['now-playing'],
    queryFn: () => apiFetch('/api/home/now-playing'),
    refetchInterval: REFRESH_MS,
  });

  const friends = useQuery({
    queryKey: ['friend-activity'],
    queryFn: () => apiFetch('/api/home/friends'),
    refetchInterval: REFRESH_MS,
  });

  const library = useQuery({
    queryKey: ['library', range],
    queryFn: () => apiFetch(`/api/games?range=${range}`),
    placeholderData: (previous) => previous,
  });

  const topGames = (library.data?.games ?? [])
    .filter((game) => game.periodMinutes > 0)
    .sort((a, b) => b.periodMinutes - a.periodMinutes)
    .slice(0, TOP_GAMES_SHOWN);

  const recent = activity.data?.recent ?? [];

  return (
    <>
      <PageHeader title={`Welcome back, ${user.displayName}`} subtitle="Here's what's happening" />

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-10">
          <section>
            <NowPlaying
              currentGame={activity.data?.currentGame}
              lastGame={recent[0]}
              isLoading={activity.isLoading}
            />
          </section>

          {recent.length > 1 && (
            <section>
              <SectionTitle
                action={
                  <Link to="/library?sort=recent" className="text-xs text-accent hover:underline">
                    View all
                  </Link>
                }
              >
                Recently played
              </SectionTitle>
              <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 2xl:grid-cols-3">
                {recent.slice(1, 4).map((game, index) => (
                  <GameCard
                    key={game.appId}
                    game={game}
                    index={index}
                    minutes={game.playtimeLastTwoWeeks}
                    detail={timeAgo(game.lastPlayedAt)}
                  />
                ))}
              </div>
            </section>
          )}

          <section>
            <SectionTitle
              action={
                <Select label="Time frame" value={range} onChange={setRange} options={RANGES} />
              }
            >
              Top games
            </SectionTitle>
            {library.isLoading ? (
              <div className="h-64 animate-pulse bg-raised" />
            ) : (
              <TopGamesList key={range} games={topGames} />
            )}
          </section>
        </div>

        <aside>
          <SectionTitle>Friend activity</SectionTitle>
          <FriendActivity
            data={friends.data}
            isLoading={friends.isLoading}
            isError={friends.isError}
          />
        </aside>
      </div>
    </>
  );
}

export default Home;
