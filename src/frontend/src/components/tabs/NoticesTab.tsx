import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bell } from "lucide-react";
import { DeliveryMethod, NoticeStatus, NoticeType } from "../../backend.d";
import { useGetNotices } from "../../hooks/useQueries";
import { formatDate } from "../../lib/formatters";

interface Props {
  caseId: string;
}

const NOTICE_SKEL_ROWS = ["row-a", "row-b", "row-c"];
const NOTICE_SKEL_CELLS = ["c1", "c2", "c3", "c4", "c5", "c6", "c7"];

function noticeTypeLabel(t: NoticeType): string {
  switch (t) {
    case NoticeType.firstDemand:
      return "1st Demand Notice";
    case NoticeType.finalDemand:
      return "Final Demand Notice";
    case NoticeType.statutory:
      return "Statutory Notice";
    default:
      return t;
  }
}

function deliveryMethodLabel(m: DeliveryMethod): string {
  switch (m) {
    case DeliveryMethod.email:
      return "Email";
    case DeliveryMethod.courier:
      return "Courier";
    case DeliveryMethod.physical:
      return "Physical";
    default:
      return m;
  }
}

function noticeStatusBadge(s: NoticeStatus) {
  switch (s) {
    case NoticeStatus.active:
      return (
        <Badge className="bg-[oklch(0.65_0.18_142/0.2)] text-[oklch(0.82_0.16_142)] border-[oklch(0.65_0.18_142/0.4)] border">
          Active
        </Badge>
      );
    case NoticeStatus.expired:
      return (
        <Badge className="bg-[oklch(0.6_0.22_18/0.2)] text-[oklch(0.82_0.18_25)] border-[oklch(0.6_0.22_18/0.4)] border">
          Expired
        </Badge>
      );
    case NoticeStatus.complied:
      return (
        <Badge className="bg-[oklch(0.55_0.14_245/0.2)] text-[oklch(0.78_0.14_245)] border-[oklch(0.55_0.14_245/0.4)] border">
          Complied
        </Badge>
      );
    default:
      return <Badge variant="outline">{s}</Badge>;
  }
}

export default function NoticesTab({ caseId }: Props) {
  const { data: notices, isLoading } = useGetNotices(caseId);

  return (
    <Card className="bg-card border-border shadow-card">
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="flex items-center gap-2 text-sm font-display font-bold">
          <Bell className="w-4 h-4 text-primary" />
          Notice Register
          <span className="ml-auto text-xs font-normal text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
            Read-only
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3 p-0">
        <Table data-ocid="notices.table">
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider pl-4">
                Notice ID
              </TableHead>
              <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider">
                Notice Type
              </TableHead>
              <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider">
                Sent Date
              </TableHead>
              <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider">
                Expiry Date
              </TableHead>
              <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider">
                Delivery Method
              </TableHead>
              <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider">
                Delivery Status
              </TableHead>
              <TableHead className="text-muted-foreground font-display font-semibold text-xs uppercase tracking-wider">
                Notice Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              NOTICE_SKEL_ROWS.map((rowKey) => (
                <TableRow key={rowKey}>
                  {NOTICE_SKEL_CELLS.map((cellKey) => (
                    <TableCell key={cellKey}>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!isLoading && (!notices || notices.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-muted-foreground"
                  data-ocid="notices.empty_state"
                >
                  <Bell className="w-6 h-6 mx-auto mb-2 opacity-30" />
                  No notices recorded for this case
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              notices?.map((n, idx) => (
                <TableRow
                  key={n.noticeId}
                  className="border-b border-border/50"
                  data-ocid={`notices.row.${idx + 1}`}
                >
                  <TableCell className="font-mono text-xs text-primary pl-4">
                    {n.noticeId}
                  </TableCell>
                  <TableCell className="text-sm">
                    {noticeTypeLabel(n.noticeType)}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {formatDate(n.noticeSentDate)}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {formatDate(n.noticeExpiryDate)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {deliveryMethodLabel(n.deliveryMethod)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {n.deliveryStatus}
                  </TableCell>
                  <TableCell>{noticeStatusBadge(n.noticeStatus)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
