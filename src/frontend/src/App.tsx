import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AppLayout from "./components/AppLayout";
import { useSeedData } from "./hooks/useQueries";
import CaseDetail from "./pages/CaseDetail";
import CaseQueue from "./pages/CaseQueue";

export default function App() {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  useSeedData();

  return (
    <AppLayout>
      <CaseQueue onSelectCase={(id) => setSelectedCaseId(id)} />

      {selectedCaseId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div
            className="bg-white rounded-lg shadow-2xl overflow-hidden"
            style={{ width: "90vw", height: "80vh" }}
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
