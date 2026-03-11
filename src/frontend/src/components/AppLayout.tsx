import {
  ChevronDown,
  ChevronRight,
  Globe,
  LogOut,
  Menu,
  Search,
  User,
} from "lucide-react";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [legalExpanded, setLegalExpanded] = useState(true);
  const [sidebarSearch, setSidebarSearch] = useState("");

  const sidebarWidth = sidebarOpen ? 260 : 0;

  return (
    <div className="min-h-screen bg-background font-body flex flex-col">
      {/* Fixed Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-14"
        style={{ borderBottomColor: "#e5e7eb" }}
      >
        {/* Left: Logo + Title + Hamburger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-600"
            data-ocid="sidebar.toggle"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#3B1F00] flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-[#3B1F00] text-base tracking-tight">
              NLS TECH
            </span>
          </div>
        </div>

        {/* Center: App title */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <span className="font-display font-bold text-gray-800 text-base tracking-tight">
            NLS TECH - Kollect Lite Portal
          </span>
        </div>

        {/* Right: LSM badge + user + logout */}
        <div className="flex items-center gap-3">
          <span className="bg-gray-900 text-white text-xs font-bold px-2.5 py-1 rounded font-mono">
            KLP
          </span>
          <div className="flex items-center gap-1.5 text-gray-600">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium hidden md:block">
              admin@nlstech.co.ke
            </span>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-1.5 rounded transition-colors"
            data-ocid="header.logout.button"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Body: sidebar + content */}
      <div className="flex flex-1 pt-14">
        {/* Sidebar */}
        <aside
          className="fixed top-14 left-0 bottom-0 z-40 overflow-hidden transition-all duration-300 flex-shrink-0"
          style={{ width: sidebarWidth, backgroundColor: "#3B1F00" }}
        >
          {sidebarOpen && (
            <div className="flex flex-col h-full w-[260px]">
              {/* Sidebar header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-[#5a3200]">
                <span className="text-white font-display font-bold text-xs uppercase tracking-widest">
                  Kollect Lite
                </span>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Collapse sidebar"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Search */}
              <div className="px-3 py-3 border-b border-[#5a3200]">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search menu..."
                    value={sidebarSearch}
                    onChange={(e) => setSidebarSearch(e.target.value)}
                    className="w-full bg-[#2a1600] text-white placeholder-white/40 text-sm rounded pl-8 pr-3 py-1.5 border border-[#5a3200] focus:outline-none focus:border-white/40"
                    data-ocid="sidebar.search_input"
                  />
                </div>
              </div>

              {/* Navigation — Legal only */}
              <nav className="flex-1 overflow-y-auto py-2">
                <div>
                  <button
                    type="button"
                    onClick={() => setLegalExpanded((v) => !v)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-white hover:bg-[#5a3200] transition-colors group"
                  >
                    <span className="font-display font-bold text-sm">
                      Legal
                    </span>
                    {legalExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-white/60" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-white/60" />
                    )}
                  </button>
                  {legalExpanded && (
                    <div className="ml-4">
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 text-sm transition-colors rounded-l-none bg-[#5a3200] text-white font-semibold border-l-2 border-[#c19a51]"
                        data-ocid="sidebar.link"
                      >
                        Legal Queue
                      </button>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main
          className="flex-1 transition-all duration-300 min-w-0"
          style={{ marginLeft: sidebarWidth }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
