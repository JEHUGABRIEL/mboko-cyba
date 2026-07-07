import { ChevronRight, LogOut } from 'lucide-react';
import type { ReactNode } from 'react';

export interface TabItem {
  id: string;
  name: string;
  icon: ReactNode;
  subTabs?: { id: string; name: string; icon: ReactNode }[];
}

interface AdminSidebarProps {
  tabs: TabItem[];
  activeTab: string;
  activeSubTab: string | null;
  expandedSections: Record<string, boolean>;
  sidebarOpen: boolean;
  onTabChange: (id: string) => void;
  onSubTabChange: (parentId: string, subId: string) => void;
  onToggleSection: (id: string) => void;
  onLogoutClick: () => void;
  onSidebarClose: () => void;
}

export function AdminSidebar({
  tabs,
  activeTab,
  activeSubTab,
  expandedSections,
  sidebarOpen,
  onTabChange,
  onSubTabChange,
  onToggleSection,
  onLogoutClick,
  onSidebarClose,
}: AdminSidebarProps) {
  const isActive = (tabId: string, subId?: string) => {
    if (subId) return activeTab === tabId && activeSubTab === subId;
    return activeTab === tabId && !activeSubTab;
  };

  return (
    <>
      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden animate-fade-in"
          onClick={onSidebarClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-16 md:top-16 left-0 z-30 w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col transition-transform duration-300 ease-out h-[calc(100vh-4rem)] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 pb-3">
          <h2 className="text-lg font-bold text-white/90">Navigation</h2>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {tabs.map((tab) => {
            const hasSubTabs = tab.subTabs && tab.subTabs.length > 0;
            const isExpanded = expandedSections[tab.id] ?? true;

            return (
              <div key={tab.id}>
                {/* Parent button */}
                <button
                  onClick={() => {
                    if (hasSubTabs) {
                      onToggleSection(tab.id);
                      // If collapsing, don't change active tab
                      if (!isExpanded) {
                        onTabChange(tab.id);
                        // Auto-select first sub-tab if expanding
                        if (tab.subTabs && tab.subTabs.length > 0) {
                          onSubTabChange(tab.id, tab.subTabs[0].id);
                        }
                      }
                    } else {
                      onTabChange(tab.id);
                    }
                    onSidebarClose();
                  }}
                  className={`group w-full flex items-center gap-3 px-6 py-4 text-left transition-all duration-200 ease-out ${
                    isActive(tab.id)
                      ? 'bg-brand-600 text-white border-l-4 border-white shadow-lg shadow-brand-600/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white border-l-4 border-transparent hover:border-l-white/20'
                  }`}
                >
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5 shrink-0">
                    {tab.icon}
                  </span>
                  <span className="font-medium flex-1">{tab.name}</span>
                  {hasSubTabs && (
                    <span
                      className="text-slate-500 transition-all duration-200 ease-out shrink-0"
                      style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                    >
                      <ChevronRight size={16} />
                    </span>
                  )}
                </button>

                {/* Sub-tabs */}
                {hasSubTabs && isExpanded && (
                  <div className="animate-slide-down">
                    {tab.subTabs!.map((sub, idx) => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          onSubTabChange(tab.id, sub.id);
                          onTabChange(tab.id);
                          onSidebarClose();
                        }}
                        className={`animate-sub-item-in group w-full flex items-center gap-3 pl-12 pr-6 py-3 text-left transition-all duration-200 ease-out ${
                          isActive(tab.id, sub.id)
                            ? 'bg-brand-600/80 text-white border-l-4 border-white shadow-md shadow-brand-600/10'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white border-l-4 border-transparent hover:border-l-white/20'
                        }`}
                        style={{ animationDelay: `${idx * 0.06}s` }}
                      >
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5 shrink-0">
                          {sub.icon}
                        </span>
                        <span className="text-sm">{sub.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout button at sidebar bottom */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogoutClick}
            className="group w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 text-slate-300 rounded-lg transition-all duration-200 ease-out hover:bg-brand-600 hover:text-white hover:shadow-lg hover:shadow-brand-600/20 active:scale-[0.97]"
          >
            <LogOut size={18} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );
}
