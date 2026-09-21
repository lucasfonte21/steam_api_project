function SectionTitle({ children, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-dim">
        {children}
      </h3>
      {action}
    </div>
  );
}

export default SectionTitle;
