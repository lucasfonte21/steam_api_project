import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Search } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import GameCard from '../components/GameCard';
import { apiFetch } from '../lib/api';

const sorters = {
  playtime: { label: 'Most played', fn: (a, b) => b.totalPlaytimeMinutes - a.totalPlaytimeMinutes },
  recent: { label: 'Recently played', fn: (a, b) => b.playtimeLastTwoWeeks - a.playtimeLastTwoWeeks },
  name: { label: 'Name (A-Z)', fn: (a, b) => a.name.localeCompare(b.name) },
};

const controlClass =
  'border border-line bg-base px-3 py-2 text-sm text-ink-bright outline-none transition-all duration-200 focus:border-accent focus:glow';

function Library() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('playtime');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['library'],
    queryFn: () => apiFetch('/api/games'),
  });

  const sync = useMutation({
    mutationFn: () => apiFetch('/api/games/sync', { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['library'] }),
  });

  const games = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (data?.games ?? [])
      .filter((game) => game.name.toLowerCase().includes(query))
      .sort(sorters[sortKey].fn);
  }, [data, search, sortKey]);

  const total = data?.games.length ?? 0;

  return (
    <>
      <PageHeader title="Library" subtitle={total ? `${total} games` : 'Everything you own'}>
        <button
          onClick={() => sync.mutate()}
          disabled={sync.isPending}
          className="flex items-center gap-2 border border-line px-4 py-2 text-sm text-ink transition-all duration-200 hover:border-accent hover:text-accent hover:glow disabled:opacity-50"
        >
          <RefreshCw size={14} className={sync.isPending ? 'animate-spin' : ''} />
          {sync.isPending ? 'Syncing' : 'Sync'}
        </button>
      </PageHeader>

      <div className="mb-8 flex flex-wrap gap-3">
        <label className="relative flex-1 md:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-dim" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search games"
            className={`${controlClass} w-full pl-9`}
          />
        </label>
        <select
          value={sortKey}
          onChange={(event) => setSortKey(event.target.value)}
          className={controlClass}
        >
          {Object.entries(sorters).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="aspect-[460/215] animate-pulse bg-raised" />
          ))}
        </div>
      )}

      {isError && <p className="text-sm text-ink-dim">Could not load your library.</p>}

      {!isLoading && !isError && total === 0 && (
        <p className="border border-dashed border-line p-12 text-center text-sm text-ink-dim">
          No games yet. Hit Sync to pull your Steam library.
        </p>
      )}

      {!isLoading && total > 0 && games.length === 0 && (
        <p className="text-sm text-ink-dim">No games match "{search}".</p>
      )}

      <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {games.map((game, index) => (
          <GameCard key={game.appId} game={game} index={index} />
        ))}
      </div>
    </>
  );
}

export default Library;
