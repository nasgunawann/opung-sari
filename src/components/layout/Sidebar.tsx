import React from 'react';
import { TabKey, UserRole } from '../../App';
import { getNavItemsForRole } from './navigation';

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
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200 h-screen sticky top-0 self-start shrink-0 z-40">
      <div className="p-4 border-b border-stone-100 mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white text-base font-medium">
            🏫
          </div>
          <div>
            <div className="text-[13px] font-bold tracking-wider uppercase text-emerald-800 leading-none">
              Opung Sari
            </div>
            <h1 className="text-[11px] text-stone-500 leading-tight font-medium mt-0.5">
              Basah Bang 5.0
            </h1>
          </div>
        </div>
      </div>
      
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-stone-500 mb-3 px-2">Menu Navigasi</div>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={() => onChangeTab(tab.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <div className="relative">
                <Icon size={18} className={isActive ? tab.accent : 'text-stone-400'} />
                {tab.notifyDot && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              
              <span>{tab.label}</span>

              {tab.badge && (
                <span className="ml-auto text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
