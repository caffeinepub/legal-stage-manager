import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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

export default function InvestigationTab({ caseId: _caseId }: Props) {
  const [form, setForm] = useState({
    product: "",
    accountNumber: "",
    loanId: "",
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
        <CardContent className="pt-5 space-y-6">
          {/* Loan Information */}
          <div>
            <SectionHeader label="Loan Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Product
                </Label>
                <Input
                  value={form.product}
                  onChange={(e) => set("product", e.target.value)}
                  placeholder="e.g. Personal Loan"
                  className="bg-input border-border text-black font-normal"
                  data-ocid="investigation.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Account Number
                </Label>
                <Input
                  value={form.accountNumber}
                  onChange={(e) => set("accountNumber", e.target.value)}
                  placeholder="e.g. ACC-0001234"
                  className="bg-input border-border text-black font-normal"
                  data-ocid="investigation.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Loan ID
                </Label>
                <Input
                  value={form.loanId}
                  onChange={(e) => set("loanId", e.target.value)}
                  placeholder="e.g. LN-20240001"
                  className="bg-input border-border text-black font-normal"
                  data-ocid="investigation.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Omniflow Number
                </Label>
                <Input
                  value={form.omniflowNumber}
                  onChange={(e) => set("omniflowNumber", e.target.value)}
                  placeholder="e.g. OMF-00456"
                  className="bg-input border-border text-black font-normal"
                  data-ocid="investigation.input"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Legal Description
                </Label>
                <Textarea
                  value={form.legalDescription}
                  onChange={(e) => set("legalDescription", e.target.value)}
                  placeholder="Describe the legal nature of the case..."
                  rows={3}
                  className="bg-input border-border text-black font-normal resize-none"
                  data-ocid="investigation.textarea"
                />
              </div>
            </div>
          </div>

          {/* Investigator */}
          <div>
            <SectionHeader label="Investigator" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Investigator
                </Label>
                <Input
                  value={form.investigator}
                  onChange={(e) => set("investigator", e.target.value)}
                  placeholder="Full name"
                  className="bg-input border-border text-black font-normal"
                  data-ocid="investigation.input"
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
                          className="text-xs font-normal border-border"
                          onClick={() =>
                            document
                              .getElementById(`doc-file-${doc.id}`)
                              ?.click()
                          }
                          data-ocid="investigation.upload_button"
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
                        data-ocid="investigation.input"
                      />
                    </div>
                  </div>
                  {documents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="mt-6 p-1.5 rounded text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                      data-ocid={`investigation.delete_button.${idx + 1}`}
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
                data-ocid="investigation.add_button"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Document
              </Button>
            </div>
          </div>

          {/* Feedback */}
          <div>
            <SectionHeader label="Feedback" />
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Feedback Description
                </Label>
                <Textarea
                  value={form.feedbackDescription}
                  onChange={(e) => set("feedbackDescription", e.target.value)}
                  placeholder="Describe the investigation feedback..."
                  rows={3}
                  className="bg-input border-border text-black font-normal resize-none"
                  data-ocid="investigation.textarea"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide font-normal">
                  Feedback Document
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    ref={feedbackFileRef}
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setFeedbackFile(e.target.files?.[0] ?? null)
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs font-normal border-border"
                    onClick={() => feedbackFileRef.current?.click()}
                    data-ocid="investigation.upload_button"
                  >
                    <Paperclip className="w-3 h-3 mr-1" />
                    {feedbackFile
                      ? feedbackFile.name
                      : "Attach feedback document"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end pt-2">
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
