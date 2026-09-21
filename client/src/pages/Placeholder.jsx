import PageHeader from '../components/PageHeader';

function Placeholder({ title, subtitle }) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="border border-dashed border-line p-12 text-center text-sm text-ink-dim">
        Coming soon
      </div>
    </>
  );
}

export default Placeholder;
