import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

interface Props {
  caseId: string;
}

interface NoticeRecord {
  noticeId: string;
  noticeType: "1st Demand Notice" | "Final Demand Notice" | "Statutory Notice";
  noticeSentDate: string;
  noticeExpiryDate: string;
  deliveryMethod: "Email" | "Courier" | "Physical";
  deliveryStatus: string;
  noticeStatus: "Active" | "Expired";
}

// Seed notice records keyed by caseId — 3 notices per case
const NOTICE_SEED: Record<string, NoticeRecord[]> = {
  "CASE-2024-002": [
    {
      noticeId: "NTC-2002-001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-03-10",
      noticeExpiryDate: "2025-04-10",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-2002-002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-07-15",
      noticeExpiryDate: "2025-08-15",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-2002-003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2025-12-10",
      noticeExpiryDate: "2026-06-10",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
  "CASE-2024-003": [
    {
      noticeId: "NTC-2003-001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-03-20",
      noticeExpiryDate: "2025-04-20",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-2003-002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-07-25",
      noticeExpiryDate: "2025-08-25",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-2003-003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2025-12-15",
      noticeExpiryDate: "2026-06-15",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
  "CASE-2024-004": [
    {
      noticeId: "NTC-2004-001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-03-05",
      noticeExpiryDate: "2025-04-05",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-2004-002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-07-10",
      noticeExpiryDate: "2025-08-10",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-2004-003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2025-12-05",
      noticeExpiryDate: "2026-05-05",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
  "CASE-2024-005": [
    {
      noticeId: "NTC-2005-001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-03-12",
      noticeExpiryDate: "2025-04-12",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-2005-002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-07-20",
      noticeExpiryDate: "2025-08-20",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-2005-003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2025-12-18",
      noticeExpiryDate: "2026-06-18",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
  "CASE-2024-006": [
    {
      noticeId: "NTC-2006-001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-03-08",
      noticeExpiryDate: "2025-04-08",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-2006-002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-07-18",
      noticeExpiryDate: "2025-08-18",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-2006-003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2025-12-08",
      noticeExpiryDate: "2026-05-08",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
  "CASE-2024-007": [
    {
      noticeId: "NTC-2007-001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-03-01",
      noticeExpiryDate: "2025-04-01",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-2007-002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-07-05",
      noticeExpiryDate: "2025-08-05",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-2007-003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2025-12-01",
      noticeExpiryDate: "2026-05-01",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
  "CASE-2024-008": [
    {
      noticeId: "NTC-2008-001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-03-18",
      noticeExpiryDate: "2025-04-18",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-2008-002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-07-22",
      noticeExpiryDate: "2025-08-22",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-2008-003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2025-12-20",
      noticeExpiryDate: "2026-06-20",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
  "CASE-2024-009": [
    {
      noticeId: "NTC-2009-001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-03-25",
      noticeExpiryDate: "2025-04-25",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-2009-002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-07-28",
      noticeExpiryDate: "2025-08-28",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-2009-003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2025-12-22",
      noticeExpiryDate: "2026-06-22",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
  "CASE-2024-010": [
    {
      noticeId: "NTC-2010-001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-03-22",
      noticeExpiryDate: "2025-04-22",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-2010-002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-07-12",
      noticeExpiryDate: "2025-08-12",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-2010-003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2025-12-12",
      noticeExpiryDate: "2026-05-12",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
  "CASE-2025-011": [
    {
      noticeId: "NTC-5011-001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-03-28",
      noticeExpiryDate: "2025-04-28",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5011-002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-08-02",
      noticeExpiryDate: "2025-09-02",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5011-003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2025-12-28",
      noticeExpiryDate: "2026-06-28",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
  "CASE-2025-012": [
    {
      noticeId: "NTC-5012-001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-04-05",
      noticeExpiryDate: "2025-05-05",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5012-002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-08-10",
      noticeExpiryDate: "2025-09-10",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5012-003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2026-01-05",
      noticeExpiryDate: "2026-07-05",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
  "CASE-2025-013": [
    {
      noticeId: "NTC-5013-001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-04-10",
      noticeExpiryDate: "2025-05-10",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5013-002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-08-15",
      noticeExpiryDate: "2025-09-15",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5013-003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2026-01-10",
      noticeExpiryDate: "2026-07-10",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
  "CASE-2025-014": [
    {
      noticeId: "NTC-5014-001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-04-15",
      noticeExpiryDate: "2025-05-15",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5014-002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-08-20",
      noticeExpiryDate: "2025-09-20",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5014-003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2026-01-15",
      noticeExpiryDate: "2026-07-15",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
  "CASE-2025-015": [
    {
      noticeId: "NTC-5015-001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-04-20",
      noticeExpiryDate: "2025-05-20",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5015-002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-08-25",
      noticeExpiryDate: "2025-09-25",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5015-003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2026-01-20",
      noticeExpiryDate: "2026-07-20",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
  "CASE-2025-016": [
    {
      noticeId: "NTC-5016-001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-04-25",
      noticeExpiryDate: "2025-05-25",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5016-002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-09-01",
      noticeExpiryDate: "2025-10-01",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5016-003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2026-01-25",
      noticeExpiryDate: "2026-07-25",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
  "CASE-2025-017": [
    {
      noticeId: "NTC-5017-001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-05-02",
      noticeExpiryDate: "2025-06-02",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5017-002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-09-08",
      noticeExpiryDate: "2025-10-08",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5017-003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2026-02-02",
      noticeExpiryDate: "2026-08-02",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
  "CASE-2025-018": [
    {
      noticeId: "NTC-5018-001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-05-08",
      noticeExpiryDate: "2025-06-08",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5018-002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-09-15",
      noticeExpiryDate: "2025-10-15",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5018-003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2026-02-08",
      noticeExpiryDate: "2026-08-08",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
  "CASE-2025-019": [
    {
      noticeId: "NTC-5019-001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-05-15",
      noticeExpiryDate: "2025-06-15",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5019-002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-09-20",
      noticeExpiryDate: "2025-10-20",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5019-003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2026-02-15",
      noticeExpiryDate: "2026-08-15",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
  "CASE-2025-020": [
    {
      noticeId: "NTC-5020-001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-05-20",
      noticeExpiryDate: "2025-06-20",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5020-002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-09-25",
      noticeExpiryDate: "2025-10-25",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-5020-003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2026-02-20",
      noticeExpiryDate: "2026-08-20",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
  default: [
    {
      noticeId: "NTC-0001-2025",
      noticeType: "1st Demand Notice",
      noticeSentDate: "2025-01-15",
      noticeExpiryDate: "2025-02-14",
      deliveryMethod: "Email",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-0002-2025",
      noticeType: "Final Demand Notice",
      noticeSentDate: "2025-03-01",
      noticeExpiryDate: "2025-03-31",
      deliveryMethod: "Courier",
      deliveryStatus: "Delivered",
      noticeStatus: "Expired",
    },
    {
      noticeId: "NTC-0003-2025",
      noticeType: "Statutory Notice",
      noticeSentDate: "2025-07-10",
      noticeExpiryDate: "2026-01-10",
      deliveryMethod: "Physical",
      deliveryStatus: "Delivered",
      noticeStatus: "Active",
    },
  ],
};

function getNotices(caseId: string): NoticeRecord[] {
  const records = NOTICE_SEED[caseId] ?? NOTICE_SEED.default;
  // Sort in reverse chronological order (newest sent date first)
  return [...records].sort(
    (a, b) =>
      new Date(b.noticeSentDate).getTime() -
      new Date(a.noticeSentDate).getTime(),
  );
}

const COLS = [
  "Notice ID",
  "Notice Type",
  "Notice Sent Date",
  "Notice Expiry Date",
  "Delivery Method",
  "Delivery Status",
  "Notice Status",
];

function fmt(d: string) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export default function NoticesTab({ caseId }: Props) {
  const notices = getNotices(caseId);

  return (
    <Card className="bg-white border-border shadow-sm">
      <CardHeader className="pb-2 pt-3 px-4 border-b border-border/50">
        <CardTitle className="flex items-center gap-2 text-sm font-normal text-foreground">
          <Bell className="w-4 h-4 text-primary" />
          Notice Register
          <span className="ml-auto text-[10px] text-gray-400 font-normal uppercase tracking-wider">
            {notices.length} record{notices.length !== 1 ? "s" : ""}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-0 pb-1">
        {notices.length === 0 ? (
          <div
            className="py-10 text-center text-xs text-gray-400"
            data-ocid="notices.empty_state"
          >
            No notices on record for this account.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs" data-ocid="notices.table">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {COLS.map((col) => (
                    <th
                      key={col}
                      className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-gray-400 font-normal whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {notices.map((n, i) => (
                  <tr
                    key={n.noticeId}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    data-ocid={`notices.row.${i + 1}`}
                  >
                    <td className="px-3 py-2 font-mono text-[11px] text-gray-700 whitespace-nowrap">
                      {n.noticeId}
                    </td>
                    <td className="px-3 py-2 text-gray-800 whitespace-nowrap">
                      {n.noticeType}
                    </td>
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                      {fmt(n.noticeSentDate)}
                    </td>
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                      {fmt(n.noticeExpiryDate)}
                    </td>
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                      {n.deliveryMethod}
                    </td>
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                      {n.deliveryStatus}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span
                        className={`text-[10px] uppercase tracking-wider font-normal ${
                          n.noticeStatus === "Active"
                            ? "text-black"
                            : "text-gray-400"
                        }`}
                      >
                        {n.noticeStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
