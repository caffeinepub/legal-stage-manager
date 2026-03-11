import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Gavel, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Judgement, LitigationStatus } from "../../backend.d";
import type { LitigationRecord } from "../../backend.d";
import { useGetLitigation, useUpdateLitigation } from "../../hooks/useQueries";
import { formatDateInput, parseDate } from "../../lib/formatters";

interface Props {
  caseId: string;
}

const CASE_STATUSES: { value: LitigationStatus; label: string }[] = [
  { value: LitigationStatus.filed, label: "Filed" },
  { value: LitigationStatus.awaitingHearing, label: "Awaiting Hearing" },
  { value: LitigationStatus.inTrial, label: "In Trial" },
  { value: LitigationStatus.judgementIssued, label: "Judgment Issued" },
];

const JUDGEMENTS: { value: Judgement; label: string }[] = [
  { value: Judgement.none, label: "None" },
  { value: Judgement.wageGarnishment, label: "Wage Garnishment" },
  { value: Judgement.propertyLien, label: "Property Lien" },
  { value: Judgement.writOfSeizureSale, label: "Writ of Seizure & Sale" },
  { value: Judgement.assetRepossession, label: "Asset Repossession" },
  { value: Judgement.auction, label: "Auction" },
];

const LIT_SKELETON_KEYS = ["a", "b", "c", "d", "e", "f"];

export default function LitigationTab({ caseId }: Props) {
  const { data: litigation, isLoading } = useGetLitigation(caseId);
  const updateLitigation = useUpdateLitigation(caseId);

  const [form, setForm] = useState({
    courtCaseNumber: "",
    filingDate: "",
    courtName: "",
    courtSummonsDate: "",
    hearingDate: "",
    caseStatus: LitigationStatus.filed,
    judgement: Judgement.none,
  });

  useEffect(() => {
    if (litigation) {
      setForm({
        courtCaseNumber: litigation.courtCaseNumber ?? "",
        filingDate: formatDateInput(litigation.filingDate),
        courtName: litigation.courtName ?? "",
        courtSummonsDate: formatDateInput(litigation.courtSummonsDate),
        hearingDate: formatDateInput(litigation.hearingDate),
        caseStatus: litigation.caseStatus ?? LitigationStatus.filed,
        judgement: litigation.judgement ?? Judgement.none,
      });
    }
  }, [litigation]);

  const set = (key: string, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const record: LitigationRecord = {
      courtCaseNumber: form.courtCaseNumber,
      filingDate: form.filingDate ? parseDate(form.filingDate) : 0n,
      courtName: form.courtName,
      courtSummonsDate: form.courtSummonsDate
        ? parseDate(form.courtSummonsDate)
        : undefined,
      hearingDate: form.hearingDate ? parseDate(form.hearingDate) : undefined,
      caseStatus: form.caseStatus,
      judgement: form.judgement,
    };
    try {
      await updateLitigation.mutateAsync(record);
      toast.success("Litigation record saved");
    } catch {
      toast.error("Failed to save litigation record");
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            {LIT_SKELETON_KEYS.map((k) => (
              <div key={k} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-card border-border shadow-card">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-sm font-display font-bold">
            <Gavel className="w-4 h-4 text-primary" />
            Litigation Record
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide font-display">
                Court Case Number
              </Label>
              <Input
                value={form.courtCaseNumber}
                onChange={(e) => set("courtCaseNumber", e.target.value)}
                placeholder="GH/HCC/YYYY/XXXX"
                className="bg-input border-border"
                data-ocid="litigation.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide font-display">
                Filing Date
              </Label>
              <Input
                type="date"
                value={form.filingDate}
                onChange={(e) => set("filingDate", e.target.value)}
                className="bg-input border-border"
                data-ocid="litigation.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide font-display">
                Court Name / Jurisdiction
              </Label>
              <Input
                value={form.courtName}
                onChange={(e) => set("courtName", e.target.value)}
                placeholder="High Court — Commercial Division"
                className="bg-input border-border"
                data-ocid="litigation.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide font-display">
                Court Summons Date
              </Label>
              <Input
                type="date"
                value={form.courtSummonsDate}
                onChange={(e) => set("courtSummonsDate", e.target.value)}
                className="bg-input border-border"
                data-ocid="litigation.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide font-display">
                Hearing Date
              </Label>
              <Input
                type="date"
                value={form.hearingDate}
                onChange={(e) => set("hearingDate", e.target.value)}
                className="bg-input border-border"
                data-ocid="litigation.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide font-display">
                Case Status
              </Label>
              <Select
                value={form.caseStatus}
                onValueChange={(v) => set("caseStatus", v)}
              >
                <SelectTrigger
                  className="bg-input border-border"
                  data-ocid="litigation.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {CASE_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide font-display">
                Judgement
              </Label>
              <Select
                value={form.judgement}
                onValueChange={(v) => set("judgement", v)}
              >
                <SelectTrigger
                  className="bg-input border-border"
                  data-ocid="litigation.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {JUDGEMENTS.map((j) => (
                    <SelectItem key={j.value} value={j.value}>
                      {j.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={updateLitigation.isPending}
              className="bg-primary text-primary-foreground font-display font-semibold"
              data-ocid="litigation.save_button"
            >
              {updateLitigation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {updateLitigation.isPending ? "Saving..." : "Save Record"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
