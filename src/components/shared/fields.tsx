import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
export function Field({
  label,
  id,
  error,
  children,
}: {
  label: string
  id: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="field">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
export function SearchInput({
  value,
  onChange,
  placeholder = "Search",
  label = "Search",
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}) {
  return (
    <div className="relative min-w-48 flex-1">
      <Search className="absolute top-3 left-3 size-5 text-muted-foreground" />
      <Input
        aria-label={label}
        className="bg-card pl-10"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="field">
      <span className="text-xs text-muted-foreground">{label}</span>
      <select
        className="control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
export function DateRange({
  from,
  to,
  onFrom,
  onTo,
}: {
  from: string
  to: string
  onFrom: (v: string) => void
  onTo: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <label className="field">
        <span className="text-xs text-muted-foreground">From</span>
        <Input
          aria-label="From date"
          type="date"
          value={from}
          max={to || undefined}
          onChange={(e) => onFrom(e.target.value)}
        />
      </label>
      <label className="field">
        <span className="text-xs text-muted-foreground">To</span>
        <Input
          aria-label="To date"
          type="date"
          value={to}
          min={from || undefined}
          onChange={(e) => onTo(e.target.value)}
        />
      </label>
    </div>
  )
}
