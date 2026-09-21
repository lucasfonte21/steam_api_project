import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../hooks/useAuth';

function Layout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-svh bg-surface">
      <Sidebar user={user} />
      <main className="px-5 py-8 md:ml-60 md:px-10 max-md:pb-24">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}

export default Layout;
