import React from 'react';
import { TabKey, UserRole } from '../../App';
import { getNavItemsForRole } from './navigation';

interface MobileNavProps {
  activeTab: TabKey;
  onChangeTab: (tab: TabKey) => void;
  userRole: UserRole;
  pendingRewardNotice?: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onChangeTab,
  userRole,
  pendingRewardNotice,
}) => {
  const tabs = getNavItemsForRole(userRole, pendingRewardNotice);

  return (
    <nav
      aria-label="Navigasi utama"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border"
    >
      <div className="max-w-md mx-auto px-1 flex items-end justify-between pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          const isCenter = tab.key === 'iot_bin';

          if (isCenter) {
            return (
              <div key={tab.key} className="relative flex flex-col items-center justify-center flex-1 pb-2">
                <button
                  type="button"
                  onClick={() => onChangeTab(tab.key)}
                  aria-label={tab.label}
                  aria-current={isActive ? 'page' : undefined}
                  className="absolute -top-6 flex items-center justify-center w-14 h-14 rounded-full border-4 border-background bg-primary text-primary-foreground shadow-sm transition-transform active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Icon size={24} strokeWidth={2.5} aria-hidden="true" />
                </button>
                <span
                  aria-hidden="true"
                  className={`text-[10px] mt-9 tracking-tight whitespace-nowrap font-bold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {tab.label}
                </span>
              </div>
            );
          }

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChangeTab(tab.key)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center flex-1 py-2 px-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-muted-foreground hover:text-foreground font-medium'
              }`}
            >
              <div className="relative mb-1">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />

                {tab.badge && (
                  <span className="absolute -top-1 -right-2.5 bg-destructive text-destructive-foreground text-[8px] px-1 py-0 rounded-full font-bold">
                    {tab.badge}
                  </span>
                )}

                {tab.notifyDot && !isActive && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full border-2 border-card"
                    aria-hidden="true"
                  />
                )}
              </div>

              <span className="text-[10px] tracking-tight whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
