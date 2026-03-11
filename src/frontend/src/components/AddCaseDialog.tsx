import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Case } from "../backend.d";
import { useAddCase } from "../hooks/useQueries";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUSES = [
  "Active",
  "In Litigation",
  "Judgment Issued",
  "Settled",
  "Pending",
];
const PRODUCTS = [
  "Personal Loan",
  "Mortgage",
  "Auto Loan",
  "Business Overdraft",
  "Credit Card",
  "Equipment Finance",
];

function genId(prefix: string) {
  return `${prefix}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
}

function FieldCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-md p-3 shadow-sm space-y-1.5">
      {children}
    </div>
  );
}

export default function AddCaseDialog({ open, onOpenChange }: Props) {
  const addCase = useAddCase();
  const [form, setForm] = useState({
    contractId: "",
    customerName: "",
    customerNumber: "",
    mobileNumber: "",
    status: "Active",
    caseDescription: "",
    outstandingBalance: "",
    omniflowNumber: "",
    productType: "Personal Loan",
    assignedAgency: "",
  });

  const set = (key: string, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCase: Case = {
      caseId: genId("CASE"),
      contractId: form.contractId,
      customerName: form.customerName,
      customerNumber: form.customerNumber,
      mobileNumber: form.mobileNumber,
      status: form.status,
      caseDescription: form.caseDescription,
      outstandingBalance: Number.parseFloat(form.outstandingBalance) || 0,
      omniflowNumber: form.omniflowNumber,
      productType: form.productType,
      assignedAgency: form.assignedAgency,
    };
    try {
      await addCase.mutateAsync(newCase);
      toast.success("Case added successfully");
      onOpenChange(false);
      setForm({
        contractId: "",
        customerName: "",
        customerNumber: "",
        mobileNumber: "",
        status: "Active",
        caseDescription: "",
        outstandingBalance: "",
        omniflowNumber: "",
        productType: "Personal Loan",
        assignedAgency: "",
      });
    } catch {
      toast.error("Failed to add case");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl bg-card border-border"
        data-ocid="case.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-normal text-lg">
            Add New Case
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Enter case details to register a new legal case.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3 py-4">
            <FieldCard>
              <Label
                htmlFor="contractId"
                className="text-[10px] text-gray-400 uppercase tracking-wider font-normal"
              >
                Contract ID
              </Label>
              <Input
                id="contractId"
                required
                value={form.contractId}
                onChange={(e) => set("contractId", e.target.value)}
                placeholder="CTR-XXXXX"
                className="bg-white border-border text-black font-normal h-8 text-sm"
                data-ocid="case.input"
              />
            </FieldCard>
            <FieldCard>
              <Label
                htmlFor="customerName"
                className="text-[10px] text-gray-400 uppercase tracking-wider font-normal"
              >
                Customer Name
              </Label>
              <Input
                id="customerName"
                required
                value={form.customerName}
                onChange={(e) => set("customerName", e.target.value)}
                placeholder="Full legal name"
                className="bg-white border-border text-black font-normal h-8 text-sm"
                data-ocid="case.input"
              />
            </FieldCard>
            <FieldCard>
              <Label
                htmlFor="customerNumber"
                className="text-[10px] text-gray-400 uppercase tracking-wider font-normal"
              >
                Customer Number
              </Label>
              <Input
                id="customerNumber"
                required
                value={form.customerNumber}
                onChange={(e) => set("customerNumber", e.target.value)}
                placeholder="CUST-XXXXX"
                className="bg-white border-border text-black font-normal h-8 text-sm"
                data-ocid="case.input"
              />
            </FieldCard>
            <FieldCard>
              <Label
                htmlFor="mobileNumber"
                className="text-[10px] text-gray-400 uppercase tracking-wider font-normal"
              >
                Mobile Number
              </Label>
              <Input
                id="mobileNumber"
                value={form.mobileNumber}
                onChange={(e) => set("mobileNumber", e.target.value)}
                placeholder="+254 7XX XXX XXX"
                className="bg-white border-border text-black font-normal h-8 text-sm"
                data-ocid="case.input"
              />
            </FieldCard>
            <FieldCard>
              <Label
                htmlFor="outstandingBalance"
                className="text-[10px] text-gray-400 uppercase tracking-wider font-normal"
              >
                Outstanding Balance
              </Label>
              <Input
                id="outstandingBalance"
                type="number"
                step="0.01"
                required
                value={form.outstandingBalance}
                onChange={(e) => set("outstandingBalance", e.target.value)}
                placeholder="0.00"
                className="bg-white border-border text-black font-normal h-8 text-sm"
                data-ocid="case.input"
              />
            </FieldCard>
            <FieldCard>
              <Label
                htmlFor="omniflowNumber"
                className="text-[10px] text-gray-400 uppercase tracking-wider font-normal"
              >
                Omniflow Number
              </Label>
              <Input
                id="omniflowNumber"
                value={form.omniflowNumber}
                onChange={(e) => set("omniflowNumber", e.target.value)}
                placeholder="OFN-XXXX-XXXX"
                className="bg-white border-border text-black font-normal h-8 text-sm"
                data-ocid="case.input"
              />
            </FieldCard>
            <FieldCard>
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Status
              </Label>
              <Select
                value={form.status}
                onValueChange={(v) => set("status", v)}
              >
                <SelectTrigger
                  className="bg-white border-border text-black font-normal h-8 text-sm"
                  data-ocid="case.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldCard>
            <FieldCard>
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Product Type
              </Label>
              <Select
                value={form.productType}
                onValueChange={(v) => set("productType", v)}
              >
                <SelectTrigger
                  className="bg-white border-border text-black font-normal h-8 text-sm"
                  data-ocid="case.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {PRODUCTS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldCard>
            <FieldCard>
              <Label
                htmlFor="assignedAgency"
                className="text-[10px] text-gray-400 uppercase tracking-wider font-normal"
              >
                Assigned Agency
              </Label>
              <Input
                id="assignedAgency"
                value={form.assignedAgency}
                onChange={(e) => set("assignedAgency", e.target.value)}
                placeholder="Legal firm name"
                className="bg-white border-border text-black font-normal h-8 text-sm"
                data-ocid="case.input"
              />
            </FieldCard>
            <FieldCard>
              <Label
                htmlFor="caseDescription"
                className="text-[10px] text-gray-400 uppercase tracking-wider font-normal"
              >
                Case Description
              </Label>
              <Input
                id="caseDescription"
                required
                value={form.caseDescription}
                onChange={(e) => set("caseDescription", e.target.value)}
                placeholder="Brief description of the case"
                className="bg-white border-border text-black font-normal h-8 text-sm"
                data-ocid="case.input"
              />
            </FieldCard>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-ocid="case.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addCase.isPending}
              className="bg-primary text-primary-foreground"
              data-ocid="case.submit_button"
            >
              {addCase.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {addCase.isPending ? "Adding..." : "Add Case"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
