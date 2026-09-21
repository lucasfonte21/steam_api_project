function PageHeader({ title, subtitle, children }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold text-ink-bright">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-ink-dim">{subtitle}</p>}
      </div>
      {children}
    </header>
  );
}

export default PageHeader;
