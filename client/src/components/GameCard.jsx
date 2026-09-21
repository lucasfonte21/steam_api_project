import { useState } from 'react';
import { motion } from 'motion/react';
import { formatHours, headerImageUrl } from '../lib/format';

function GameCard({ game, index }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: Math.min(index, 12) * 0.03 }}
      className="group"
    >
      <div className="relative aspect-[460/215] overflow-hidden bg-raised transition-shadow duration-300 group-hover:glow">
        {imageFailed ? (
          <div className="flex h-full items-center justify-center p-4 text-center text-sm text-ink-dim">
            {game.name}
          </div>
        ) : (
          <img
            src={headerImageUrl(game.appId)}
            alt={game.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
      </div>
      <h3 className="mt-3 truncate text-sm font-semibold text-ink-bright">
        {game.name}
      </h3>
      <p className="text-xs text-ink-dim">{formatHours(game.totalPlaytimeMinutes)}</p>
    </motion.article>
  );
}

export default GameCard;
