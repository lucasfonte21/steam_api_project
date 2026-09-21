import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Search } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import GameCard from '../components/GameCard';
import Select from '../components/Select';
import { apiFetch } from '../lib/api';
import { DEFAULT_RANGE, RANGES, isRange } from '../lib/ranges';
import { formatHours, timeAgo } from '../lib/format';

const timestamp = (game) => (game.lastPlayedAt ? new Date(game.lastPlayedAt).getTime() : 0);
const byName = (a, b) => a.name.localeCompare(b.name);

// Each view decides its own filter, order and the single stat shown on a card.
const VIEWS = [
  {
    value: 'period',
    label: 'Most played',
    sort: (a, b) => b.periodMinutes - a.periodMinutes || b.totalPlaytimeMinutes - a.totalPlaytimeMinutes,
    info: (game) => formatHours(game.periodMinutes),
    empty: 'Nothing to show.',
  },
  {
    value: 'recent',
    label: 'Recently played',
    filter: (game) => Boolean(game.lastPlayedAt),
    sort: (a, b) => timestamp(b) - timestamp(a),
    info: (game) => timeAgo(game.lastPlayedAt),
    empty: 'No last-played dates yet. Hit Sync.',
  },
  {
    value: 'all',
    label: 'All games (A-Z)',
    sort: byName,
    info: (game) => formatHours(game.totalPlaytimeMinutes),
    empty: 'Nothing to show.',
  },
  {
    value: 'unplayed',
    label: 'Unplayed',
    filter: (game) => game.totalPlaytimeMinutes === 0,
    sort: byName,
    info: () => '',
    empty: 'No unplayed games. Impressive.',
  },
];

const DEFAULT_VIEW = 'period';

function Library() {
  const queryClient = useQueryClient();
  const [params, setParams] = useSearchParams();

  const range = isRange(params.get('range')) ? params.get('range') : DEFAULT_RANGE;
  const view = VIEWS.find((item) => item.value === params.get('view')) ?? VIEWS[0];
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

  // Only the Most played view needs per-period numbers; others skip the snapshot lookups.
  const apiRange = view.value === 'period' ? range : 'all';

  const { data, isLoading, isError } = useQuery({
    queryKey: ['library', apiRange],
    queryFn: () => apiFetch(`/api/games?range=${apiRange}`),
    placeholderData: (previous) => previous,
  });

  const sync = useMutation({
    mutationFn: () => apiFetch('/api/games/sync', { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['library'] }),
  });

  const games = useMemo(() => {
    const query = search.trim().toLowerCase();

    return (data?.games ?? [])
      .filter((game) => game.name.toLowerCase().includes(query))
      .filter(view.filter ?? (() => true))
      .sort(view.sort);
  }, [data, search, view]);

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
          label="View"
          value={view.value}
          onChange={(value) => updateParam('view', value === DEFAULT_VIEW ? '' : value)}
          options={VIEWS}
        />
        {view.value === 'period' && (
          <Select
            label="Time frame"
            value={range}
            onChange={(value) => updateParam('range', value === DEFAULT_RANGE ? '' : value)}
            options={RANGES}
          />
        )}
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
          {search ? `No games match "${search}".` : view.empty}
        </p>
      )}

      <div className={gridClass}>
        {games.map((game, index) => (
          <GameCard
            key={`${view.value}-${apiRange}-${game.appId}`}
            game={game}
            index={index}
            label={view.info(game)}
          />
        ))}
      </div>
    </>
  );
}

export default Library;
