import { useOutletContext } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import SectionTitle from '../components/SectionTitle';

function Placeholder({ className = '', children }) {
  return (
    <div
      className={`flex items-center justify-center border border-dashed border-line text-xs uppercase tracking-[0.18em] text-ink-dim ${className}`}
    >
      {children}
    </div>
  );
}

// Layout shell only. Data sections get wired in one at a time.
function Home() {
  const { user } = useOutletContext();

  return (
    <>
      <PageHeader title={`Welcome back, ${user.displayName}`} subtitle="Here's what's happening" />

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-10">
          <section>
            <SectionTitle>Now playing</SectionTitle>
            <Placeholder className="h-40 md:h-56">Coming soon</Placeholder>
          </section>

          <section>
            <SectionTitle>Recently played</SectionTitle>
            <Placeholder className="h-32">Coming soon</Placeholder>
          </section>

          <section>
            <SectionTitle>Top games</SectionTitle>
            <Placeholder className="h-64">Coming soon</Placeholder>
          </section>
        </div>

        <aside>
          <SectionTitle>Friend activity</SectionTitle>
          <Placeholder className="h-64">Coming soon</Placeholder>
        </aside>
      </div>
    </>
  );
}

export default Home;
