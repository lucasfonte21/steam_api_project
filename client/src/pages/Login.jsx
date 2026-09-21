import { Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { API_URL } from '../lib/api';

function Login() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-base px-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm border border-line bg-surface p-10 text-center glow"
      >
        <h1 className="text-3xl font-bold tracking-wide text-ink-bright glow-text">
          STEAM<span className="text-accent">STATS</span>
        </h1>
        <p className="mt-3 text-sm text-ink-dim">
          Your playtime, ranked and remembered.
        </p>
        <a
          href={`${API_URL}/api/auth/steam`}
          className="mt-8 block bg-accent-strong px-4 py-3 text-sm font-semibold text-ink-bright transition-all duration-200 hover:bg-accent hover:glow"
        >
          Sign in with Steam
        </a>
      </motion.div>
    </div>
  );
}

export default Login;
