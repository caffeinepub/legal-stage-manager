import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AppLayout from "./components/AppLayout";
import { useSeedData } from "./hooks/useQueries";
import CaseDetail from "./pages/CaseDetail";
import CaseQueue from "./pages/CaseQueue";

export type AppPage = { view: "queue" } | { view: "detail"; caseId: string };

export default function App() {
  const [page, setPage] = useState<AppPage>({ view: "queue" });
  useSeedData();

  return (
    <AppLayout onNavigate={(view) => setPage({ view })} currentView={page.view}>
      {page.view === "queue" && (
        <CaseQueue
          onSelectCase={(id) => setPage({ view: "detail", caseId: id })}
        />
      )}
      {page.view === "detail" && (
        <CaseDetail
          caseId={page.caseId}
          onBack={() => setPage({ view: "queue" })}
        />
      )}
      <Toaster richColors position="top-right" />
    </AppLayout>
  );
}
