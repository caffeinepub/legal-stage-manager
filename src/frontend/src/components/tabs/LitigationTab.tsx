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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Gavel, Loader2, Paperclip, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Judgement, LitigationStatus } from "../../backend.d";
import type { LitigationRecord } from "../../backend.d";
import { useGetLitigation, useUpdateLitigation } from "../../hooks/useQueries";
import { formatDateInput, parseDate } from "../../lib/formatters";

interface Props {
  caseId: string;
}

interface DocumentEntry {
  id: string;
  file: File | null;
  description: string;
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

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="pt-2">
      <p className="text-xs uppercase tracking-widest text-muted-foreground font-normal mb-3">
        {label}
      </p>
      <Separator className="mb-4" />
    </div>
  );
}

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
    // new fields
    suitBy: "",
    groundOfSuit: "",
    advocate: "",
    advocateInstructions: "",
    witnessName: "",
    witnessEmail: "",
    comment: "",
    followUpDescription: "",
  });

  const [documents, setDocuments] = useState<DocumentEntry[]>([
    { id: "doc-1", file: null, description: "" },
  ]);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (litigation) {
      setForm((prev) => ({
        ...prev,
        courtCaseNumber: litigation.courtCaseNumber ?? "",
        filingDate: formatDateInput(litigation.filingDate),
        courtName: litigation.courtName ?? "",
        courtSummonsDate: formatDateInput(litigation.courtSummonsDate),
        hearingDate: formatDateInput(litigation.hearingDate),
        caseStatus: litigation.caseStatus ?? LitigationStatus.filed,
        judgement: litigation.judgement ?? Judgement.none,
      }));
    }
  }, [litigation]);

  const set = (key: string, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const addDocument = () => {
    setDocuments((prev) => [
      ...prev,
      { id: `doc-${Date.now()}`, file: null, description: "" },
    ]);
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const updateDocument = (
    id: string,
    key: "file" | "description",
    value: File | string | null,
  ) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [key]: value } : d)),
    );
  };

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
      <Card className="bg-white border-border shadow-sm">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-sm font-normal text-foreground">
            <Gavel className="w-4 h-4 text-primary" />
            Litigation Record
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 space-y-6">
          {/* Court Information */}
          <div>
            <SectionHeader label="Court Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Court Case Number
                </Label>
                <Input
                  value={form.courtCaseNumber}
                  onChange={(e) => set("courtCaseNumber", e.target.value)}
                  placeholder="GH/HCC/YYYY/XXXX"
                  className="bg-input border-border text-black font-normal"
                  data-ocid="litigation.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Filing Date
                </Label>
                <Input
                  type="date"
                  value={form.filingDate}
                  onChange={(e) => set("filingDate", e.target.value)}
                  className="bg-input border-border text-black font-normal"
                  data-ocid="litigation.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Court Name / Jurisdiction
                </Label>
                <Input
                  value={form.courtName}
                  onChange={(e) => set("courtName", e.target.value)}
                  placeholder="High Court — Commercial Division"
                  className="bg-input border-border text-black font-normal"
                  data-ocid="litigation.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Court Summons Date
                </Label>
                <Input
                  type="date"
                  value={form.courtSummonsDate}
                  onChange={(e) => set("courtSummonsDate", e.target.value)}
                  className="bg-input border-border text-black font-normal"
                  data-ocid="litigation.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Hearing Date
                </Label>
                <Input
                  type="date"
                  value={form.hearingDate}
                  onChange={(e) => set("hearingDate", e.target.value)}
                  className="bg-input border-border text-black font-normal"
                  data-ocid="litigation.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Case Status
                </Label>
                <Select
                  value={form.caseStatus}
                  onValueChange={(v) => set("caseStatus", v)}
                >
                  <SelectTrigger
                    className="bg-input border-border text-black font-normal"
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
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Judgement
                </Label>
                <Select
                  value={form.judgement}
                  onValueChange={(v) => set("judgement", v)}
                >
                  <SelectTrigger
                    className="bg-input border-border text-black font-normal"
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
          </div>

          {/* Suit Details */}
          <div>
            <SectionHeader label="Suit Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Suit By
                </Label>
                <Input
                  value={form.suitBy}
                  onChange={(e) => set("suitBy", e.target.value)}
                  placeholder="e.g. NLS TECH Ltd"
                  className="bg-input border-border text-black font-normal"
                  data-ocid="litigation.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Ground of Suit
                </Label>
                <Input
                  value={form.groundOfSuit}
                  onChange={(e) => set("groundOfSuit", e.target.value)}
                  placeholder="e.g. Non-payment of loan"
                  className="bg-input border-border text-black font-normal"
                  data-ocid="litigation.input"
                />
              </div>
            </div>
          </div>

          {/* Advocate */}
          <div>
            <SectionHeader label="Advocate" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Advocate
                </Label>
                <Input
                  value={form.advocate}
                  onChange={(e) => set("advocate", e.target.value)}
                  placeholder="Advocate name"
                  className="bg-input border-border text-black font-normal"
                  data-ocid="litigation.input"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Advocate Instructions
                </Label>
                <Textarea
                  value={form.advocateInstructions}
                  onChange={(e) => set("advocateInstructions", e.target.value)}
                  placeholder="Instructions to the advocate..."
                  rows={3}
                  className="bg-input border-border text-black font-normal resize-none"
                  data-ocid="litigation.textarea"
                />
              </div>
            </div>
          </div>

          {/* Witness */}
          <div>
            <SectionHeader label="Witness" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Witness Name
                </Label>
                <Input
                  value={form.witnessName}
                  onChange={(e) => set("witnessName", e.target.value)}
                  placeholder="Full name"
                  className="bg-input border-border text-black font-normal"
                  data-ocid="litigation.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Witness Email
                </Label>
                <Input
                  type="email"
                  value={form.witnessEmail}
                  onChange={(e) => set("witnessEmail", e.target.value)}
                  placeholder="witness@example.com"
                  className="bg-input border-border text-black font-normal"
                  data-ocid="litigation.input"
                />
              </div>
            </div>
          </div>

          {/* Follow Up */}
          <div>
            <SectionHeader label="Follow Up" />
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Comment
                </Label>
                <Textarea
                  value={form.comment}
                  onChange={(e) => set("comment", e.target.value)}
                  placeholder="Additional comments..."
                  rows={2}
                  className="bg-input border-border text-black font-normal resize-none"
                  data-ocid="litigation.textarea"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Follow Up Description
                </Label>
                <Textarea
                  value={form.followUpDescription}
                  onChange={(e) => set("followUpDescription", e.target.value)}
                  placeholder="Describe the follow-up actions required..."
                  rows={3}
                  className="bg-input border-border text-black font-normal resize-none"
                  data-ocid="litigation.textarea"
                />
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <SectionHeader label="Documents" />
            <div className="space-y-3">
              {documents.map((doc, idx) => (
                <div
                  key={doc.id}
                  className="flex items-start gap-3 p-3 rounded-md border border-border/60 bg-secondary/30"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                        Document
                      </Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          id={`lit-doc-file-${doc.id}`}
                          className="hidden"
                          ref={(el) => {
                            fileInputRefs.current[doc.id] = el;
                          }}
                          onChange={(e) => {
                            const f = e.target.files?.[0] ?? null;
                            updateDocument(doc.id, "file", f);
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs font-normal border-border"
                          onClick={() => fileInputRefs.current[doc.id]?.click()}
                          data-ocid="litigation.upload_button"
                        >
                          <Paperclip className="w-3 h-3 mr-1" />
                          {doc.file ? doc.file.name : "Choose file"}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                        Description
                      </Label>
                      <Input
                        value={doc.description}
                        onChange={(e) =>
                          updateDocument(doc.id, "description", e.target.value)
                        }
                        placeholder="Document description"
                        className="bg-input border-border text-black font-normal"
                        data-ocid="litigation.input"
                      />
                    </div>
                  </div>
                  {documents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="mt-6 p-1.5 rounded text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                      data-ocid={`litigation.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDocument}
                className="text-xs font-normal border-border"
                data-ocid="litigation.add_button"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Document
              </Button>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={updateLitigation.isPending}
              className="bg-primary text-primary-foreground font-normal"
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
