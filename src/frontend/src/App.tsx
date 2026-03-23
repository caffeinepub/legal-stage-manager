import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AppLayout from "./components/AppLayout";
import { useSeedData } from "./hooks/useQueries";
import CaseDetail from "./pages/CaseDetail";
import CaseQueue from "./pages/CaseQueue";
import Reports from "./pages/Reports";

type Page = "queue" | "reports";

export default function App() {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<Page>("queue");
  useSeedData();

  const handleNavigate = (page: Page) => {
    setActivePage(page);
    if (page !== "queue") setSelectedCaseId(null);
  };

  return (
    <AppLayout activePage={activePage} onNavigate={handleNavigate}>
      {activePage === "queue" ? (
        <CaseQueue onSelectCase={(id) => setSelectedCaseId(id)} />
      ) : (
        <Reports />
      )}

      {activePage === "queue" && selectedCaseId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div
            className="bg-white rounded-lg shadow-2xl overflow-hidden"
            style={{ width: "72vw", height: "90vh" }}
          >
            <CaseDetail
              caseId={selectedCaseId}
              onClose={() => setSelectedCaseId(null)}
            />
          </div>
        </div>
      )}

      <Toaster richColors position="top-right" />
    </AppLayout>
  );
}
