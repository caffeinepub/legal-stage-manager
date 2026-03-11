import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Calendar, Clock } from "lucide-react";
import {
  useGetCase,
  useGetLitigation,
  useGetNotices,
} from "../../hooks/useQueries";
import { formatCurrency, formatDate } from "../../lib/formatters";

interface Props {
  caseId: string;
}

const DATE_ASSIGNED_MAP: Record<string, string> = {
  "CASE-2024-001": "15 Aug 2024",
  "CASE-2024-002": "22 Jan 2024",
  "CASE-2024-003": "10 Mar 2024",
  "CASE-2024-004": "01 Jun 2024",
  "CASE-2024-005": "05 Sep 2023",
  "CASE-2024-006": "18 Nov 2023",
  "CASE-2024-007": "20 Sep 2024",
  "CASE-2024-008": "12 Oct 2024",
  "CASE-2024-009": "05 Oct 2024",
  "CASE-2024-010": "12 Jul 2024",
  "CASE-2025-011": "08 Jan 2025",
  "CASE-2025-012": "14 Feb 2025",
  "CASE-2025-013": "20 Feb 2025",
  "CASE-2025-014": "10 Feb 2025",
  "CASE-2025-015": "05 Mar 2025",
  "CASE-2025-016": "18 Jan 2025",
  "CASE-2025-017": "22 Mar 2025",
  "CASE-2025-018": "01 Mar 2025",
  "CASE-2025-019": "15 Mar 2025",
  "CASE-2025-020": "28 Feb 2025",
};

const LAST_UPDATED_MAP: Record<string, string> = {
  "CASE-2024-001": "10 Mar 2026",
  "CASE-2024-002": "05 Mar 2026",
  "CASE-2024-003": "01 Mar 2026",
  "CASE-2024-004": "15 Jan 2026",
  "CASE-2024-005": "20 Feb 2026",
  "CASE-2024-006": "08 Mar 2026",
  "CASE-2024-007": "08 Mar 2026",
  "CASE-2024-008": "06 Mar 2026",
  "CASE-2024-009": "07 Mar 2026",
  "CASE-2024-010": "03 Mar 2026",
  "CASE-2025-011": "09 Mar 2026",
  "CASE-2025-012": "10 Mar 2026",
  "CASE-2025-013": "28 Feb 2026",
  "CASE-2025-014": "09 Mar 2026",
  "CASE-2025-015": "07 Mar 2026",
  "CASE-2025-016": "05 Mar 2026",
  "CASE-2025-017": "06 Mar 2026",
  "CASE-2025-018": "08 Mar 2026",
  "CASE-2025-019": "07 Mar 2026",
  "CASE-2025-020": "04 Mar 2026",
};

const LOAN_AMOUNT_MAP: Record<string, number> = {
  "CASE-2024-001": 55000,
  "CASE-2024-002": 240000,
  "CASE-2024-003": 40000,
  "CASE-2024-004": 100000,
  "CASE-2024-005": 18000,
  "CASE-2024-006": 70000,
  "CASE-2024-007": 180000,
  "CASE-2024-008": 22000,
  "CASE-2024-009": 32000,
  "CASE-2024-010": 80000,
  "CASE-2025-011": 65000,
  "CASE-2025-012": 350000,
  "CASE-2025-013": 45000,
  "CASE-2025-014": 220000,
  "CASE-2025-015": 50000,
  "CASE-2025-016": 140000,
  "CASE-2025-017": 12000,
  "CASE-2025-018": 100000,
  "CASE-2025-019": 28000,
  "CASE-2025-020": 70000,
};

const DAYS_PAST_DUE_MAP: Record<string, number> = {
  "CASE-2024-001": 210,
  "CASE-2024-002": 85,
  "CASE-2024-003": 120,
  "CASE-2024-004": 480,
  "CASE-2024-005": 0,
  "CASE-2024-006": 110,
  "CASE-2024-007": 170,
  "CASE-2024-008": 60,
  "CASE-2024-009": 155,
  "CASE-2024-010": 240,
  "CASE-2025-011": 95,
  "CASE-2025-012": 75,
  "CASE-2025-013": 0,
  "CASE-2025-014": 130,
  "CASE-2025-015": 50,
  "CASE-2025-016": 310,
  "CASE-2025-017": 45,
  "CASE-2025-018": 88,
  "CASE-2025-019": 40,
  "CASE-2025-020": 260,
};

type TimelineEntry = {
  date: string;
  author: string;
  color: string;
  description: string;
};

const CASE_TIMELINE_MAP: Record<string, TimelineEntry[]> = {
  "CASE-2024-001": [
    {
      date: "05 Mar 2024",
      author: "Mwangi & Kariuki Advocates",
      color: "#f97316",
      description:
        "Asset discovery initiated — no significant assets confirmed yet",
    },
    {
      date: "15 Feb 2024",
      author: "Mwangi & Kariuki Advocates",
      color: "#ef4444",
      description: "Court summons filed at Nairobi High Court",
    },
    {
      date: "10 Feb 2024",
      author: "Legal Dept",
      color: "#eab308",
      description: "No response received. Final Notice issued.",
    },
    {
      date: "20 Jan 2024",
      author: "Legal Dept",
      color: "#eab308",
      description: "Letter Before Action issued",
    },
    {
      date: "16 Jan 2024",
      author: "Admin",
      color: "#a855f7",
      description: "Case assigned to Mwangi & Kariuki Advocates",
    },
  ],
  "CASE-2024-002": [
    {
      date: "01 Mar 2024",
      author: "Coulson Harney Advocates",
      color: "#f97316",
      description: "Formal demand letter served to debtor",
    },
    {
      date: "10 Feb 2024",
      author: "Legal Dept",
      color: "#eab308",
      description: "Mortgage arrears confirmed — 3 months overdue",
    },
    {
      date: "22 Jan 2024",
      author: "Admin",
      color: "#a855f7",
      description: "Case assigned to Coulson Harney Advocates",
    },
  ],
  "CASE-2024-003": [
    {
      date: "25 Mar 2024",
      author: "Hamilton Harrison & Mathews",
      color: "#f97316",
      description: "Debtor located — vehicle still in possession",
    },
    {
      date: "15 Mar 2024",
      author: "Legal Dept",
      color: "#eab308",
      description: "Final demand notice issued",
    },
    {
      date: "10 Mar 2024",
      author: "Admin",
      color: "#a855f7",
      description: "Case assigned to Hamilton Harrison & Mathews",
    },
  ],
  "CASE-2024-004": [
    {
      date: "15 Jan 2025",
      author: "Oraro & Company Advocates",
      color: "#22c55e",
      description: "Property lien enforcement initiated",
    },
    {
      date: "20 Nov 2024",
      author: "Nairobi High Court",
      color: "#ef4444",
      description: "Judgment issued — property lien granted",
    },
    {
      date: "10 Sep 2024",
      author: "Oraro & Company Advocates",
      color: "#f97316",
      description: "Court summons served",
    },
    {
      date: "01 Jun 2024",
      author: "Admin",
      color: "#a855f7",
      description: "Case assigned to Oraro & Company Advocates",
    },
  ],
  "CASE-2024-007": [
    {
      date: "20 Nov 2024",
      author: "Coulson Harney Advocates",
      color: "#f97316",
      description: "Company assets identified for recovery",
    },
    {
      date: "01 Nov 2024",
      author: "Coulson Harney Advocates",
      color: "#ef4444",
      description: "Court summons filed",
    },
    {
      date: "20 Sep 2024",
      author: "Admin",
      color: "#a855f7",
      description: "Case assigned to Coulson Harney Advocates",
    },
  ],
  "CASE-2025-014": [
    {
      date: "05 Mar 2025",
      author: "Hamilton Harrison & Mathews",
      color: "#f97316",
      description: "Import document dispute — legal review ongoing",
    },
    {
      date: "20 Feb 2025",
      author: "Hamilton Harrison & Mathews",
      color: "#ef4444",
      description: "Suit filed at Commercial Division, Nairobi",
    },
    {
      date: "10 Feb 2025",
      author: "Admin",
      color: "#a855f7",
      description: "Case assigned to Hamilton Harrison & Mathews",
    },
  ],
};

const DEFAULT_TIMELINE: TimelineEntry[] = [
  {
    date: "10 Mar 2026",
    author: "Legal Dept",
    color: "#f97316",
    description: "Case reviewed — escalation pending",
  },
  {
    date: "01 Feb 2026",
    author: "Legal Dept",
    color: "#eab308",
    description: "Demand notice issued to debtor",
  },
  {
    date: "15 Jan 2026",
    author: "Admin",
    color: "#a855f7",
    description: "Case assigned to legal team",
  },
];

function FieldRow({
  fields,
}: { fields: { label: string; value: string; mono?: boolean }[] }) {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-0 py-2 border-b border-gray-100 last:border-b-0">
      {fields.map((f) => (
        <div key={f.label}>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">
            {f.label}
          </p>
          <p className={`text-xs text-black ${f.mono ? "font-mono" : ""}`}>
            {f.value || "—"}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function OverviewTab({ caseId }: Props) {
  const { data: caseData, isLoading: caseLoading } = useGetCase(caseId);
  const { data: litigation } = useGetLitigation(caseId);
  const { data: notices } = useGetNotices(caseId);

  type DueDate = {
    label: string;
    courtName: string;
    date: bigint | undefined;
    type: "court" | "hearing" | "notice";
  };

  const baseDates: DueDate[] = [
    {
      label: "Mention Hearing",
      courtName: litigation?.courtName ?? "",
      date: litigation?.courtSummonsDate,
      type: "court",
    },
    {
      label: "Substantive Hearing",
      courtName: litigation?.courtName ?? "",
      date: litigation?.hearingDate,
      type: "hearing",
    },
  ];

  const noticeDates: DueDate[] = (notices ?? [])
    .filter((n) => n.noticeStatus === "active")
    .map((n) => ({
      label: `Notice Expiry — ${n.noticeId}`,
      courtName: "Notice",
      date: n.noticeExpiryDate,
      type: "notice" as const,
    }));

  const upcomingDates = [...baseDates, ...noticeDates]
    .filter((d) => d.date)
    .sort((a, b) => Number(a.date!) - Number(b.date!));

  const dateAssigned = DATE_ASSIGNED_MAP[caseId] ?? "01 Jan 2024";
  const lastUpdated = LAST_UPDATED_MAP[caseId] ?? "01 Mar 2026";
  const loanAmount = LOAN_AMOUNT_MAP[caseId] ?? 0;
  const daysPastDue = DAYS_PAST_DUE_MAP[caseId] ?? 0;
  const timeline = CASE_TIMELINE_MAP[caseId] ?? DEFAULT_TIMELINE;

  if (caseLoading) {
    return (
      <div className="space-y-2">
        {["a", "b"].map((k) => (
          <Skeleton key={k} className="h-20 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (!caseData) {
    return (
      <div
        className="flex items-center gap-2 text-muted-foreground"
        data-ocid="overview.error_state"
      >
        <AlertCircle className="w-4 h-4" />
        <span>Could not load case data</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Compact summary */}
      <div className="bg-white border border-gray-200 rounded-md px-3 py-1">
        <FieldRow
          fields={[
            { label: "Customer Name", value: caseData.customerName },
            { label: "Mobile Number", value: caseData.mobileNumber },
            {
              label: "Customer Number",
              value: caseData.customerNumber,
              mono: true,
            },
          ]}
        />
        <FieldRow
          fields={[
            { label: "Date Assigned", value: dateAssigned },
            { label: "Last Updated", value: lastUpdated },
            { label: "Product", value: caseData.productType ?? "—" },
          ]}
        />
        <FieldRow
          fields={[
            { label: "Loan Amount", value: formatCurrency(loanAmount) },
            {
              label: "Outstanding",
              value: formatCurrency(caseData.outstandingBalance),
            },
            {
              label: "Days Past Due",
              value: daysPastDue > 0 ? String(daysPastDue) : "—",
            },
          ]}
        />
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Upcoming Due Dates */}
        <Card className="bg-white border-border shadow-sm">
          <CardHeader className="pb-1 pt-3 px-4">
            <CardTitle className="flex items-center gap-2 text-sm font-normal">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span className="uppercase tracking-widest text-xs text-blue-600">
                Upcoming Due Dates
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-4 pb-3">
            {upcomingDates.length === 0 ? (
              <p
                className="text-xs text-muted-foreground py-4 text-center"
                data-ocid="overview.empty_state"
              >
                No upcoming due dates
              </p>
            ) : (
              <div>
                {upcomingDates.map((d, i) => (
                  <div key={`due-${d.label}`}>
                    {i > 0 && <Separator className="bg-border/40" />}
                    <div
                      className="flex items-center justify-between py-2"
                      data-ocid={`overview.item.${i + 1}`}
                    >
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-blue-600" />
                        <span className="text-xs text-black truncate">
                          {d.label}
                        </span>
                      </div>
                      <span
                        className="text-xs px-2 truncate flex-1 text-center hidden sm:block"
                        style={{ color: "#6b7fae" }}
                      >
                        {d.courtName}
                      </span>
                      <span className="text-xs flex-shrink-0 text-blue-600">
                        {formatDate(d.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Case Timeline */}
        <Card className="bg-white border-border shadow-sm">
          <CardHeader className="pb-1 pt-3 px-4 border-b border-border/50">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-widest">
              Case Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-4 pb-3">
            <div className="relative pl-5">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border/60" />
              <div className="space-y-3">
                {timeline.map((entry) => (
                  <div
                    key={`tl-${entry.date}-${entry.author}`}
                    className="relative flex flex-col gap-0.5"
                  >
                    <div
                      className="absolute -left-5 top-[4px] w-2.5 h-2.5 rounded-full flex-shrink-0 border-2 border-white"
                      style={{ backgroundColor: entry.color }}
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground">
                        {entry.date}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        ·
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {entry.author}
                      </span>
                    </div>
                    <p className="text-xs text-black leading-snug">
                      {entry.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
