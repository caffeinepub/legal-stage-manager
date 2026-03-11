import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Plus, Search, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  caseId: string;
}

interface DocumentEntry {
  id: string;
  file: File | null;
  description: string;
}

export default function InvestigationTab({ caseId: _caseId }: Props) {
  const [form, setForm] = useState({
    product: "",
    accountNumber: "",
    loanId: "",
    legalId: "",
    legalDescription: "",
    omniflowNumber: "",
    investigator: "",
    feedbackDescription: "",
  });

  const [documents, setDocuments] = useState<DocumentEntry[]>([
    { id: "doc-1", file: null, description: "" },
  ]);

  const [feedbackFile, setFeedbackFile] = useState<File | null>(null);
  const feedbackFileRef = useRef<HTMLInputElement>(null);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Investigation record saved");
  };

  return (
    <form onSubmit={handleSave}>
      <Card className="bg-white border-border shadow-sm">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-sm font-normal text-foreground">
            <Search className="w-4 h-4 text-primary" />
            Customer Investigation
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {/* Row 1: Product | Account Number | Loan ID */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Product
              </Label>
              <Input
                value={form.product}
                onChange={(e) => set("product", e.target.value)}
                placeholder="e.g. Personal Loan"
                className="bg-white border-border text-black font-normal h-8 text-sm"
                data-ocid="investigation.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Account Number
              </Label>
              <Input
                value={form.accountNumber}
                onChange={(e) => set("accountNumber", e.target.value)}
                placeholder="e.g. ACC-0001234"
                className="bg-white border-border text-black font-normal h-8 text-sm"
                data-ocid="investigation.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Loan ID
              </Label>
              <Input
                value={form.loanId}
                onChange={(e) => set("loanId", e.target.value)}
                placeholder="e.g. LN-20240001"
                className="bg-white border-border text-black font-normal h-8 text-sm"
                data-ocid="investigation.input"
              />
            </div>
          </div>

          {/* Row 2: Legal ID | Legal Description | Omniflow Number */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Legal ID
              </Label>
              <Input
                value={form.legalId}
                onChange={(e) => set("legalId", e.target.value)}
                placeholder="e.g. LEG-00123"
                className="bg-white border-border text-black font-normal h-8 text-sm"
                data-ocid="investigation.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Legal Description
              </Label>
              <Input
                value={form.legalDescription}
                onChange={(e) => set("legalDescription", e.target.value)}
                placeholder="Brief legal description"
                className="bg-white border-border text-black font-normal h-8 text-sm"
                data-ocid="investigation.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Omniflow Number
              </Label>
              <Input
                value={form.omniflowNumber}
                onChange={(e) => set("omniflowNumber", e.target.value)}
                placeholder="e.g. OMF-00456"
                className="bg-white border-border text-black font-normal h-8 text-sm"
                data-ocid="investigation.input"
              />
            </div>
          </div>

          {/* Row 3: Investigator | Feedback Description | Feedback Upload */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Investigator
              </Label>
              <Input
                value={form.investigator}
                onChange={(e) => set("investigator", e.target.value)}
                placeholder="Full name"
                className="bg-white border-border text-black font-normal h-8 text-sm"
                data-ocid="investigation.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Feedback Description
              </Label>
              <Textarea
                value={form.feedbackDescription}
                onChange={(e) => set("feedbackDescription", e.target.value)}
                placeholder="Investigation feedback..."
                rows={2}
                className="bg-white border-border text-black font-normal resize-none text-sm"
                data-ocid="investigation.textarea"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Feedback Upload
              </Label>
              <div className="flex items-center pt-1">
                <input
                  ref={feedbackFileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => setFeedbackFile(e.target.files?.[0] ?? null)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs font-normal border-border h-8"
                  onClick={() => feedbackFileRef.current?.click()}
                  data-ocid="investigation.upload_button"
                >
                  <Paperclip className="w-3 h-3 mr-1" />
                  {feedbackFile ? feedbackFile.name : "Attach file"}
                </Button>
              </div>
            </div>
          </div>

          {/* Document upload rows */}
          <div className="space-y-2 pt-1">
            {documents.map((doc, idx) => (
              <div
                key={doc.id}
                className="grid grid-cols-2 gap-3 items-end p-2.5 rounded border border-border/60"
              >
                <div className="space-y-1">
                  <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                    Document
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id={`doc-file-${doc.id}`}
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        updateDocument(doc.id, "file", f);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs font-normal border-border h-8"
                      onClick={() =>
                        document.getElementById(`doc-file-${doc.id}`)?.click()
                      }
                      data-ocid="investigation.upload_button"
                    >
                      <Paperclip className="w-3 h-3 mr-1" />
                      {doc.file ? doc.file.name : "Choose file"}
                    </Button>
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-1">
                    <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                      Description
                    </Label>
                    <Input
                      value={doc.description}
                      onChange={(e) =>
                        updateDocument(doc.id, "description", e.target.value)
                      }
                      placeholder="Document description"
                      className="bg-white border-border text-black font-normal h-8 text-sm"
                      data-ocid="investigation.input"
                    />
                  </div>
                  {documents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors mb-0.5"
                      data-ocid={`investigation.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDocument}
              className="text-xs font-normal border-border h-8"
              data-ocid="investigation.add_button"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Document
            </Button>
          </div>

          {/* Save */}
          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              className="bg-primary text-primary-foreground font-normal"
              data-ocid="investigation.save_button"
            >
              Save Investigation
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
