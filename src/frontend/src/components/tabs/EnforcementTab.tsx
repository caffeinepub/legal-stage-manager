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

function FieldCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-md p-3 shadow-sm space-y-1">
      {children}
    </div>
  );
}

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
      <Card className="bg-white border-border shadow-sm">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-sm font-normal text-foreground">
            <Shield className="w-4 h-4 text-primary" />
            Enforcement Record
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FieldCard>
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Enforcement Type
              </Label>
              <Input
                value={form.enforcementType}
                onChange={(e) => set("enforcementType", e.target.value)}
                placeholder="e.g. Property Lien, Wage Garnishment"
                className="bg-white border-border text-black font-normal h-8 text-sm"
                data-ocid="enforcement.input"
              />
            </FieldCard>
            <FieldCard>
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Initiation Date
              </Label>
              <Input
                type="date"
                value={form.initiationDate}
                onChange={(e) => set("initiationDate", e.target.value)}
                className="bg-white border-border text-black font-normal h-8 text-sm"
                data-ocid="enforcement.input"
              />
            </FieldCard>
            <FieldCard>
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Status
              </Label>
              <Input
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                placeholder="e.g. In Progress, Completed"
                className="bg-white border-border text-black font-normal h-8 text-sm"
                data-ocid="enforcement.input"
              />
            </FieldCard>
            <FieldCard>
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Amount Recovered (KES)
              </Label>
              <Input
                type="number"
                step="0.01"
                value={form.amountRecovered}
                onChange={(e) => set("amountRecovered", e.target.value)}
                placeholder="0.00"
                className="bg-white border-border text-black font-normal h-8 text-sm"
                data-ocid="enforcement.input"
              />
            </FieldCard>
          </div>
          <FieldCard>
            <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
              Responsible Legal Party
            </Label>
            <Input
              value={form.responsibleLegalParty}
              onChange={(e) => set("responsibleLegalParty", e.target.value)}
              placeholder="Legal firm / attorney name"
              className="bg-white border-border text-black font-normal h-8 text-sm"
              data-ocid="enforcement.input"
            />
          </FieldCard>
          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              disabled={updateEnforcement.isPending}
              className="bg-primary text-primary-foreground font-normal"
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
