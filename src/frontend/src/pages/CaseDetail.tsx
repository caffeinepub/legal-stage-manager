import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import EnforcementTab from "../components/tabs/EnforcementTab";
import LitigationTab from "../components/tabs/LitigationTab";
import NoticesTab from "../components/tabs/NoticesTab";
import OverviewTab from "../components/tabs/OverviewTab";
import { useGetCase } from "../hooks/useQueries";

type Tab = "overview" | "litigation" | "enforcement" | "notices";

interface Props {
  caseId: string;
  onBack: () => void;
}

function getStatusBadge(status: string) {
  const s = status.toLowerCase();
  if (s.includes("litigation") || s.includes("trial"))
    return (
      <Badge className="bg-[oklch(0.6_0.22_18/0.2)] text-[oklch(0.82_0.18_25)] border-[oklch(0.6_0.22_18/0.4)] border">
        {status}
      </Badge>
    );
  if (s === "active")
    return (
      <Badge className="bg-[oklch(0.65_0.18_142/0.2)] text-[oklch(0.82_0.16_142)] border-[oklch(0.65_0.18_142/0.4)] border">
        {status}
      </Badge>
    );
  if (s === "settled")
    return (
      <Badge className="bg-[oklch(0.6_0.014_245/0.2)] text-[oklch(0.75_0.014_245)] border-[oklch(0.6_0.014_245/0.4)] border">
        {status}
      </Badge>
    );
  if (s.includes("judgment"))
    return (
      <Badge className="bg-[oklch(0.55_0.14_245/0.2)] text-[oklch(0.78_0.14_245)] border-[oklch(0.55_0.14_245/0.4)] border">
        {status}
      </Badge>
    );
  return <Badge variant="outline">{status}</Badge>;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "litigation", label: "Litigation" },
  { id: "enforcement", label: "Enforcement" },
  { id: "notices", label: "Notices" },
];

export default function CaseDetail({ caseId, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { data: caseData, isLoading } = useGetCase(caseId);

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Case Header */}
      <div className="border-b border-border bg-card/40 px-6 py-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground -ml-2"
              data-ocid="detail.secondary_button"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Case Queue
            </Button>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : caseData ? (
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-display font-bold text-xl text-foreground">
                    {caseData.customerName}
                  </h2>
                  {getStatusBadge(caseData.status)}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-muted-foreground">
                    Case ID:{" "}
                    <span className="font-mono text-primary font-semibold">
                      {caseData.caseId}
                    </span>
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Contract:{" "}
                    <span className="font-mono text-xs">
                      {caseData.contractId}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Case not found</p>
          )}
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="border-b border-border bg-card/20 px-6">
        <div className="max-w-screen-xl mx-auto flex items-center gap-1 py-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-display font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
              data-ocid={`detail.${tab.id}.tab`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <main className="flex-1 px-6 py-6">
        <div className="max-w-screen-xl mx-auto animate-fade-in">
          {activeTab === "overview" && <OverviewTab caseId={caseId} />}
          {activeTab === "litigation" && <LitigationTab caseId={caseId} />}
          {activeTab === "enforcement" && <EnforcementTab caseId={caseId} />}
          {activeTab === "notices" && <NoticesTab caseId={caseId} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
