import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  User,
} from "lucide-react";
import {
  useGetCase,
  useGetLitigation,
  useGetNotices,
} from "../../hooks/useQueries";
import { formatCurrency, formatDate } from "../../lib/formatters";

interface Props {
  caseId: string;
}

const DATE_OPENED_MAP: Record<string, string> = {
  "CASE-2024-001": "15 Aug 2024",
  "CASE-2024-002": "22 Jan 2024",
  "CASE-2024-003": "10 Mar 2024",
  "CASE-2024-004": "01 Jun 2024",
  "CASE-2024-005": "05 Sep 2023",
  "CASE-2024-006": "18 Nov 2023",
};

const LAST_UPDATED_MAP: Record<string, string> = {
  "CASE-2024-001": "10 Mar 2026",
  "CASE-2024-002": "05 Mar 2026",
  "CASE-2024-003": "01 Mar 2026",
  "CASE-2024-004": "15 Jan 2026",
  "CASE-2024-005": "20 Feb 2026",
  "CASE-2024-006": "08 Mar 2026",
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground uppercase tracking-wide font-display font-semibold">
        {label}
      </span>
      <span className="text-sm text-foreground">{value || "—"}</span>
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

  const dateOpened = DATE_OPENED_MAP[caseId] ?? "01 Jan 2024";
  const lastUpdated = LAST_UPDATED_MAP[caseId] ?? "01 Mar 2026";

  if (caseLoading) {
    return (
      <div className="grid grid-cols-3 gap-5">
        {["card-a", "card-b", "card-c"].map((key) => (
          <Card key={key} className="bg-card border-border">
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
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
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Contact Information */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader className="pb-2 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-sm font-display font-bold text-foreground">
              <User className="w-4 h-4 text-primary" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <InfoRow label="Customer Name" value={caseData.customerName} />
            <InfoRow label="Mobile Number" value={caseData.mobileNumber} />
            <InfoRow
              label="Customer Number"
              value={
                <span className="font-mono text-xs">
                  {caseData.customerNumber}
                </span>
              }
            />
          </CardContent>
        </Card>

        {/* Case Details — restructured */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader className="pb-2 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-sm font-display font-bold text-foreground">
              <FileText className="w-4 h-4 text-primary" />
              Case Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-4">
            {/* Row 1: Case Type | Case Description */}
            <div className="grid grid-cols-2 gap-4 pb-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-display font-semibold mb-1">
                  Case Type
                </p>
                <p className="text-sm text-foreground">
                  {caseData.productType}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-display font-semibold mb-1">
                  Case Description
                </p>
                <p className="text-sm text-foreground leading-snug">
                  {caseData.caseDescription}
                </p>
              </div>
            </div>

            <Separator className="my-1 bg-border/60" />

            {/* Row 2: Date Opened | Last Updated */}
            <div className="grid grid-cols-2 gap-4 pt-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-display font-semibold mb-1">
                  Date Opened
                </p>
                <p className="text-sm text-foreground">{dateOpened}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-display font-semibold mb-1">
                  Last Updated
                </p>
                <p className="text-sm text-foreground">{lastUpdated}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan Summary */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader className="pb-2 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-sm font-display font-bold text-foreground">
              <CreditCard className="w-4 h-4 text-primary" />
              Loan Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="py-4 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-display font-semibold mb-1">
                Outstanding Balance
              </p>
              <p className="text-3xl font-display font-bold text-primary">
                {formatCurrency(caseData.outstandingBalance)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Upcoming Due Dates */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-display font-bold">
              <Clock
                className="w-4 h-4"
                style={{ color: "oklch(0.75 0.18 65)" }}
              />
              <span
                className="uppercase tracking-widest text-xs font-bold"
                style={{ color: "oklch(0.75 0.18 65)" }}
              >
                Upcoming Due Dates
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {upcomingDates.length === 0 ? (
              <p
                className="text-sm text-muted-foreground py-6 text-center"
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
                      className="flex items-center justify-between py-3"
                      data-ocid={`overview.item.${i + 1}`}
                    >
                      {/* Left: icon + event name */}
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Calendar
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: "oklch(0.75 0.18 65)" }}
                        />
                        <span className="text-sm font-semibold text-foreground truncate">
                          {d.label}
                        </span>
                      </div>
                      {/* Center: court name */}
                      <span
                        className="text-xs px-3 truncate flex-1 text-center hidden sm:block"
                        style={{ color: "oklch(0.6 0.08 245)" }}
                      >
                        {d.courtName}
                      </span>
                      {/* Right: date */}
                      <span
                        className="text-sm font-bold flex-shrink-0"
                        style={{ color: "oklch(0.75 0.18 65)" }}
                      >
                        {formatDate(d.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Case Updates */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader className="pb-2 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-sm font-display font-bold text-foreground">
              <FileText className="w-4 h-4 text-primary" />
              Case Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="space-y-3">
              <div className="p-3 rounded-md bg-muted/40 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-display font-semibold mb-1">
                  Current Status
                </p>
                <p className="text-sm font-medium text-foreground">
                  {caseData.status}
                </p>
              </div>
              <div className="p-3 rounded-md bg-muted/40 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-display font-semibold mb-1">
                  Case Summary
                </p>
                <p className="text-sm text-foreground">
                  {caseData.caseDescription}
                </p>
              </div>
              <div className="p-3 rounded-md bg-muted/40 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-display font-semibold mb-1">
                  Assigned Agency
                </p>
                <p className="text-sm text-foreground">
                  {caseData.assignedAgency || "Not assigned"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
