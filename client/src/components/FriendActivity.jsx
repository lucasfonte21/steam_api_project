import { timeAgo } from '../lib/format';

function statusOf(friend) {
  if (friend.game) {
    return { text: `Playing ${friend.game.name}`, className: 'text-accent' };
  }

  if (friend.isOnline) {
    return { text: 'Online', className: 'text-ink' };
  }

  return {
    text: friend.lastLogoff ? `Seen ${timeAgo(friend.lastLogoff)}` : 'Offline',
    className: 'text-ink-dim',
  };
}

function FriendActivity({ data, isLoading, isError }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-12 animate-pulse bg-raised" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-sm text-ink-dim">Could not load friend activity.</p>;
  }

  if (data.isPrivate) {
    return (
      <p className="border border-dashed border-line p-5 text-sm text-ink-dim">
        Your Steam friends list is private. Set it to public in Steam privacy
        settings to see friend activity here.
      </p>
    );
  }

  if (data.friends.length === 0) {
    return <p className="text-sm text-ink-dim">No friends to show yet.</p>;
  }

  return (
    <ul className="space-y-1">
      {data.friends.map((friend) => {
        const status = statusOf(friend);

        return (
          <li
            key={friend.steamId}
            className="flex items-center gap-3 p-2 transition-colors duration-200 hover:bg-raised"
          >
            <div className="relative shrink-0">
              <img
                src={friend.avatarUrl}
                alt=""
                className={`h-10 w-10 ${friend.isOnline || friend.game ? '' : 'opacity-50'}`}
              />
              {friend.game && (
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 border border-surface bg-accent glow" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink-bright">{friend.name}</p>
              <p className={`truncate text-xs ${status.className}`}>{status.text}</p>
            </div>
            {friend.onApp && (
              <span className="border border-line px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-ink-dim">
                On app
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default FriendActivity;
