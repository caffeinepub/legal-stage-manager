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
import {
  Calendar,
  Phone,
  Plus,
  Scale,
  Search,
  TrendingUp,
  TriangleAlert,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import AddCaseDialog from "../components/AddCaseDialog";
import { useGetCases } from "../hooks/useQueries";
import { formatCurrency } from "../lib/formatters";

interface Props {
  onSelectCase: (caseId: string) => void;
}

const SKEL_ROWS = ["r1", "r2", "r3", "r4", "r5"];
const SKEL_CELLS = ["c0", "c1", "c2", "c3", "c4", "c5", "c6"];

function getPriority(balance: number): "High" | "Medium" | "Low" {
  if (balance > 100000) return "High";
  if (balance >= 50000) return "Medium";
  return "Low";
}

const KPI_CARDS = [
  {
    label: "Calls Due",
    value: "1,201",
    target: "Target: 60",
    icon: Phone,
    barColor: "#3b82f6",
    barPct: 60,
  },
  {
    label: "PTPs Today",
    value: "1",
    target: "Target: 40",
    icon: Calendar,
    barColor: "#3b82f6",
    barPct: 3,
  },
  {
    label: "Broken Promises",
    value: "0",
    target: "Target: 20",
    icon: TriangleAlert,
    barColor: "#d1d5db",
    barPct: 0,
  },
  {
    label: "Recovered",
    value: "Ksh 0",
    target: "Target: 10,000",
    icon: TrendingUp,
    barColor: "#d1d5db",
    barPct: 0,
  },
];

export default function CaseQueue({ onSelectCase }: Props) {
  const { data: cases, isLoading } = useGetCases();
  const [addOpen, setAddOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filtered = useMemo(() => {
    if (!cases) return [];
    let result = cases;
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
  }, [cases, searchText, statusFilter, priorityFilter]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      <main className="flex-1 px-6 py-5">
        <div className="max-w-screen-2xl mx-auto">
          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4 mb-5">
            {KPI_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="bg-white border border-gray-200 rounded-md px-4 py-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {card.label}
                      </span>
                    </div>
                    <span className="text-sm text-gray-900">{card.value}</span>
                  </div>
                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-1 rounded-full transition-all"
                      style={{
                        width: `${card.barPct}%`,
                        backgroundColor: card.barColor,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5">
                    {card.target}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Active tab bar — Legal Queue */}
          <div
            className="flex items-center justify-between px-4 py-2.5 rounded-sm mb-5"
            style={{ backgroundColor: "#3d2000" }}
          >
            <span className="text-sm text-white">Legal Queue</span>
            <button
              type="button"
              className="flex items-center gap-0.5 text-orange-400 hover:text-orange-300 transition-colors"
              aria-label="Close tab"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search + Filters Row */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search debtor, account, firm..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9 bg-white border-gray-200"
                data-ocid="queue.search_input"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className="w-[160px] bg-white border-gray-200"
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
                className="w-[160px] bg-white border-gray-200"
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
              variant="outline"
              className="font-normal ml-auto border-gray-300 text-gray-700"
              onClick={() => setAddOpen(true)}
              data-ocid="queue.primary_button"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Case
            </Button>
          </div>

          {/* Section Title */}
          <div className="mb-4">
            <p className="text-xs text-gray-400">
              {filtered.length} legal {filtered.length === 1 ? "case" : "cases"}
            </p>
          </div>

          {/* Table — horizontal scroll, sticky actions column */}
          <div className="rounded border border-gray-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <Table
                data-ocid="queue.table"
                style={{ minWidth: "1260px", tableLayout: "fixed" }}
              >
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gray-50 hover:bg-gray-50">
                    <TableHead
                      className="sticky left-0 z-10 bg-gray-50 text-gray-400 text-xs font-normal py-3 border-r border-gray-200"
                      style={{
                        width: "120px",
                        minWidth: "120px",
                        boxShadow: "2px 0 4px rgba(0,0,0,0.06)",
                      }}
                    >
                      Actions
                    </TableHead>
                    <TableHead
                      className="text-gray-400 text-xs font-normal py-3"
                      style={{ minWidth: "180px" }}
                    >
                      Case ID
                    </TableHead>
                    <TableHead
                      className="text-gray-400 text-xs font-normal"
                      style={{ minWidth: "200px" }}
                    >
                      Customer Name
                    </TableHead>
                    <TableHead
                      className="text-gray-400 text-xs font-normal"
                      style={{ minWidth: "180px" }}
                    >
                      Status
                    </TableHead>
                    <TableHead
                      className="text-gray-400 text-xs font-normal"
                      style={{ minWidth: "180px" }}
                    >
                      Product
                    </TableHead>
                    <TableHead
                      className="text-gray-400 text-xs font-normal text-right"
                      style={{ minWidth: "180px" }}
                    >
                      Outstanding
                    </TableHead>
                    <TableHead
                      className="text-gray-400 text-xs font-normal"
                      style={{ minWidth: "200px" }}
                    >
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
                        colSpan={7}
                        className="text-center py-16"
                        data-ocid="queue.empty_state"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Scale className="w-8 h-8 text-gray-300" />
                          <p className="text-gray-400 text-sm">
                            No cases found
                          </p>
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
                        className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                        data-ocid={`queue.row.${idx + 1}`}
                      >
                        <TableCell
                          className="sticky left-0 z-10 bg-white border-r border-gray-100"
                          style={{
                            width: "120px",
                            minWidth: "120px",
                            boxShadow: "2px 0 4px rgba(0,0,0,0.06)",
                          }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs font-normal border-gray-200 text-gray-600 h-7 px-3"
                            onClick={() => onSelectCase(c.caseId)}
                            data-ocid={`queue.secondary_button.${idx + 1}`}
                          >
                            View Case
                          </Button>
                        </TableCell>
                        <TableCell className="text-xs text-gray-700 font-normal">
                          {c.caseId}
                        </TableCell>
                        <TableCell className="text-sm text-gray-800 font-normal">
                          {c.customerName}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700 font-normal">
                          {c.status}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700 font-normal">
                          {c.productType}
                        </TableCell>
                        <TableCell className="text-right text-sm text-gray-800 font-normal">
                          {formatCurrency(c.outstandingBalance)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 font-normal">
                          {c.assignedAgency}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
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
            className="hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <AddCaseDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
