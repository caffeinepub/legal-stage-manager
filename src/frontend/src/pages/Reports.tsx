import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { NoticeStatus } from "../backend.d";
import {
  sampleCases,
  sampleEnforcement,
  sampleLitigation,
  sampleNotices,
} from "../data/sampleData";
import { formatCurrency, formatDate } from "../lib/formatters";

type ReportTab = "legal" | "compliance" | "recovery";

const TABS: { key: ReportTab; label: string }[] = [
  { key: "legal", label: "Legal Progress" },
  { key: "compliance", label: "Compliance" },
  { key: "recovery", label: "Recovery Performance" },
];

const GRAY = ["#374151", "#6b7280", "#9ca3af", "#d1d5db"];

const PRIORITY_THRESHOLD = 500000;
const isPriority = (balance: number) => balance > PRIORITY_THRESHOLD;

function getNextLegalAction(
  litStatus: string | undefined,
  caseStatus: string,
): string {
  switch (litStatus) {
    case "filed":
      return "Attend First Hearing";
    case "awaitingHearing":
      return "Attend Scheduled Hearing";
    case "inTrial":
      return "File Submissions";
    case "judgementIssued":
      return "Enforce Judgment";
    default:
      if (caseStatus === "Judgment Issued") return "Enforce Judgment";
      return "File Suit";
  }
}

function getLitigationStatusLabel(litStatus: string | undefined): string {
  switch (litStatus) {
    case "filed":
      return "Filed";
    case "awaitingHearing":
      return "Awaiting Hearing";
    case "inTrial":
      return "In Trial";
    case "judgementIssued":
      return "Judgment Issued";
    default:
      return "—";
  }
}

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-md px-4 py-3 flex flex-col gap-0.5">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xl font-semibold text-gray-900">{value}</span>
    </div>
  );
}

/* ─── Tab 1: Legal Progress ─────────────────────────────────── */
function LegalProgressTab() {
  const totalCases = sampleCases.length;
  const inLitigation = sampleCases.filter(
    (c) => c.status === "In Litigation",
  ).length;
  const judgmentsIssued = sampleCases.filter(
    (c) => c.status === "Judgment Issued",
  ).length;
  const priorityCases = sampleCases.filter((c) =>
    isPriority(c.outstandingBalance),
  );

  // Build sorted table rows: priority first, then by balance desc
  const tableRows = [...sampleCases]
    .sort((a, b) => {
      const aPrio = isPriority(a.outstandingBalance) ? 1 : 0;
      const bPrio = isPriority(b.outstandingBalance) ? 1 : 0;
      if (bPrio !== aPrio) return bPrio - aPrio;
      return b.outstandingBalance - a.outstandingBalance;
    })
    .map((c) => {
      const lit = sampleLitigation[c.caseId];
      const litStatusKey = lit?.caseStatus
        ? String(Object.keys(lit.caseStatus)[0])
        : undefined;
      return {
        caseId: c.caseId,
        customerName: c.customerName,
        claimAmount: c.outstandingBalance,
        legalStage: c.status,
        litigationStatus: getLitigationStatusLabel(litStatusKey),
        judgmentIssued: c.status === "Judgment Issued" ? "Yes" : "No",
        latestUpdate:
          c.caseDescription.length > 50
            ? `${c.caseDescription.slice(0, 50)}…`
            : c.caseDescription,
        nextLegalAction: getNextLegalAction(litStatusKey, c.status),
        priority: isPriority(c.outstandingBalance),
      };
    });

  return (
    <div className="space-y-5" data-ocid="reports.legal.section">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3">
        <KpiCard label="Total in Legal" value={totalCases} />
        <KpiCard label="In Litigation" value={inLitigation} />
        <KpiCard label="Judgments Issued" value={judgmentsIssued} />
        <KpiCard label="Priority Cases" value={priorityCases.length} />
      </div>

      {/* Priority Accounts Section */}
      {priorityCases.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-700">
              Priority Accounts
            </span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-semibold">
              {priorityCases.length}
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {priorityCases
              .sort((a, b) => b.outstandingBalance - a.outstandingBalance)
              .map((c, i) => {
                const lit = sampleLitigation[c.caseId];
                const litStatusKey = lit?.caseStatus
                  ? String(Object.keys(lit.caseStatus)[0])
                  : undefined;
                const nextAction = getNextLegalAction(litStatusKey, c.status);
                const latestUpdate =
                  c.caseDescription.length > 60
                    ? `${c.caseDescription.slice(0, 60)}…`
                    : c.caseDescription;
                return (
                  <div
                    key={c.caseId}
                    className="flex items-start gap-4 px-4 py-2.5 border-l-2 border-gray-800 hover:bg-gray-50 transition-colors"
                    data-ocid={`reports.legal.priority.item.${i + 1}`}
                  >
                    <div className="min-w-[80px]">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Legal ID
                      </p>
                      <p className="text-xs font-mono text-gray-800">
                        {c.caseId}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Customer
                      </p>
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {c.customerName}
                      </p>
                    </div>
                    <div className="min-w-[120px] text-right">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Claim Amount
                      </p>
                      <p className="text-xs font-semibold text-gray-900">
                        {formatCurrency(c.outstandingBalance)}
                      </p>
                    </div>
                    <div className="min-w-[110px]">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Stage
                      </p>
                      <p className="text-xs text-gray-700">{c.status}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Latest Update
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {latestUpdate}
                      </p>
                    </div>
                    <div className="min-w-[150px]">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Next Action
                      </p>
                      <p className="text-xs text-gray-700">{nextAction}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* All Accounts Table */}
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-2">
          All Accounts in Legal
        </p>
        <div className="rounded border border-gray-200 bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-xs font-semibold text-gray-600 py-2 whitespace-nowrap">
                  Legal ID
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-600 py-2 whitespace-nowrap">
                  Customer Name
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-600 py-2 whitespace-nowrap text-right">
                  Claim Amount
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-600 py-2 whitespace-nowrap">
                  Legal Stage
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-600 py-2 whitespace-nowrap">
                  Litigation Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-600 py-2 whitespace-nowrap">
                  Judgment Issued
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-600 py-2">
                  Latest Update
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-600 py-2 whitespace-nowrap">
                  Next Legal Action
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-600 py-2 whitespace-nowrap">
                  Priority
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableRows.map((row, i) => (
                <TableRow
                  key={row.caseId}
                  className={[
                    "hover:bg-gray-50 transition-colors",
                    row.priority
                      ? "border-l-2 border-l-gray-800 bg-gray-50/60"
                      : "",
                  ].join(" ")}
                  data-ocid={`reports.legal.item.${i + 1}`}
                >
                  <TableCell className="text-xs py-1.5 font-mono whitespace-nowrap">
                    {row.caseId}
                  </TableCell>
                  <TableCell className="text-xs py-1.5 whitespace-nowrap">
                    {row.customerName}
                  </TableCell>
                  <TableCell className="text-xs py-1.5 text-right font-medium whitespace-nowrap">
                    {formatCurrency(row.claimAmount)}
                  </TableCell>
                  <TableCell className="text-xs py-1.5 whitespace-nowrap">
                    {row.legalStage}
                  </TableCell>
                  <TableCell className="text-xs py-1.5 whitespace-nowrap">
                    {row.litigationStatus}
                  </TableCell>
                  <TableCell className="text-xs py-1.5 whitespace-nowrap">
                    {row.judgmentIssued}
                  </TableCell>
                  <TableCell className="text-xs py-1.5 max-w-[200px] truncate">
                    {row.latestUpdate}
                  </TableCell>
                  <TableCell className="text-xs py-1.5 whitespace-nowrap">
                    {row.nextLegalAction}
                  </TableCell>
                  <TableCell className="text-xs py-1.5">
                    {row.priority ? (
                      <span className="inline-block px-2 py-0.5 text-[10px] border border-gray-400 rounded-sm text-gray-600">
                        Priority
                      </span>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

/* ─── Tab 2: Compliance ─────────────────────────────────────── */
function ComplianceTab() {
  const allNotices = Object.values(sampleNotices).flat();
  const activeNotices = allNotices.filter(
    (n) => n.noticeStatus === NoticeStatus.active,
  );
  const expiredNotices = allNotices.filter(
    (n) => n.noticeStatus !== NoticeStatus.active,
  );

  const now = Date.now();
  const in30Days = now + 30 * 24 * 60 * 60 * 1000;
  const expiringWithin30 = activeNotices.filter((n) => {
    const expiry = Number(n.noticeExpiryDate) / 1_000_000;
    return expiry > now && expiry <= in30Days;
  }).length;

  const overdueActions = sampleCases.filter((c) => {
    if (c.status !== "Active" && c.status !== "In Litigation") return false;
    const lit = sampleLitigation[c.caseId];
    if (!lit?.courtSummonsDate) return false;
    return Number(lit.courtSummonsDate) / 1_000_000 < now;
  }).length;

  const pieData = [
    { name: "Active", value: activeNotices.length || 1 },
    { name: "Expired / Complied", value: expiredNotices.length || 1 },
  ];

  const noticeTypeLabel: Record<string, string> = {
    firstDemand: "1st Demand Notice",
    finalDemand: "Final Demand Notice",
    statutory: "Statutory Notice",
  };

  const tableRows = allNotices
    .map((n) => {
      const c = sampleCases.find((x) => x.caseId === n.caseId);
      return {
        caseId: n.caseId,
        customerName: c?.customerName ?? "—",
        noticeType:
          noticeTypeLabel[String(Object.keys(n.noticeType)[0])] ??
          String(Object.keys(n.noticeType)[0]),
        sentDate: formatDate(n.noticeSentDate),
        expiryDate: formatDate(n.noticeExpiryDate),
        deliveryStatus: n.deliveryStatus,
        noticeStatus: String(Object.keys(n.noticeStatus)[0]),
      };
    })
    .sort((a, b) => b.sentDate.localeCompare(a.sentDate));

  return (
    <div className="space-y-5">
      <div
        className="grid grid-cols-4 gap-3"
        data-ocid="reports.compliance.section"
      >
        <KpiCard label="Active Notices" value={activeNotices.length} />
        <KpiCard label="Expired / Complied" value={expiredNotices.length} />
        <KpiCard label="Expiring within 30 Days" value={expiringWithin30} />
        <KpiCard label="Overdue Actions" value={overdueActions} />
      </div>

      <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-col items-center">
        <p className="text-xs font-semibold text-gray-700 mb-3 self-start">
          Notice Status Distribution
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} (${Math.round((percent ?? 0) * 100)}%)`
              }
              labelLine={false}
            >
              {pieData.map((entry, idx) => (
                <Cell key={entry.name} fill={GRAY[idx % GRAY.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 4,
                border: "1px solid #e5e7eb",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded border border-gray-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-xs font-semibold text-gray-600 py-2">
                Case ID
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-600 py-2">
                Customer Name
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-600 py-2">
                Notice Type
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-600 py-2">
                Sent Date
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-600 py-2">
                Expiry Date
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-600 py-2">
                Delivery Status
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-600 py-2">
                Notice Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows.length === 0 ? (
              <TableRow data-ocid="reports.compliance.empty_state">
                <TableCell
                  colSpan={7}
                  className="text-xs text-gray-400 text-center py-6"
                >
                  No notices on record.
                </TableCell>
              </TableRow>
            ) : (
              tableRows.map((row, i) => (
                <TableRow
                  key={`${row.caseId}-${i}`}
                  className="hover:bg-gray-50"
                  data-ocid={`reports.compliance.item.${i + 1}`}
                >
                  <TableCell className="text-xs py-1.5 font-mono">
                    {row.caseId}
                  </TableCell>
                  <TableCell className="text-xs py-1.5">
                    {row.customerName}
                  </TableCell>
                  <TableCell className="text-xs py-1.5">
                    {row.noticeType}
                  </TableCell>
                  <TableCell className="text-xs py-1.5">
                    {row.sentDate}
                  </TableCell>
                  <TableCell className="text-xs py-1.5">
                    {row.expiryDate}
                  </TableCell>
                  <TableCell className="text-xs py-1.5">
                    {row.deliveryStatus}
                  </TableCell>
                  <TableCell className="text-xs py-1.5 capitalize">
                    {row.noticeStatus}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* ─── Tab 3: Recovery Performance ───────────────────────────── */
function RecoveryTab() {
  const totalClaim = sampleCases.reduce(
    (sum, c) => sum + c.outstandingBalance,
    0,
  );
  const totalFiled = totalClaim * 1.15;
  const totalRecovered = Object.values(sampleEnforcement).reduce(
    (sum, e) => sum + (e.amountRecovered ?? 0),
    0,
  );
  const recoveryRate =
    totalClaim > 0 ? ((totalRecovered / totalClaim) * 100).toFixed(1) : "0.0";

  // Chart: outstanding by product type
  const byProduct: Record<string, number> = {};
  for (const c of sampleCases) {
    byProduct[c.productType] =
      (byProduct[c.productType] ?? 0) + c.outstandingBalance;
  }
  const chartData = Object.entries(byProduct)
    .map(([product, total]) => ({ product, total }))
    .sort((a, b) => b.total - a.total);

  const tableRows = sampleCases.map((c) => {
    const enf = sampleEnforcement[c.caseId];
    return {
      caseId: c.caseId,
      customerName: c.customerName,
      outstanding: c.outstandingBalance,
      claimFiled: c.outstandingBalance * 1.15,
      recovered: enf?.amountRecovered ?? null,
      enforcementType: enf?.enforcementType ?? null,
      enforcementStatus: enf?.status ?? null,
    };
  });

  return (
    <div className="space-y-5">
      <div
        className="grid grid-cols-4 gap-3"
        data-ocid="reports.recovery.section"
      >
        <KpiCard
          label="Total Claim Amount"
          value={formatCurrency(totalClaim)}
        />
        <KpiCard
          label="Total Filed (est.)"
          value={formatCurrency(totalFiled)}
        />
        <KpiCard
          label="Total Recovered"
          value={formatCurrency(totalRecovered)}
        />
        <KpiCard label="Recovery Rate" value={`${recoveryRate}%`} />
      </div>

      <div className="bg-white border border-gray-200 rounded-md p-4">
        <p className="text-xs font-semibold text-gray-700 mb-3">
          Outstanding Balance by Product Type
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 16, left: 16, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="product"
              tick={{ fontSize: 10, fill: "#6b7280" }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#6b7280" }}
              tickFormatter={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)
              }
            />
            <Tooltip
              formatter={(value: number) => [
                formatCurrency(value),
                "Outstanding",
              ]}
              contentStyle={{
                fontSize: 12,
                borderRadius: 4,
                border: "1px solid #e5e7eb",
              }}
            />
            <Bar dataKey="total" fill="#374151" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded border border-gray-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-xs font-semibold text-gray-600 py-2">
                Case ID
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-600 py-2">
                Customer Name
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-600 py-2">
                Outstanding
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-600 py-2">
                Claim Filed
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-600 py-2">
                Recovered
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-600 py-2">
                Enforcement Type
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-600 py-2">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows.map((row, i) => (
              <TableRow
                key={row.caseId}
                className="hover:bg-gray-50"
                data-ocid={`reports.recovery.item.${i + 1}`}
              >
                <TableCell className="text-xs py-1.5 font-mono">
                  {row.caseId}
                </TableCell>
                <TableCell className="text-xs py-1.5">
                  {row.customerName}
                </TableCell>
                <TableCell className="text-xs py-1.5">
                  {formatCurrency(row.outstanding)}
                </TableCell>
                <TableCell className="text-xs py-1.5">
                  {formatCurrency(row.claimFiled)}
                </TableCell>
                <TableCell className="text-xs py-1.5">
                  {row.recovered !== null ? formatCurrency(row.recovered) : "—"}
                </TableCell>
                <TableCell className="text-xs py-1.5">
                  {row.enforcementType ?? "—"}
                </TableCell>
                <TableCell className="text-xs py-1.5">
                  {row.enforcementStatus ?? "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* ─── Main Reports Page ─────────────────────────────────────── */
export default function Reports() {
  const [activeTab, setActiveTab] = useState<ReportTab>("legal");

  return (
    <div className="p-5 min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="mb-4">
        <h1 className="text-base font-bold text-gray-900 font-display">
          Reports
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Aggregate view across all cases
        </p>
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-1 mb-5 border-b border-gray-200 pb-0"
        data-ocid="reports.tab"
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={[
              "px-4 py-2 text-xs font-medium rounded-t transition-colors",
              activeTab === tab.key
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100",
            ].join(" ")}
            data-ocid={`reports.${tab.key}.tab`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "legal" && <LegalProgressTab />}
      {activeTab === "compliance" && <ComplianceTab />}
      {activeTab === "recovery" && <RecoveryTab />}
    </div>
  );
}
