import Link from "next/link";
import Image from "next/image";
import { FiMapPin, FiBriefcase, FiExternalLink } from "react-icons/fi";
import { Employer } from "@/types";

export default function EmployerCard({ employer }: { employer: Employer }) {
  return (
    <div className="jj-card p-6 flex gap-6 items-start transition-shadow duration-200 hover:shadow-md hover:border-(--gold-glow)">
      <Link href={`/employers/${employer.id}`} className="shrink-0">
        <div className="w-16 h-16 rounded-(--radius-sm) overflow-hidden border border-(--border) bg-(--surface)">
          {employer.logo ? (
             <Image src={employer.logo} alt={employer.name} width={64} height={64} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-extrabold ">
               {employer.name.charAt(0)}
            </div>
          )}
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start flex-wrap gap-2 mb-1">
          <div>
            <Link href={`/employers/${employer.id}`} className="text-lg font-extrabold  no-underline hover:text-(--gold) transition-colors">
              {employer.name}
            </Link>
            <p className="text-[15px] font-medium text-(--text-muted)">{employer.industry}</p>
          </div>
          <span className="jj-pill bg-(--gold-muted) text-(--gold-hover) border-none">
            {employer.openJobs} Open {employer.openJobs === 1 ? "Job" : "Jobs"}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-(--text-muted) mt-3">
          <span className="flex items-center gap-1"><FiMapPin size={14} /> {employer.location}</span>
          <span className="flex items-center gap-1"><FiBriefcase size={14} /> {employer.employees} employees</span>
          <span>Est. {employer.founded}</span>
        </div>
      </div>
      <Link href={`/employers/${employer.id}`} className="jj-btn jj-btn--ghost px-4 py-2 text-sm shrink-0">
        View <FiExternalLink size={14} className="ml-1" />
      </Link>
    </div>
  );
}
