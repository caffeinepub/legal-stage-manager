import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Plus, Search, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  caseId: string;
}

interface DocumentEntry {
  id: string;
  file: File | null;
  description: string;
  previewUrl: string | null;
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
    { id: "doc-1", file: null, description: "", previewUrl: null },
  ]);

  const [feedbackFile, setFeedbackFile] = useState<File | null>(null);
  const [feedbackPreview, setFeedbackPreview] = useState<string | null>(null);
  const feedbackFileRef = useRef<HTMLInputElement>(null);

  const set = (key: string, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleFeedbackFile = (file: File | null) => {
    setFeedbackFile(file);
    if (file?.type.startsWith("image/")) {
      setFeedbackPreview(URL.createObjectURL(file));
    } else {
      setFeedbackPreview(null);
    }
  };

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

  const removeDocument = (id: string) =>
    setDocuments((prev) => prev.filter((d) => d.id !== id));

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Investigation record saved");
  };

  return (
    <form onSubmit={handleSave}>
      <Card className="bg-white border-border shadow-sm">
        <CardHeader className="pb-2 pt-3 px-4 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-sm font-normal text-foreground">
            <Search className="w-4 h-4 text-primary" />
            Customer Investigation
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 px-4 pb-4 space-y-2">
          {/* Row 1 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Product
              </Label>
              <Input
                value={form.product}
                onChange={(e) => set("product", e.target.value)}
                placeholder="e.g. Personal Loan"
                className="bg-white border-border text-black font-normal h-7 text-xs"
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
                className="bg-white border-border text-black font-normal h-7 text-xs"
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
                className="bg-white border-border text-black font-normal h-7 text-xs"
                data-ocid="investigation.input"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Legal ID
              </Label>
              <Input
                value={form.legalId}
                onChange={(e) => set("legalId", e.target.value)}
                placeholder="e.g. LEG-00123"
                className="bg-white border-border text-black font-normal h-7 text-xs"
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
                className="bg-white border-border text-black font-normal h-7 text-xs"
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
                className="bg-white border-border text-black font-normal h-7 text-xs"
                data-ocid="investigation.input"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Investigator
              </Label>
              <Input
                value={form.investigator}
                onChange={(e) => set("investigator", e.target.value)}
                placeholder="Full name"
                className="bg-white border-border text-black font-normal h-7 text-xs"
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
                className="bg-white border-border text-black font-normal resize-none text-xs"
                data-ocid="investigation.textarea"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Feedback Upload
              </Label>
              <div className="bg-white border border-border rounded-md p-2 space-y-1">
                <input
                  ref={feedbackFileRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) =>
                    handleFeedbackFile(e.target.files?.[0] ?? null)
                  }
                />
                {feedbackPreview ? (
                  <div className="relative">
                    <img
                      src={feedbackPreview}
                      alt="Feedback preview"
                      className="w-full h-16 object-cover rounded border border-border/50"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFeedbackFile(null);
                        setFeedbackPreview(null);
                      }}
                      className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow text-gray-500 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : feedbackFile ? (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 truncate">
                      {feedbackFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFeedbackFile(null);
                        setFeedbackPreview(null);
                      }}
                      className="p-0.5 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-normal border-border h-7"
                  onClick={() => feedbackFileRef.current?.click()}
                  data-ocid="investigation.upload_button"
                >
                  <Paperclip className="w-3 h-3 mr-1" />
                  {feedbackFile ? "Replace file" : "Attach file"}
                </Button>
              </div>
            </div>
          </div>

          {/* Document upload rows */}
          <div className="space-y-1.5 pt-1">
            {documents.map((doc, idx) => (
              <div
                key={doc.id}
                className="bg-white border border-gray-100 rounded-md p-2.5 shadow-sm space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                    Document {documents.length > 1 ? idx + 1 : ""}
                  </Label>
                  {documents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="p-0.5 rounded text-gray-400 hover:text-red-500"
                      data-ocid={`investigation.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                {doc.previewUrl && (
                  <div className="relative">
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
                <div className="grid grid-cols-3 gap-2 items-end">
                  <div>
                    <input
                      type="file"
                      id={`doc-file-${doc.id}`}
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        updateDocumentFile(doc.id, f);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-normal border-border h-7"
                      onClick={() =>
                        document.getElementById(`doc-file-${doc.id}`)?.click()
                      }
                      data-ocid="investigation.upload_button"
                    >
                      <Paperclip className="w-3 h-3 mr-1" />
                      {doc.file
                        ? doc.file.name.slice(0, 14) +
                          (doc.file.name.length > 14 ? "…" : "")
                        : "Choose file"}
                    </Button>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                      Description
                    </Label>
                    <Input
                      value={doc.description}
                      onChange={(e) =>
                        updateDocumentDescription(doc.id, e.target.value)
                      }
                      placeholder="Document description"
                      className="bg-white border-border text-black font-normal h-7 text-xs"
                      data-ocid="investigation.input"
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
              data-ocid="investigation.add_button"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Document
            </Button>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              className="bg-primary text-primary-foreground font-normal h-8 text-sm"
              data-ocid="investigation.save_button"
            >
              Submit Investigation
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
