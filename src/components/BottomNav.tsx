import React from 'react';
import { Home, Trash2, Trophy, Wallet, Award } from 'lucide-react';

export type TabKey = 'beranda' | 'iot_bin' | 'leaderboard' | 'bank_sampah' | 'misi';

interface BottomNavProps {
  activeTab: TabKey;
  onChangeTab: (tab: TabKey) => void;
  pendingRewardNotice?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  pendingRewardNotice,
}) => {
  const tabs = [
    {
      key: 'beranda' as TabKey,
      label: 'Edukasi',
      icon: Home,
      accent: 'text-emerald-600',
    },
    {
      key: 'iot_bin' as TabKey,
      label: 'IoT Tong',
      icon: Trash2,
      accent: 'text-emerald-600',
      badge: 'LIVE',
    },
    {
      key: 'leaderboard' as TabKey,
      label: 'Peringkat',
      icon: Trophy,
      accent: 'text-amber-500',
    },
    {
      key: 'bank_sampah' as TabKey,
      label: 'Bank Sampah',
      icon: Wallet,
      accent: 'text-emerald-600',
      notifyDot: pendingRewardNotice,
    },
    {
      key: 'misi' as TabKey,
      label: 'Lencana',
      icon: Award,
      accent: 'text-lime-600',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200">
      <div className="max-w-md mx-auto px-3 py-1 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              id={`nav-tab-${tab.key}`}
              onClick={() => {
                onChangeTab(tab.key);
              }}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-lg transition-colors ${
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

              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'text-emerald-800' : 'text-stone-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
