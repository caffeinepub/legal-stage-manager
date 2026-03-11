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
import { Textarea } from "@/components/ui/textarea";
import { Gavel, Loader2, Paperclip, Plus, Save, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Judgement, LitigationStatus } from "../../backend.d";
import type { LitigationRecord } from "../../backend.d";
import { useGetLitigation, useUpdateLitigation } from "../../hooks/useQueries";
import { parseDate } from "../../lib/formatters";

interface Props {
  caseId: string;
}

interface DocumentEntry {
  id: string;
  file: File | null;
  description: string;
  previewUrl: string | null;
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

const dateInputClass =
  "bg-white border-border text-black font-normal h-7 text-xs [&::-webkit-datetime-edit]:font-normal [&::-webkit-datetime-edit-fields-wrapper]:font-normal [&::-webkit-datetime-edit-year-field]:font-normal [&::-webkit-datetime-edit-month-field]:font-normal [&::-webkit-datetime-edit-day-field]:font-normal";

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-normal mb-2 mt-3 first:mt-0">
      {label}
    </p>
  );
}

export default function LitigationTab({ caseId }: Props) {
  const { isLoading } = useGetLitigation(caseId);
  const updateLitigation = useUpdateLitigation(caseId);

  const [form, setForm] = useState({
    courtCaseNumber: "",
    filingDate: "",
    courtName: "",
    courtSummonsDate: "",
    hearingDate: "",
    caseStatus: LitigationStatus.filed,
    judgement: Judgement.none,
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
    { id: "doc-1", file: null, description: "", previewUrl: null },
  ]);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const set = (key: string, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const addDocument = () => {
    setDocuments((prev) => [
      ...prev,
      {
        id: `doc-${Date.now()}`,
        file: null,
        description: "",
        previewUrl: null,
      },
    ]);
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const updateDocumentFile = (id: string, file: File | null) => {
    const previewUrl = file?.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null;
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, file, previewUrl } : d)),
    );
  };

  const updateDocumentDescription = (id: string, description: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, description } : d)),
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
        <CardContent className="pt-4">
          <div className="grid grid-cols-3 gap-3">
            {LIT_SKELETON_KEYS.map((k) => (
              <div key={k} className="space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-8 w-full" />
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
        <CardHeader className="pb-2 pt-3 px-4 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-sm font-normal text-foreground">
            <Gavel className="w-4 h-4 text-primary" />
            Litigation Record
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 px-4 pb-4 space-y-2">
          <SectionLabel label="Court Information" />

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Court Case Number
              </Label>
              <Input
                value={form.courtCaseNumber}
                onChange={(e) => set("courtCaseNumber", e.target.value)}
                placeholder="GH/HCC/YYYY/XXXX"
                className="bg-white border-border text-black font-normal h-7 text-xs"
                data-ocid="litigation.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Filing Date
              </Label>
              <Input
                type="date"
                value={form.filingDate}
                onChange={(e) => set("filingDate", e.target.value)}
                className={dateInputClass}
                data-ocid="litigation.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Court Name / Jurisdiction
              </Label>
              <Input
                value={form.courtName}
                onChange={(e) => set("courtName", e.target.value)}
                placeholder="High Court — Commercial Division"
                className="bg-white border-border text-black font-normal h-7 text-xs"
                data-ocid="litigation.input"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Court Summons Date
              </Label>
              <Input
                type="date"
                value={form.courtSummonsDate}
                onChange={(e) => set("courtSummonsDate", e.target.value)}
                className={dateInputClass}
                data-ocid="litigation.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Hearing Date
              </Label>
              <Input
                type="date"
                value={form.hearingDate}
                onChange={(e) => set("hearingDate", e.target.value)}
                className={dateInputClass}
                data-ocid="litigation.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Case Status
              </Label>
              <Select
                value={form.caseStatus}
                onValueChange={(v) => set("caseStatus", v)}
              >
                <SelectTrigger
                  className="bg-white border-border text-black font-normal h-7 text-xs"
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
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1 col-span-2">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Judgement
              </Label>
              <Select
                value={form.judgement}
                onValueChange={(v) => set("judgement", v)}
              >
                <SelectTrigger
                  className="bg-white border-border text-black font-normal h-7 text-xs"
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

          <SectionLabel label="Suit Details" />

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Suit By
              </Label>
              <Input
                value={form.suitBy}
                onChange={(e) => set("suitBy", e.target.value)}
                placeholder="e.g. NLS TECH Ltd"
                className="bg-white border-border text-black font-normal h-7 text-xs"
                data-ocid="litigation.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Ground of Suit
              </Label>
              <Input
                value={form.groundOfSuit}
                onChange={(e) => set("groundOfSuit", e.target.value)}
                placeholder="e.g. Non-payment of loan"
                className="bg-white border-border text-black font-normal h-7 text-xs"
                data-ocid="litigation.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Advocate
              </Label>
              <Input
                value={form.advocate}
                onChange={(e) => set("advocate", e.target.value)}
                placeholder="Advocate name"
                className="bg-white border-border text-black font-normal h-7 text-xs"
                data-ocid="litigation.input"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Advocate Instructions
              </Label>
              <Textarea
                value={form.advocateInstructions}
                onChange={(e) => set("advocateInstructions", e.target.value)}
                placeholder="Instructions..."
                rows={2}
                className="bg-white border-border text-black font-normal resize-none text-xs"
                data-ocid="litigation.textarea"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Witness Name
              </Label>
              <Input
                value={form.witnessName}
                onChange={(e) => set("witnessName", e.target.value)}
                placeholder="Full name"
                className="bg-white border-border text-black font-normal h-7 text-xs"
                data-ocid="litigation.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Witness Email
              </Label>
              <Input
                type="email"
                value={form.witnessEmail}
                onChange={(e) => set("witnessEmail", e.target.value)}
                placeholder="witness@example.com"
                className="bg-white border-border text-black font-normal h-7 text-xs"
                data-ocid="litigation.input"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Comment
              </Label>
              <Textarea
                value={form.comment}
                onChange={(e) => set("comment", e.target.value)}
                placeholder="Additional comments..."
                rows={2}
                className="bg-white border-border text-black font-normal resize-none text-xs"
                data-ocid="litigation.textarea"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Follow Up Description
              </Label>
              <Textarea
                value={form.followUpDescription}
                onChange={(e) => set("followUpDescription", e.target.value)}
                placeholder="Follow-up actions..."
                rows={2}
                className="bg-white border-border text-black font-normal resize-none text-xs"
                data-ocid="litigation.textarea"
              />
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-1 pt-1">
            {documents.map((doc, idx) => (
              <div
                key={doc.id}
                className="bg-white border border-gray-100 rounded-md p-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                    Document {documents.length > 1 ? idx + 1 : ""}
                  </Label>
                  {documents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="p-0.5 rounded text-gray-400 hover:text-red-500"
                      data-ocid={`litigation.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                {doc.previewUrl && (
                  <div className="relative mb-1">
                    <img
                      src={doc.previewUrl}
                      alt="Preview"
                      className="w-full h-16 object-cover rounded border border-border/50"
                    />
                    <button
                      type="button"
                      onClick={() => updateDocumentFile(doc.id, null)}
                      className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow text-gray-500 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    <input
                      type="file"
                      id={`lit-doc-file-${doc.id}`}
                      className="hidden"
                      ref={(el) => {
                        fileInputRefs.current[doc.id] = el;
                      }}
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        updateDocumentFile(doc.id, f);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs font-normal border-border h-6 px-2"
                      onClick={() => fileInputRefs.current[doc.id]?.click()}
                      data-ocid="litigation.upload_button"
                    >
                      <Paperclip className="w-3 h-3 mr-1" />
                      {doc.file
                        ? doc.file.name.slice(0, 12) +
                          (doc.file.name.length > 12 ? "…" : "")
                        : "Choose file"}
                    </Button>
                  </div>
                  <div className="flex-1">
                    <Input
                      value={doc.description}
                      onChange={(e) =>
                        updateDocumentDescription(doc.id, e.target.value)
                      }
                      placeholder="Description"
                      className="bg-white border-border text-black font-normal h-6 text-xs"
                      data-ocid="litigation.input"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDocument}
              className="text-xs font-normal border-border h-7"
              data-ocid="litigation.add_button"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Document
            </Button>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              disabled={updateLitigation.isPending}
              className="bg-primary text-primary-foreground font-normal h-8 text-sm"
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
