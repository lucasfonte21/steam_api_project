import { Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BarChart3, Gamepad2, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { API_URL } from '../lib/api';
import { headerImageUrl } from '../lib/format';

// Popular titles, used only as decorative background art.
const BACKDROP_APP_IDS = [
  730, 570, 1245620, 1145360, 413150, 1086940, 1091500, 367520, 620, 105600, 292030, 271590,
  1174180, 1938090, 440, 252490, 1868140, 553850, 400,
];

const features = [
  { icon: Gamepad2, text: 'See what you played, and what you keep coming back to' },
  { icon: BarChart3, text: 'Watch your playtime grow over weeks, months and years' },
  { icon: Users, text: 'Stack up against your Steam friends' },
];

function Login() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-base">
      <div className="absolute -inset-8 grid rotate-[-6deg] grid-cols-2 gap-3 opacity-25 sm:grid-cols-3 lg:grid-cols-5">
        {[...new Set(BACKDROP_APP_IDS)].map((appId, index) => (
          <motion.img
            key={appId}
            src={headerImageUrl(appId)}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: index * 0.05 }}
            className="aspect-[460/215] w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.visibility = 'hidden';
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-base via-base/80 to-base/50" />
      <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 bg-accent/20 blur-[120px]" />

      <div className="relative flex min-h-svh items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md border border-line bg-surface/90 p-8 backdrop-blur-md glow md:p-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Welcome
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-ink-bright">
            Your Steam life,{' '}
            <span className="text-accent glow-text">at a glance.</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-dim">
            Pull up a chair. Sign in and we'll gather your library into one cozy
            place to look back on.
          </p>

          <ul className="mt-6 space-y-3">
            {features.map(({ icon: Icon, text }, index) => (
              <motion.li
                key={text}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-3 text-sm text-ink"
              >
                <Icon size={16} className="mt-0.5 shrink-0 text-accent" />
                {text}
              </motion.li>
            ))}
          </ul>

          <a
            href={`${API_URL}/api/auth/steam`}
            className="mt-8 flex items-center justify-center gap-2 bg-accent-strong px-4 py-3.5 text-sm font-semibold text-ink-bright transition-all duration-200 hover:bg-accent hover:glow"
          >
            Sign in with Steam
          </a>
          <p className="mt-4 text-center text-xs text-ink-dim">
            We never see your password. Steam handles the sign in.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
