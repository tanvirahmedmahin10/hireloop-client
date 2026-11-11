"use client"
export interface JobPayload {
  title: string
  company: string
  category: string
  jobType: string
  location: string
  responsibilities: string
  qualifications: string
  isRemote: boolean
  deadline: string | null
  salary: {
    min: number | null
    max: number | null
    frequency: string // e.g. "per hour", "per month", "per year"
  }
}
import * as React from "react"
import Link from "next/link"
import {
  Building2,
  CalendarDays,
  ChevronRight,
  Globe2,
  MapPin,
  Plus,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createJobs } from "@/lib/job"

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"]
const categories = [
  "Engineering & Tech",
  "Design & Creative",
  "Product & Project",
  "Marketing & Growth",
  "Sales & Business",
  "Finance & Operations",
  "Customer Support",
  "Other",
]
const frequencies = ["per hour", "per month", "per year"]

const inputClass =
  "h-11 w-full rounded-[12px] border border-transparent bg-[#1e1e21] px-4 text-sm text-white shadow-none transition-colors outline-none placeholder:text-[#6e6e78] hover:bg-[#232327] focus-visible:border-[#5c53fe]/70 focus-visible:ring-[3px] focus-visible:ring-[#5c53fe]/20 user-invalid:border-[#f87171]/60 dark:bg-[#1e1e21]"

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[16px] bg-[#151516] p-6">
      <h2 className="flex items-center gap-3 text-base font-medium text-white">
        <span className="size-2 rounded-full bg-[#5c53fe]" />
        {step}. {title}
      </h2>
      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </section>
  )
}

function Field({
  label,
  hint,
  icon: Icon,
  className,
  ...props
}: React.ComponentProps<"input"> & { label: string; hint?: string; icon?: LucideIcon }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={props.id} className="gap-2 text-sm font-medium text-[#f4f4f5]">
          {label}
          {props.required ? <span aria-hidden className="text-[#8f88ff]">*</span> : null}
        </Label>
        {hint ? <span className="text-xs font-medium text-[#5a5a60]">{hint}</span> : null}
      </div>
      <div className="relative">
        {Icon ? (
          <Icon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#a0a0ab]" />
        ) : null}
        <Input className={cn(inputClass, Icon && "pl-11", className)} {...props} />
      </div>
    </div>
  )
}

export function NewJobForm() {
  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>

    const { minSalary, maxSalary, salaryFrequency, ...fields } = data
    const payload: JobPayload = {
  ...fields,
  isRemote: "isRemote" in data,
  deadline: data.deadline || null,
  salary: {
    min: minSalary ? Number(minSalary) : null,
    max: maxSalary ? Number(maxSalary) : null,
    frequency: salaryFrequency,
  },
} as JobPayload

    // TODO: POST `payload` to your API, e.g. fetch("/api/recruiter/jobs", ...)
    const result=await createJobs(payload)
    console.log(result)
  }

  return (
    <div className="mx-auto w-full max-w-[1080px] px-5 py-8 sm:px-8">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-white/[0.06] pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium">
            <Link
              href="/dashboard/recruiter/manage-jobs"
              className="text-[#a0a0ab] transition-colors hover:text-white"
            >
              Manage Jobs
            </Link>
            <ChevronRight className="size-3.5 text-[#5a5a60]" />
            <span aria-current="page" className="text-[#c3c0ff]">
              Create New Listing
            </span>
          </nav>
          <h1 className="mt-3 text-[28px] leading-tight font-medium text-white sm:text-[32px]">
            Post a New Job
          </h1>
          <p className="mt-1.5 max-w-xl text-[13px] text-[#a0a0ab]">
            Fill in the position specifications to attract qualified talent across our network.
          </p>
        </div>

        <button
          type="submit"
          form="new-job-form"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-[12px] bg-[#5c53fe] px-5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(92,83,254,0.9)] transition-colors outline-none hover:bg-[#6b63ff] focus-visible:ring-[3px] focus-visible:ring-[#5c53fe]/40"
        >
          <Plus className="size-4" />
          Publish Job
        </button>
      </div>

      <form id="new-job-form" onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
        {/* 1. Basic information */}
        <Section step={1} title="Basic Information">
          <Field id="title" name="title" label="Job Title" placeholder="Frontend Developer" required />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              id="company"
              name="company"
              label="Company Name"
              placeholder="HirePulse Network"
              icon={Building2}
              required
            />
            <div className="flex flex-col gap-2">
              <Label htmlFor="category" className="gap-2 text-sm font-medium text-[#f4f4f5]">
                Job Category <span aria-hidden className="text-[#8f88ff]">*</span>
              </Label>
              <Select name="category" defaultValue="Engineering & Tech">
                <SelectTrigger
                  id="category"
                  className={cn(inputClass, "justify-between data-placeholder:text-[#6e6e78] [&_svg]:text-[#a0a0ab]")}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border border-white/10 bg-[#1e1e21] text-[#ededef] ring-0">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="focus:bg-[#2c2c31] focus:text-white">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-medium text-[#f4f4f5]">
              Job Type <span aria-hidden className="text-[#8f88ff]">*</span>
            </legend>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {jobTypes.map((type) => (
                <label key={type} className="cursor-pointer">
                  <input
                    type="radio"
                    name="jobType"
                    value={type}
                    defaultChecked={type === "Full-time"}
                    className="peer sr-only"
                  />
                  <span className="flex h-11 items-center justify-center rounded-[12px] border border-transparent bg-[#1e1e21] text-sm font-normal text-[#a0a0ab] transition-colors select-none hover:bg-[#232327] peer-checked:border-[#5c53fe] peer-checked:bg-[#232327] peer-checked:font-medium peer-checked:text-white peer-focus-visible:ring-[3px] peer-focus-visible:ring-[#5c53fe]/30">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </Section>

        {/* 2. Location & compensation */}
        <Section step={2} title="Location, Compensation & Timeline">
          <div className="flex flex-col gap-4 rounded-[12px] border border-[#232327] bg-[#1e1e21] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[#232327]">
                <Globe2 className="size-4 text-[#c3c0ff]" />
              </span>
              <div>
                <p className="text-sm font-medium text-white">Remote Work Allowed (isRemote)</p>
                <p className="mt-0.5 text-[13px] text-[#a0a0ab]">
                  Enable worldwide or distributed candidate applications
                </p>
              </div>
            </div>
            <Switch
              name="isRemote"
              className="data-[size=default]:h-6 data-[size=default]:w-11 data-unchecked:bg-white/15 data-checked:bg-[#5c53fe] dark:data-unchecked:bg-white/15 dark:data-checked:bg-[#5c53fe] [&_[data-slot=switch-thumb]]:size-5 [&_[data-slot=switch-thumb]]:data-checked:translate-x-[22px]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              id="location"
              name="location"
              label="Job Location (location)"
              hint="Required"
              placeholder="New York, USA"
              icon={MapPin}
              required
            />
            <Field
              id="deadline"
              name="deadline"
              type="date"
              label="Application Deadline (deadline)"
              icon={CalendarDays}
              className="[color-scheme:dark]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field id="minSalary" name="minSalary" type="number" min={0} label="Min Salary / Rate" placeholder="25" icon={Wallet} />
            <Field id="maxSalary" name="maxSalary" type="number" min={0} label="Max Salary / Rate" placeholder="40" icon={Wallet} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="salaryFrequency" className="text-sm font-medium text-[#f4f4f5]">
                Frequency
              </Label>
              <Select name="salaryFrequency" defaultValue="per hour">
                <SelectTrigger
                  id="salaryFrequency"
                  className={cn(inputClass, "justify-between data-placeholder:text-[#6e6e78] [&_svg]:text-[#a0a0ab]")}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border border-white/10 bg-[#1e1e21] text-[#ededef] ring-0">
                  {frequencies.map((frequency) => (
                    <SelectItem key={frequency} value={frequency} className="focus:bg-[#2c2c31] focus:text-white">
                      {frequency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Section>

        {/* 3. Responsibilities & requirements */}
        <Section step={3} title="Responsibilities & Requirements">
          <div className="flex flex-col gap-2">
            <Label htmlFor="responsibilities" className="gap-2 text-sm font-medium text-[#f4f4f5]">
              Key Responsibilities <span aria-hidden className="text-[#8f88ff]">*</span>
            </Label>
            <Textarea
              id="responsibilities"
              name="responsibilities"
              required
              placeholder="Describe what this person will own day to day..."
              className={cn(inputClass, "min-h-[98px] resize-y py-3 leading-relaxed")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="qualifications" className="gap-2 text-sm font-medium text-[#f4f4f5]">
              Qualifications & Requirements <span aria-hidden className="text-[#8f88ff]">*</span>
            </Label>
            <Textarea
              id="qualifications"
              name="qualifications"
              required
              placeholder={"• 3+ years of experience with React and TypeScript\n• Strong eye for detail"}
              className={cn(inputClass, "min-h-[98px] resize-y py-3 leading-relaxed")}
            />
          </div>
        </Section>
      </form>
    </div>
  )
}
