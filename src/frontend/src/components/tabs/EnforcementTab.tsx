import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Save, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { EnforcementRecord } from "../../backend.d";
import {
  useGetEnforcement,
  useUpdateEnforcement,
} from "../../hooks/useQueries";
import { formatDateInput, parseDate } from "../../lib/formatters";

interface Props {
  caseId: string;
}

const ENF_SKELETON_KEYS = ["a", "b", "c", "d", "e"];

export default function EnforcementTab({ caseId }: Props) {
  const { data: enforcement, isLoading } = useGetEnforcement(caseId);
  const updateEnforcement = useUpdateEnforcement(caseId);

  const [form, setForm] = useState({
    enforcementType: "",
    initiationDate: "",
    status: "",
    amountRecovered: "",
    responsibleLegalParty: "",
  });

  useEffect(() => {
    if (enforcement) {
      setForm({
        enforcementType: enforcement.enforcementType ?? "",
        initiationDate: formatDateInput(enforcement.initiationDate),
        status: enforcement.status ?? "",
        amountRecovered: String(enforcement.amountRecovered ?? ""),
        responsibleLegalParty: enforcement.responsibleLegalParty ?? "",
      });
    }
  }, [enforcement]);

  const set = (key: string, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const record: EnforcementRecord = {
      enforcementType: form.enforcementType,
      initiationDate: form.initiationDate ? parseDate(form.initiationDate) : 0n,
      status: form.status,
      amountRecovered: Number.parseFloat(form.amountRecovered) || 0,
      responsibleLegalParty: form.responsibleLegalParty,
    };
    try {
      await updateEnforcement.mutateAsync(record);
      toast.success("Enforcement record saved");
    } catch {
      toast.error("Failed to save enforcement record");
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            {ENF_SKELETON_KEYS.map((k) => (
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
            <Shield className="w-4 h-4 text-primary" />
            Enforcement Record
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide font-display">
                Enforcement Type
              </Label>
              <Input
                value={form.enforcementType}
                onChange={(e) => set("enforcementType", e.target.value)}
                placeholder="e.g. Property Lien, Wage Garnishment"
                className="bg-input border-border"
                data-ocid="enforcement.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide font-display">
                Initiation Date
              </Label>
              <Input
                type="date"
                value={form.initiationDate}
                onChange={(e) => set("initiationDate", e.target.value)}
                className="bg-input border-border"
                data-ocid="enforcement.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide font-display">
                Status
              </Label>
              <Input
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                placeholder="e.g. In Progress, Completed"
                className="bg-input border-border"
                data-ocid="enforcement.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide font-display">
                Amount Recovered (GHS)
              </Label>
              <Input
                type="number"
                step="0.01"
                value={form.amountRecovered}
                onChange={(e) => set("amountRecovered", e.target.value)}
                placeholder="0.00"
                className="bg-input border-border"
                data-ocid="enforcement.input"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide font-display">
                Responsible Legal Party
              </Label>
              <Input
                value={form.responsibleLegalParty}
                onChange={(e) => set("responsibleLegalParty", e.target.value)}
                placeholder="Legal firm / attorney name"
                className="bg-input border-border"
                data-ocid="enforcement.input"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={updateEnforcement.isPending}
              className="bg-primary text-primary-foreground font-display font-semibold"
              data-ocid="enforcement.save_button"
            >
              {updateEnforcement.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {updateEnforcement.isPending ? "Saving..." : "Save Record"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
