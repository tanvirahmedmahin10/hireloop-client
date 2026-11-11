"use client"

import { Lock, Mail, User, Eye, EyeOff, type LucideIcon } from "lucide-react"
import { useId, useState, type ComponentProps, type ComponentPropsWithoutRef, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type FieldIcon = LucideIcon

function FieldShell({
  id,
  label,
  icon: Icon,
  trailing,
  inputClassName,
  ...inputProps
}: Omit<ComponentProps<"input">, "className"> & {
  label: ReactNode
  icon: FieldIcon
  trailing?: ReactNode
  inputClassName?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-inter text-sm text-[#A0A0AB]">
        {label}
      </label>
      <div className="group relative flex items-center">
        <span className="pointer-events-none absolute left-3.5 flex" aria-hidden>
          <Icon className="size-[18px] shrink-0 text-[#6E6E78]" />
        </span>
        <input
          id={id}
          className={cn(
            "h-12 w-full rounded-xl border border-white/10 bg-[#0C0C0F] pr-3.5 pl-11 font-inter text-[15px] text-[#EDEDEF] transition-colors outline-none placeholder:text-[#6E6E78] hover:border-white/15 focus-visible:border-[#8F88FF]/70 focus-visible:ring-[3px] focus-visible:ring-[#5C53FE]/25",
            inputClassName
          )}
          {...inputProps}
        />
        {trailing ? <span className="absolute right-2 flex items-center">{trailing}</span> : null}
      </div>
    </div>
  )
}

export function AuthEmailInput({
  label = "Email",
  ...props
}: Omit<ComponentProps<"input">, "className"> & { label?: ReactNode }) {
  const id = useId()
  return <FieldShell id={id} label={label} icon={Mail} type="email" autoComplete="email" {...props} />
}

export function AuthNameInput({
  label = "Full name",
  ...props
}: Omit<ComponentProps<"input">, "className"> & { label?: ReactNode }) {
  const id = useId()
  return <FieldShell id={id} label={label} icon={User} type="text" autoComplete="name" {...props} />
}

export function AuthPasswordInput({
  label = "Password",
  isNew = false,
  inputClassName,
  ...props
}: Omit<ComponentProps<"input">, "className" | "type"> & {
  isNew?: boolean
  label?: ReactNode
  inputClassName?: string
}) {
  const id = useId()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <FieldShell
      id={id}
      label={label}
      icon={Lock}
      type={showPassword ? "text" : "password"}
      autoComplete={isNew ? "new-password" : "current-password"}
      inputClassName={cn("pr-12", inputClassName)}
      trailing={
        <button
          type="button"
          onClick={() => setShowPassword((visible) => !visible)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="flex h-8 w-8 items-center justify-center rounded-md text-[#6E6E78] transition-colors hover:text-[#A0A0AB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5C53FE]"
        >
          {showPassword ? <EyeOff className="size-[18px]" aria-hidden /> : <Eye className="size-[18px]" aria-hidden />}
        </button>
      }
      {...props}
    />
  )
}

export function AuthCheckbox({
  label,
  className,
  ...props
}: Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  label: ReactNode
  className?: string
}) {
  const id = useId()

  return (
    <label htmlFor={id} className={cn("flex cursor-pointer items-center gap-2", className)}>
      <input
        id={id}
        type="checkbox"
        className="size-4 shrink-0 cursor-pointer appearance-none rounded-[5px] border border-white/20 bg-[#0C0C0F] transition-colors checked:border-none checked:bg-[#5C53FE] hover:not-checked:border-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5C53FE] max-[400px]:sr-only"
        {...props}
      />
      <span className="font-inter text-sm text-[#A0A0AB]">{label}</span>
    </label>
  )
}
