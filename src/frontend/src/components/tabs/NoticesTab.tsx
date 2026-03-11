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
import { Bell, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  caseId: string;
}

function FieldCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-md p-2.5 shadow-sm space-y-1">
      {children}
    </div>
  );
}

const NOTICE_TYPES = [
  "1st Demand Notice",
  "Final Demand Notice",
  "Statutory Notice",
];
const DELIVERY_METHODS = ["Email", "Courier", "Physical"];
const DELIVERY_STATUSES = ["Pending", "Delivered", "Failed", "Returned"];
const NOTICE_STATUSES = ["Active", "Expired", "Complied"];

export default function NoticesTab({ caseId: _caseId }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    noticeId: "",
    noticeType: "",
    noticeSentDate: "",
    noticeExpiryDate: "",
    deliveryMethod: "",
    deliveryStatus: "",
    noticeStatus: "",
  });

  const set = (key: string, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSubmitting(false);
    toast.success("Notice record submitted");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="bg-white border-border shadow-sm">
        <CardHeader className="pb-2 pt-3 px-4 border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-sm font-normal text-foreground">
            <Bell className="w-4 h-4 text-primary" />
            Notice Register
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 px-4 pb-4">
          <div className="grid grid-cols-3 gap-2.5 mb-2.5">
            <FieldCard>
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Notice ID
              </Label>
              <Input
                value={form.noticeId}
                onChange={(e) => set("noticeId", e.target.value)}
                placeholder="NTC-XXXX-XXXX"
                className="bg-white border-border text-black font-normal h-7 text-xs"
                data-ocid="notices.input"
              />
            </FieldCard>
            <FieldCard>
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Notice Type
              </Label>
              <Select
                value={form.noticeType}
                onValueChange={(v) => set("noticeType", v)}
              >
                <SelectTrigger
                  className="bg-white border-border text-black font-normal h-7 text-xs"
                  data-ocid="notices.select"
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {NOTICE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldCard>
            <FieldCard>
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Notice Sent Date
              </Label>
              <Input
                type="date"
                value={form.noticeSentDate}
                onChange={(e) => set("noticeSentDate", e.target.value)}
                className="bg-white border-border text-black font-normal h-7 text-xs [&::-webkit-datetime-edit]:font-normal [&::-webkit-datetime-edit-fields-wrapper]:font-normal"
                data-ocid="notices.input"
              />
            </FieldCard>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-2.5">
            <FieldCard>
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Notice Expiry Date
              </Label>
              <Input
                type="date"
                value={form.noticeExpiryDate}
                onChange={(e) => set("noticeExpiryDate", e.target.value)}
                className="bg-white border-border text-black font-normal h-7 text-xs [&::-webkit-datetime-edit]:font-normal [&::-webkit-datetime-edit-fields-wrapper]:font-normal"
                data-ocid="notices.input"
              />
            </FieldCard>
            <FieldCard>
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Delivery Method
              </Label>
              <Select
                value={form.deliveryMethod}
                onValueChange={(v) => set("deliveryMethod", v)}
              >
                <SelectTrigger
                  className="bg-white border-border text-black font-normal h-7 text-xs"
                  data-ocid="notices.select"
                >
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {DELIVERY_METHODS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldCard>
            <FieldCard>
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Delivery Status
              </Label>
              <Select
                value={form.deliveryStatus}
                onValueChange={(v) => set("deliveryStatus", v)}
              >
                <SelectTrigger
                  className="bg-white border-border text-black font-normal h-7 text-xs"
                  data-ocid="notices.select"
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {DELIVERY_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldCard>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-3">
            <FieldCard>
              <Label className="text-[10px] text-gray-400 uppercase tracking-wider font-normal">
                Notice Status
              </Label>
              <Select
                value={form.noticeStatus}
                onValueChange={(v) => set("noticeStatus", v)}
              >
                <SelectTrigger
                  className="bg-white border-border text-black font-normal h-7 text-xs"
                  data-ocid="notices.select"
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {NOTICE_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldCard>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground font-normal h-8 text-sm"
              data-ocid="notices.submit_button"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? "Submitting..." : "Submit Notice"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
