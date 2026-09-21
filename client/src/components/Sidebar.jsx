import { NavLink } from 'react-router-dom';
import { Trophy, LayoutGrid, User, Users, LogOut } from 'lucide-react';
import { API_URL } from '../lib/api';

const links = [
  { to: '/dashboard', label: 'Top Games', icon: Trophy },
  { to: '/library', label: 'Library', icon: LayoutGrid },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/friends', label: 'Friends', icon: Users },
];

const linkClass = ({ isActive }) =>
  [
    'flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200',
    'max-md:flex-col max-md:gap-1 max-md:flex-1 max-md:px-2 max-md:py-2 max-md:text-[11px]',
    isActive
      ? 'bg-raised text-accent border-l-2 border-accent glow max-md:border-l-0 max-md:border-t-2'
      : 'text-ink-dim border-l-2 border-transparent hover:text-ink-bright hover:bg-surface max-md:border-l-0 max-md:border-t-2',
  ].join(' ');

function Sidebar({ user }) {
  return (
    <aside className="fixed z-20 flex border-line bg-base md:inset-y-0 md:left-0 md:w-60 md:flex-col md:border-r max-md:inset-x-0 max-md:bottom-0 max-md:border-t">
      <div className="hidden px-6 py-7 md:block">
        <h1 className="text-lg font-bold tracking-wide text-ink-bright glow-text">
          STEAM<span className="text-accent">STATS</span>
        </h1>
      </div>

      <nav className="flex md:flex-1 md:flex-col max-md:w-full">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="hidden items-center gap-3 border-t border-line p-4 md:flex">
        <img src={user.avatarUrl} alt="" className="h-9 w-9" />
        <span className="flex-1 truncate text-sm text-ink-bright">
          {user.displayName}
        </span>
        <a
          href={`${API_URL}/api/auth/logout`}
          title="Log out"
          className="text-ink-dim transition-colors hover:text-accent"
        >
          <LogOut size={16} />
        </a>
      </div>
    </aside>
  );
}

export default Sidebar;
