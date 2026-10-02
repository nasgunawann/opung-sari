import React from 'react';
import { TabKey, UserRole } from '../../App';
import { getNavItemsForRole } from './navigation';
import { School } from 'lucide-react';

interface SidebarProps {
  activeTab: TabKey;
  onChangeTab: (tab: TabKey) => void;
  userRole: UserRole;
  pendingRewardNotice?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onChangeTab,
  userRole,
  pendingRewardNotice,
}) => {
  const tabs = getNavItemsForRole(userRole, pendingRewardNotice);

  return (
    <aside
      aria-label="Navigasi utama"
      className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0 self-start shrink-0 z-40"
    >
      <div className="p-4 border-b border-border mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shrink-0">
            <School size={16} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold tracking-wider uppercase text-primary leading-none truncate">
              Opung Sari
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight font-medium mt-0.5 truncate">
              Basah Bang 5.0
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-muted-foreground mb-3 px-2">
          Menu Navigasi
        </p>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChangeTab(tab.key)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive
                  ? 'bg-accent text-accent-foreground ring-1 ring-border'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className="relative shrink-0">
                <Icon
                  size={18}
                  aria-hidden="true"
                  className={isActive ? 'text-primary' : 'text-muted-foreground'}
                />
                {tab.notifyDot && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-destructive border-2 border-card rounded-full"
                    aria-hidden="true"
                  />
                )}
              </span>

              <span className="truncate">{tab.label}</span>

              {tab.badge && (
                <span className="ml-auto text-[9px] font-bold bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
