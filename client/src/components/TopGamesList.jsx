import { motion } from 'motion/react';
import { formatHours, headerImageUrl } from '../lib/format';

function TopGamesList({ games }) {
  if (games.length === 0) {
    return <p className="text-sm text-ink-dim">Nothing played in this time frame.</p>;
  }

  const max = games[0].periodMinutes;

  return (
    <ol className="space-y-2">
      {games.map((game, index) => (
        <li
          key={game.appId}
          className="group relative flex items-center gap-4 overflow-hidden border border-line bg-base/40 p-2 pr-4 transition-all duration-200 hover:border-accent hover:glow"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(game.periodMinutes / max) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.06 }}
            className="absolute inset-y-0 left-0 bg-accent/10"
          />
          <span className="relative w-6 text-center text-lg font-bold text-accent">
            {index + 1}
          </span>
          <img
            src={headerImageUrl(game.appId)}
            alt=""
            loading="lazy"
            className="relative h-10 w-[86px] shrink-0 bg-raised object-cover"
          />
          <span className="relative min-w-0 flex-1 truncate text-sm font-medium text-ink-bright">
            {game.name}
          </span>
          <span className="relative text-sm text-ink-dim">
            {formatHours(game.periodMinutes)}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default TopGamesList;
