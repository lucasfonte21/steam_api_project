import { ChevronDown } from 'lucide-react';

function Select({ value, onChange, options, label }) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full cursor-pointer appearance-none border border-line bg-base py-2 pl-3 pr-9 text-sm text-ink-bright outline-none transition-all duration-200 hover:border-accent focus:border-accent focus:glow"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-dim"
      />
    </label>
  );
}

export default Select;
