import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Search } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import GameCard from '../components/GameCard';
import Select from '../components/Select';
import { apiFetch } from '../lib/api';
import { DEFAULT_RANGE, RANGES, isRange } from '../lib/ranges';

const lastPlayed = (game) => (game.lastPlayedAt ? new Date(game.lastPlayedAt).getTime() : 0);

const SORTS = [
  { value: 'period', label: 'Most played', fn: (a, b) => b.periodMinutes - a.periodMinutes },
  { value: 'recent', label: 'Recently played', fn: (a, b) => lastPlayed(b) - lastPlayed(a) },
  { value: 'total', label: 'All-time playtime', fn: (a, b) => b.totalPlaytimeMinutes - a.totalPlaytimeMinutes },
  { value: 'name', label: 'Name (A-Z)', fn: (a, b) => a.name.localeCompare(b.name) },
];

function Library() {
  const queryClient = useQueryClient();
  const [params, setParams] = useSearchParams();

  const range = isRange(params.get('range')) ? params.get('range') : DEFAULT_RANGE;
  const sortKey = SORTS.some((sort) => sort.value === params.get('sort')) ? params.get('sort') : 'period';
  const search = params.get('q') ?? '';

  const updateParam = (key, value) => {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        return next;
      },
      { replace: true },
    );
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['library', range],
    queryFn: () => apiFetch(`/api/games?range=${range}`),
    placeholderData: (previous) => previous,
  });

  const sync = useMutation({
    mutationFn: () => apiFetch('/api/games/sync', { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['library'] }),
  });

  const games = useMemo(() => {
    const query = search.trim().toLowerCase();
    const sorter = SORTS.find((sort) => sort.value === sortKey).fn;
    const hideIdle = sortKey === 'period' && range !== 'all';

    return (data?.games ?? [])
      .filter((game) => game.name.toLowerCase().includes(query))
      .filter((game) => !hideIdle || game.periodMinutes > 0)
      .sort(sorter);
  }, [data, search, sortKey, range]);

  const total = data?.games.length ?? 0;
  const gridClass = 'grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4';

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
        <label className="relative min-w-0 flex-1 md:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-dim" />
          <input
            type="search"
            value={search}
            onChange={(event) => updateParam('q', event.target.value)}
            placeholder="Search games"
            className="w-full border border-line bg-base py-2 pl-9 pr-3 text-sm text-ink-bright outline-none transition-all duration-200 focus:border-accent focus:glow"
          />
        </label>
        <Select
          label="Time frame"
          value={range}
          onChange={(value) => updateParam('range', value === DEFAULT_RANGE ? '' : value)}
          options={RANGES}
        />
        <Select
          label="Sort by"
          value={sortKey}
          onChange={(value) => updateParam('sort', value === 'period' ? '' : value)}
          options={SORTS}
        />
      </div>

      {isLoading && (
        <div className={gridClass}>
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
        <p className="text-sm text-ink-dim">
          {search ? `No games match "${search}".` : 'Nothing played in this time frame.'}
        </p>
      )}

      <div className={gridClass}>
        {games.map((game, index) => (
          <GameCard
            key={`${range}-${game.appId}`}
            game={game}
            index={index}
            minutes={sortKey === 'total' ? game.totalPlaytimeMinutes : game.periodMinutes}
          />
        ))}
      </div>
    </>
  );
}

export default Library;
