import React from 'react';
import { UserRole } from '../App';
import { Student } from '../types';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  userRole: UserRole;
  currentStudent?: Student;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userRole, currentStudent, onLogout }) => {
  const getRoleBadge = () => {
    switch (userRole) {
      case 'student':
        return {
          icon: currentStudent?.avatar || '🎒',
          title: currentStudent?.nickname || currentStudent?.name || 'Siswa',
          subtitle: currentStudent?.className || 'Kelas 5A',
          bgColor: 'bg-emerald-50 text-emerald-900 border-emerald-200',
        };
      case 'coordinator':
        return {
          icon: '👨‍🏫',
          title: 'Pak Budi',
          subtitle: 'Koordinator',
          bgColor: 'bg-blue-50 text-blue-900 border-blue-200',
        };
      case 'admin':
        return {
          icon: '🛡️',
          title: 'Ibu Ratna',
          subtitle: 'Kepala Sekolah',
          bgColor: 'bg-purple-50 text-purple-900 border-purple-200',
        };
    }
  };

  const badge = getRoleBadge();

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border transition-all">
      <div className="w-full px-4 py-2.5 flex items-center justify-between gap-2">
        {/* School Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white text-base shadow-xs">
            🏫
          </div>
          <div>
            <div className="text-xs font-extrabold tracking-tight text-foreground leading-none">
              SD Adiwiyata Pintar
            </div>
            <h1 className="text-[10px] text-muted-foreground leading-tight font-medium mt-0.5">
              Bank Sampah & IoT
            </h1>
          </div>
        </div>

        {/* User Badge & Logout */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-medium ${badge.bgColor}`}>
            <span className="text-sm leading-none">{badge.icon}</span>
            <div className="flex flex-col text-left leading-tight">
              <span className="font-extrabold text-[11px] truncate max-w-[90px] sm:max-w-[130px]">
                {badge.title}
              </span>
              <span className="text-[9px] opacity-75 font-semibold -mt-0.5">
                {badge.subtitle}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Keluar / Ganti Akun"
            className="flex items-center gap-1 h-8 px-2.5 rounded-xl border border-stone-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-stone-600 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
