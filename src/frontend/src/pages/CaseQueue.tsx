import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Scale, Search } from "lucide-react";
import { useMemo, useState } from "react";
import AddCaseDialog from "../components/AddCaseDialog";
import { useGetCases } from "../hooks/useQueries";
import { formatCurrency } from "../lib/formatters";

interface Props {
  onSelectCase: (caseId: string) => void;
}

const SKEL_ROWS = ["r1", "r2", "r3", "r4", "r5"];
const SKEL_CELLS = ["c1", "c2", "c3", "c4", "c5", "c6"];

type FilterTab =
  | "all"
  | "active"
  | "notice"
  | "litigation"
  | "enforcement"
  | "closed";

function getStatusBadge(status: string) {
  const s = status.toLowerCase();
  if (s.includes("litigation") || s.includes("trial"))
    return (
      <Badge className="bg-orange-100 text-orange-700 border-orange-300 border">
        {status}
      </Badge>
    );
  if (s === "active")
    return (
      <Badge className="bg-green-100 text-green-700 border-green-300 border">
        {status}
      </Badge>
    );
  if (s === "settled")
    return (
      <Badge className="bg-blue-100 text-blue-700 border-blue-300 border">
        {status}
      </Badge>
    );
  if (s.includes("judgment"))
    return (
      <Badge className="bg-purple-100 text-purple-700 border-purple-300 border">
        {status}
      </Badge>
    );
  return <Badge variant="outline">{status}</Badge>;
}

function getPriority(balance: number): "High" | "Medium" | "Low" {
  if (balance > 100000) return "High";
  if (balance >= 50000) return "Medium";
  return "Low";
}

export default function CaseQueue({ onSelectCase }: Props) {
  const { data: cases, isLoading } = useGetCases();
  const [addOpen, setAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const tabCounts = useMemo(() => {
    if (!cases)
      return {
        all: 0,
        active: 0,
        notice: 0,
        litigation: 0,
        enforcement: 0,
        closed: 0,
      };
    return {
      all: cases.length,
      active: cases.filter((c) => c.status === "Active").length,
      notice: cases.filter((c) => c.status.toLowerCase().includes("notice"))
        .length,
      litigation: cases.filter((c) =>
        c.status.toLowerCase().includes("litigation"),
      ).length,
      enforcement: cases.filter(
        (c) =>
          c.status === "Judgment Issued" ||
          c.status.toLowerCase().includes("enforcement"),
      ).length,
      closed: cases.filter((c) => c.status === "Settled").length,
    };
  }, [cases]);

  const filtered = useMemo(() => {
    if (!cases) return [];
    let result = cases;
    if (activeTab === "active")
      result = result.filter((c) => c.status === "Active");
    else if (activeTab === "notice")
      result = result.filter((c) => c.status.toLowerCase().includes("notice"));
    else if (activeTab === "litigation")
      result = result.filter((c) =>
        c.status.toLowerCase().includes("litigation"),
      );
    else if (activeTab === "enforcement")
      result = result.filter(
        (c) =>
          c.status === "Judgment Issued" ||
          c.status.toLowerCase().includes("enforcement"),
      );
    else if (activeTab === "closed")
      result = result.filter((c) => c.status === "Settled");
    if (statusFilter !== "all")
      result = result.filter((c) => c.status === statusFilter);
    if (priorityFilter !== "all")
      result = result.filter(
        (c) => getPriority(c.outstandingBalance) === priorityFilter,
      );
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      result = result.filter(
        (c) =>
          c.customerName.toLowerCase().includes(q) ||
          c.caseId.toLowerCase().includes(q) ||
          c.caseDescription.toLowerCase().includes(q) ||
          c.contractId.toLowerCase().includes(q),
      );
    }
    return result;
  }, [cases, activeTab, searchText, statusFilter, priorityFilter]);

  const TABS: { id: FilterTab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "notice", label: "Notice" },
    { id: "litigation", label: "Litigation" },
    { id: "enforcement", label: "Enforcement" },
    { id: "closed", label: "Closed" },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      <main className="flex-1 px-6 py-5">
        <div className="max-w-screen-2xl mx-auto">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 mb-4 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-gray-900 border border-gray-300 shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
                data-ocid="queue.tab"
              >
                {tab.label}
                <span
                  className={`text-xs font-mono ${activeTab === tab.id ? "text-gray-600" : "text-muted-foreground"}`}
                >
                  {tabCounts[tab.id]}
                </span>
              </button>
            ))}
          </div>

          {/* Search + Filters Row */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search debtor, account, firm..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9 bg-white border-border"
                data-ocid="queue.search_input"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className="w-[160px] bg-white border-border"
                data-ocid="queue.select"
              >
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="In Litigation">In Litigation</SelectItem>
                <SelectItem value="Judgment Issued">Judgment Issued</SelectItem>
                <SelectItem value="Settled">Settled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger
                className="w-[160px] bg-white border-border"
                data-ocid="queue.select"
              >
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold ml-auto"
              onClick={() => setAddOpen(true)}
              data-ocid="queue.primary_button"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Case
            </Button>
          </div>

          {/* Section Title */}
          <div className="mb-4">
            <h2 className="font-display font-bold text-lg text-foreground">
              Legal Queue
            </h2>
            <p className="text-sm text-muted-foreground">
              {filtered.length} legal {filtered.length === 1 ? "case" : "cases"}
            </p>
          </div>

          {/* Table — 6 columns */}
          <div className="rounded-lg border border-border bg-white overflow-hidden shadow-sm">
            <Table data-ocid="queue.table">
              <TableHeader>
                <TableRow className="border-b border-border bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider py-3">
                    Case ID
                  </TableHead>
                  <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider">
                    Customer Name
                  </TableHead>
                  <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider">
                    Product
                  </TableHead>
                  <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider text-right">
                    Outstanding
                  </TableHead>
                  <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider">
                    Assigned Agency
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
                {!isLoading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
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
                  filtered.map((c, idx) => (
                    <TableRow
                      key={c.caseId}
                      className="cursor-pointer hover:bg-muted/30 transition-colors border-b border-border/50"
                      onClick={() => onSelectCase(c.caseId)}
                      data-ocid={`queue.row.${idx + 1}`}
                    >
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        {c.caseId}
                      </TableCell>
                      <TableCell className="font-medium">
                        {c.customerName}
                      </TableCell>
                      <TableCell>{getStatusBadge(c.status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {c.productType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold text-sm">
                        {formatCurrency(c.outstandingBalance)}
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
