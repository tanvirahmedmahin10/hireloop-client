'use client'
import Link from "next/link"
import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  CalendarDays,
  Clock3,
  MapPin,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import type { JobPayload } from "@/components/dashboard/new-job-form"
import { formatSalary } from "@/components/jobs/job-card"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { appliedJobs } from "@/lib/actions/applications"
import { applicationsDataCount } from "@/lib/application"
import { getUserPremiumById } from "@/lib/actions/payments"

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

/** Splits a newline-separated field (responsibilities/qualifications) into list items. */
const toList = (text: string) =>
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

function InfoCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#141418] p-6">
      <Icon className="size-5 text-[#c4c7c8]" />
      <p className="mt-4 text-[13px] font-medium uppercase text-[#a0a0ab]">{label}</p>
      <p className="mt-1 text-base font-semibold text-[#ededef]">{value}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-white/[0.06] pt-8 first:border-t-0 first:pt-0">
      <h3 className="text-[22px] font-semibold text-[#ededef]">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-[13px] text-[#a0a0ab]">Not specified.</p>
  }
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, index) => (
        <li key={index} className="flex gap-4 text-[13px] leading-relaxed text-[#a0a0ab]">
          <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-white" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function OverviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] py-4 first:pt-0 last:border-b-0 last:pb-0">
      <span className="text-[13px] uppercase text-[#a0a0ab]">{label}</span>
      <span className="text-right text-base text-[#ededef]">{value}</span>
    </div>
  )
}

/** Job details page body — renders any `JobPayload`, styled to the Figma "Public / Job Details" screen. */
export  function JobDetails ({ job }: { job: JobPayload }) {
  const {data:session}=authClient.useSession()
  const user=session?.user
  const route=useRouter()
  const handleApply=async()=>{
 if(!user){
  route.push(`/sign-in?redirectTo=/browse-jobs/${job._id}`)
  return
 }
 else if(user.role==='seeker'){
  const countResult=await applicationsDataCount(`applicantId=${user.id}`)
  const premiumResult=await getUserPremiumById(user.id)
  console.log(premiumResult);
  if(!premiumResult.premium && countResult.count>6){
   route.push('/payment')
   return
  }
  else{
   const application={
  jobId:job._id,
  userId:user.id,
  email:user.email,
  jobTitle:job.title,
  companyName:job.company,
  jobType:job.jobType,
  isRemote:job.isRemote
 }
 const result=await appliedJobs(application)

 if(result.acknowledged){
  console.log('success');
  route.push('/browse-jobs')
 }
  }

 }
 else{
  console.log('user not a job seeker');
 }
  }
  return (
    <div className="mx-auto w-full max-w-[1240px] px-5 pb-12 sm:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-white/[0.06] bg-[#141418] p-6">
        <span className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-[#1a1a1f] text-2xl font-semibold text-[#ededef]">
          {job.company.charAt(0).toUpperCase()}
        </span>

        <div className="min-w-0 flex-1">
          <h1 className="text-[32px] font-semibold leading-tight text-[#ededef]">{job.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="text-[22px] font-semibold text-[#a0a0ab]">{job.company}</span>
            <span aria-hidden className="size-1 rounded-full bg-[#8e9192]" />
            <span className="flex items-center gap-1.5 text-base font-semibold text-[#22c55e]">
              <BadgeCheck className="size-4" />
              Verified Employer
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            title="Save job"
            className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#222228] text-[#e5e2e3] transition-colors hover:bg-[#2c2c31]"
          >
            <Bookmark className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="h-12 rounded-lg bg-[#fafafa] px-6 text-base font-medium text-[#0b0b0c] transition-colors cursor-pointer hover:bg-white"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Bento info grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard icon={Wallet} label="Salary Range" value={formatSalary(job)} />
        <InfoCard icon={MapPin} label="Location" value={`${job.location}${job.isRemote ? " (Remote)" : ""}`} />
        <InfoCard icon={Clock3} label="Job Type" value={job.jobType} />
        <InfoCard
          icon={CalendarDays}
          label="Deadline"
          value={job.deadline ? formatDate(job.deadline) : "—"}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_397px]">
        {/* Content sections */}
        <div className="min-w-0 rounded-2xl border border-white/[0.06] bg-[#141418] p-8">
          <Section title="Responsibilities">
            <BulletList items={toList(job.responsibilities)} />
          </Section>
          <Section title="Qualifications">
            <BulletList items={toList(job.qualifications)} />
          </Section>
        </div>

        {/* Sidebar */}
        <aside className="h-fit rounded-2xl border border-white/[0.06] bg-[#141418] p-6">
          <h3 className="text-[22px] font-semibold text-[#ededef]">Job Overview</h3>
          <div className="mt-6">
            <OverviewRow label="Category" value={job.category} />
            <OverviewRow label="Job Type" value={job.jobType} />
            <OverviewRow label="Work Mode" value={job.isRemote ? "Remote" : "On-site"} />
            <OverviewRow label="Deadline" value={job.deadline ? formatDate(job.deadline) : "—"} />
            <OverviewRow label="Salary Range" value={formatSalary(job)} />
          </div>
          <Link
            href="/browse-jobs"
            className="mt-6 flex h-11 items-center justify-center gap-2 rounded-[10px] bg-white text-[13px] font-medium text-[#0b0b0c] transition-colors hover:bg-[#e5e2e3]"
          >
            <ArrowLeft className="size-4" />
            Back to Jobs
          </Link>
        </aside>
      </div>
    </div>
  )
}
