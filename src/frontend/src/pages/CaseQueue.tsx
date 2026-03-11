import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, RefreshCw, Scale } from "lucide-react";
import { useState } from "react";
import AddCaseDialog from "../components/AddCaseDialog";
import { useGetCases } from "../hooks/useQueries";
import { formatCurrency } from "../lib/formatters";

interface Props {
  onSelectCase: (caseId: string) => void;
}

const SKEL_ROWS = ["r1", "r2", "r3", "r4", "r5"];
const SKEL_CELLS = [
  "c1",
  "c2",
  "c3",
  "c4",
  "c5",
  "c6",
  "c7",
  "c8",
  "c9",
  "c10",
  "c11",
];

function getStatusBadge(status: string) {
  const s = status.toLowerCase();
  if (s.includes("litigation") || s.includes("trial"))
    return (
      <Badge className="bg-[oklch(0.6_0.22_18/0.2)] text-[oklch(0.82_0.18_25)] border-[oklch(0.6_0.22_18/0.4)] border">
        {status}
      </Badge>
    );
  if (s === "active")
    return (
      <Badge className="bg-[oklch(0.65_0.18_142/0.2)] text-[oklch(0.82_0.16_142)] border-[oklch(0.65_0.18_142/0.4)] border">
        {status}
      </Badge>
    );
  if (s === "settled")
    return (
      <Badge className="bg-[oklch(0.6_0.014_245/0.2)] text-[oklch(0.75_0.014_245)] border-[oklch(0.6_0.014_245/0.4)] border">
        {status}
      </Badge>
    );
  if (s.includes("judgment"))
    return (
      <Badge className="bg-[oklch(0.55_0.14_245/0.2)] text-[oklch(0.78_0.14_245)] border-[oklch(0.55_0.14_245/0.4)] border">
        {status}
      </Badge>
    );
  return <Badge variant="outline">{status}</Badge>;
}

export default function CaseQueue({ onSelectCase }: Props) {
  const { data: cases, isLoading, refetch } = useGetCases();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-[oklch(0.12_0.028_245)] px-6 py-4">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-foreground tracking-tight">
                Legal Stage Manager
              </h1>
              <p className="text-xs text-muted-foreground">
                Case Queue &amp; Recovery Tracking
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="text-muted-foreground hover:text-foreground"
              data-ocid="queue.secondary_button"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold"
              onClick={() => setAddOpen(true)}
              data-ocid="queue.primary_button"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Case
            </Button>
          </div>
        </div>
      </header>

      {/* Stats strip */}
      <div className="border-b border-border bg-card/40 px-6 py-3">
        <div className="max-w-screen-2xl mx-auto flex items-center gap-6 text-sm">
          <span className="text-muted-foreground">
            Total cases:{" "}
            <span className="text-foreground font-semibold">
              {cases?.length ?? "—"}
            </span>
          </span>
          <span className="text-muted-foreground">
            Active:{" "}
            <span className="text-[oklch(0.82_0.16_142)] font-semibold">
              {cases?.filter((c) => c.status === "Active").length ?? "—"}
            </span>
          </span>
          <span className="text-muted-foreground">
            In Litigation:{" "}
            <span className="text-[oklch(0.82_0.18_25)] font-semibold">
              {cases?.filter((c) =>
                c.status.toLowerCase().includes("litigation"),
              ).length ?? "—"}
            </span>
          </span>
        </div>
      </div>

      {/* Table */}
      <main className="flex-1 px-6 py-6">
        <div className="max-w-screen-2xl mx-auto">
          <div className="rounded-lg border border-border bg-card overflow-hidden shadow-card">
            <Table data-ocid="queue.table">
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider py-3">
                    Contract ID
                  </TableHead>
                  <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider">
                    Case ID
                  </TableHead>
                  <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider">
                    Description
                  </TableHead>
                  <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider">
                    Customer Name
                  </TableHead>
                  <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider">
                    Cust. No.
                  </TableHead>
                  <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider text-right">
                    Balance
                  </TableHead>
                  <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider">
                    Mobile
                  </TableHead>
                  <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider">
                    Omniflow No.
                  </TableHead>
                  <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider">
                    Product
                  </TableHead>
                  <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider">
                    Agency
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading &&
                  SKEL_ROWS.map((rowKey, idx) => (
                    <TableRow key={rowKey} data-ocid={`queue.row.${idx + 1}`}>
                      {SKEL_CELLS.map((cellKey) => (
                        <TableCell key={cellKey}>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                {!isLoading && (!cases || cases.length === 0) && (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      className="text-center py-16"
                      data-ocid="queue.empty_state"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Scale className="w-8 h-8 text-muted-foreground/40" />
                        <p className="text-muted-foreground">No cases found</p>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setAddOpen(true)}
                          data-ocid="queue.open_modal_button"
                        >
                          Add first case
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading &&
                  cases?.map((c, idx) => (
                    <TableRow
                      key={c.caseId}
                      className="cursor-pointer hover:bg-muted/30 transition-colors border-b border-border/50"
                      onClick={() => onSelectCase(c.caseId)}
                      data-ocid={`queue.row.${idx + 1}`}
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {c.contractId}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        {c.caseId}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <span
                          className="text-sm truncate block"
                          title={c.caseDescription}
                        >
                          {c.caseDescription}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(c.status)}</TableCell>
                      <TableCell className="font-medium">
                        {c.customerName}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {c.customerNumber}
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold text-sm">
                        {formatCurrency(c.outstandingBalance)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.mobileNumber}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {c.omniflowNumber}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {c.productType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.assignedAgency}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <AddCaseDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
