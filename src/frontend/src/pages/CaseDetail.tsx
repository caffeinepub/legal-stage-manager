import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import EnforcementTab from "../components/tabs/EnforcementTab";
import InvestigationTab from "../components/tabs/InvestigationTab";
import LitigationTab from "../components/tabs/LitigationTab";
import NoticesTab from "../components/tabs/NoticesTab";
import OverviewTab from "../components/tabs/OverviewTab";
import { useGetCase } from "../hooks/useQueries";

type Tab =
  | "overview"
  | "investigation"
  | "litigation"
  | "enforcement"
  | "notices";

interface Props {
  caseId: string;
  onClose: () => void;
}

function getDefaultTab(status: string): Tab {
  const s = status.toLowerCase();
  if (s.includes("litigation") || s.includes("judgment")) return "litigation";
  if (s.includes("enforcement")) return "enforcement";
  return "overview";
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
  { id: "investigation", label: "Investigation" },
  { id: "litigation", label: "Litigation" },
  { id: "enforcement", label: "Enforcement" },
  { id: "notices", label: "Notices" },
];

export default function CaseDetail({ caseId, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { data: caseData, isLoading } = useGetCase(caseId);

  useEffect(() => {
    if (caseData?.status) {
      setActiveTab(getDefaultTab(caseData.status));
    }
  }, [caseData?.status]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Case Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3.5 w-32" />
              </div>
            ) : caseData ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-base text-gray-900">
                    {caseData.customerName}
                  </h2>
                  {getStatusBadge(caseData.status)}
                </div>
                <div className="flex items-center gap-5">
                  <span className="text-xs text-gray-500">
                    Case ID:{" "}
                    <span className="font-mono text-blue-600">
                      {caseData.caseId}
                    </span>
                  </span>
                  <span className="text-xs text-gray-500">
                    Contract:{" "}
                    <span className="font-mono text-xs">
                      {caseData.contractId}
                    </span>
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Case not found</p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 -mt-1 -mr-2"
            data-ocid="detail.close_button"
            aria-label="Close case detail"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-gray-200 bg-white px-6 flex-shrink-0">
        <div className="flex items-center gap-1 py-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-normal transition-all ${
                activeTab === tab.id
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              }`}
              data-ocid={`detail.${tab.id}.tab`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-5 py-3">
        {activeTab === "overview" && <OverviewTab caseId={caseId} />}
        {activeTab === "investigation" && <InvestigationTab caseId={caseId} />}
        {activeTab === "litigation" && <LitigationTab caseId={caseId} />}
        {activeTab === "enforcement" && <EnforcementTab caseId={caseId} />}
        {activeTab === "notices" && <NoticesTab caseId={caseId} />}
      </div>
    </div>
  );
}
