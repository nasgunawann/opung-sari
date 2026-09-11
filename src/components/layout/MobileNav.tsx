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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200">
      <div className="max-w-md mx-auto px-3 py-1 flex items-center justify-around pb-[env(safe-area-inset-bottom)] overflow-x-auto gap-2 hide-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={() => onChangeTab(tab.key)}
              className={`relative flex flex-col items-center justify-center min-w-[4rem] py-1.5 px-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-emerald-800 font-semibold'
                  : 'text-stone-400 hover:text-stone-700 font-normal'
              }`}
            >
              <div className="relative">
                <Icon size={19} strokeWidth={isActive ? 2.2 : 1.7} />

                {/* Badge if any */}
                {tab.badge && (
                  <span className="absolute -top-1 -right-2.5 bg-stone-900 text-white font-mono text-[8px] px-1 py-0 rounded">
                    {tab.badge}
                  </span>
                )}

                {/* Notification dot */}
                {tab.notifyDot && !isActive && (
                  <span className="absolute -top-0.5 -right-1 w-1.5 h-1.5 bg-emerald-700 rounded-full" />
                )}
              </div>

              <span className={`text-[10px] mt-1 tracking-tight whitespace-nowrap ${isActive ? 'text-emerald-800' : 'text-stone-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
