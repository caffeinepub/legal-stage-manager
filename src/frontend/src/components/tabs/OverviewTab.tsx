import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  CalendarClock,
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
    date: bigint | undefined;
    type: "court" | "hearing" | "notice";
  };
  const baseDates: DueDate[] = [
    {
      label: "Court Summons",
      date: litigation?.courtSummonsDate,
      type: "court",
    },
    { label: "Hearing Date", date: litigation?.hearingDate, type: "hearing" },
  ];
  const noticeDates: DueDate[] = (notices ?? [])
    .filter((n) => n.noticeStatus === "active")
    .map((n) => ({
      label: `Notice Expiry — ${n.noticeId}`,
      date: n.noticeExpiryDate,
      type: "notice" as const,
    }));
  const upcomingDates = [...baseDates, ...noticeDates]
    .filter((d) => d.date)
    .sort((a, b) => Number(a.date!) - Number(b.date!));

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

        {/* Case Details */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader className="pb-2 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-sm font-display font-bold text-foreground">
              <FileText className="w-4 h-4 text-primary" />
              Case Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <InfoRow
              label="Case ID"
              value={
                <span className="font-mono text-xs text-primary">
                  {caseData.caseId}
                </span>
              }
            />
            <InfoRow
              label="Contract ID"
              value={
                <span className="font-mono text-xs">{caseData.contractId}</span>
              }
            />
            <InfoRow label="Product Type" value={caseData.productType} />
            <InfoRow label="Assigned Agency" value={caseData.assignedAgency} />
            <InfoRow
              label="Omniflow No."
              value={
                <span className="font-mono text-xs">
                  {caseData.omniflowNumber}
                </span>
              }
            />
            <InfoRow label="Description" value={caseData.caseDescription} />
            <InfoRow label="Status" value={caseData.status} />
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
          <CardHeader className="pb-2 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-sm font-display font-bold text-foreground">
              <CalendarClock className="w-4 h-4 text-primary" />
              Upcoming Due Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            {upcomingDates.length === 0 ? (
              <p
                className="text-sm text-muted-foreground py-4 text-center"
                data-ocid="overview.empty_state"
              >
                No upcoming due dates
              </p>
            ) : (
              <div className="space-y-1">
                {upcomingDates.map((d, i) => (
                  <div
                    key={`due-${d.label}`}
                    className="flex items-center justify-between py-2 border-b border-border/40 last:border-0"
                    data-ocid={`overview.item.${i + 1}`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          d.type === "court"
                            ? "bg-[oklch(0.82_0.18_25)]"
                            : d.type === "hearing"
                              ? "bg-[oklch(0.78_0.14_245)]"
                              : "bg-[oklch(0.82_0.13_78)]"
                        }`}
                      />
                      <span className="text-sm text-foreground">{d.label}</span>
                    </div>
                    <span className="text-sm font-mono text-muted-foreground">
                      {formatDate(d.date)}
                    </span>
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
