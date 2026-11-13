import { Check } from "lucide-react"

/** A titled group of filter options (e.g. "Job Type", "Category"). */
export function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-base font-semibold text-[#ededef]">{title}</h4>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}

/**
 * Option row with a label and a result count, styled to the Figma filter sidebar.
 * `type="radio"` makes the group single-select (same name = one choice at a time).
 * Uncontrolled on purpose — wire up `onChange` (or read the form data) when
 * implementing the actual filtering.
 */
export function FilterCheckbox({
  name,
  label,
  count,
  value,
  type = "checkbox",
  defaultChecked = false,
}: {
  name: string
  label: string
  count: number
  /** Submitted value; defaults to the label. */
  value?: string
  type?: "checkbox" | "radio"
  defaultChecked?: boolean
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type={type}
        name={name}
        value={value ?? label}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span className="flex size-[22px] shrink-0 items-center justify-center rounded-[4px] border border-white/10 bg-[#1a1a1f] transition-colors peer-checked:bg-white peer-checked:[&>svg]:opacity-100">
        <Check className="size-3.5 text-[#141418] opacity-0" />
      </span>
      <span className="text-[13px] font-medium text-[#a0a0ab] transition-colors peer-checked:text-[#ededef]">
        {label}
      </span>
      <span className="ml-auto text-xs text-[#6e6e78]">{count}</span>
    </label>
  )
}
