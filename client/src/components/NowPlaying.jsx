import { motion } from 'motion/react';
import { headerImageUrl, timeAgo } from '../lib/format';

function NowPlaying({ currentGame, lastGame, isLoading }) {
  if (isLoading) {
    return <div className="h-40 animate-pulse bg-raised md:h-56" />;
  }

  const game = currentGame ?? lastGame;

  if (!game) {
    return (
      <div className="border border-dashed border-line p-10 text-center text-sm text-ink-dim">
        Nothing to show yet. Sync your library to see your recent games.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative h-40 overflow-hidden border bg-raised md:h-56 ${
        currentGame ? 'border-accent glow' : 'border-line'
      }`}
    >
      <img
        src={headerImageUrl(game.appId)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-base via-base/70 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-6 md:p-8">
        <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {currentGame ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 bg-accent" />
              </span>
              Playing now
            </>
          ) : (
            <span className="text-ink-dim">Last played {timeAgo(game.lastPlayedAt)}</span>
          )}
        </p>
        <h3 className="text-2xl font-bold text-ink-bright md:text-4xl">{game.name}</h3>
      </div>
    </motion.div>
  );
}

export default NowPlaying;
