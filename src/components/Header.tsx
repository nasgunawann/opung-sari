import React from 'react';
import { UserRole } from '../App';
import { Student } from '../types';
import { LogOut, School, GraduationCap, Presentation, ShieldCheck } from 'lucide-react';
import { StudentAvatar } from '../lib/appIcons';

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
          Icon: GraduationCap,
          title: currentStudent?.nickname || currentStudent?.name || 'Siswa',
          subtitle: currentStudent?.className || 'Kelas 5A',
          bgColor: 'bg-accent text-accent-foreground border-border',
        };
      case 'coordinator':
        return {
          Icon: Presentation,
          title: 'Pak Budi',
          subtitle: 'Koordinator',
          bgColor: 'bg-muted text-foreground border-border',
        };
      case 'admin':
        return {
          Icon: ShieldCheck,
          title: 'Ibu Ratna',
          subtitle: 'Kepala Sekolah',
          bgColor: 'bg-muted text-foreground border-border',
        };
    }
  };

  const badge = getRoleBadge();

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="w-full px-4 py-2.5 flex items-center justify-between gap-2">
        {/* School Branding */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shrink-0">
            <School size={16} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-extrabold tracking-tight text-foreground leading-none truncate">
              MTsN 2 Deli Serdang
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight font-medium mt-0.5 truncate">
              Bank Sampah &amp; IoT
            </p>
          </div>
        </div>

        {/* User Badge & Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-medium ${badge.bgColor}`}>
            {userRole === 'student' ? (
              <StudentAvatar name={currentStudent?.name ?? 'Siswa'} size={18} />
            ) : (
              <badge.Icon size={14} aria-hidden="true" />
            )}
            <div className="flex flex-col text-left leading-tight min-w-0">
              <span className="font-extrabold text-[11px] truncate max-w-[90px] sm:max-w-[130px]">
                {badge.title}
              </span>
              <span className="text-[9px] opacity-75 font-semibold -mt-0.5 truncate">
                {badge.subtitle}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            aria-label="Keluar / ganti akun"
            className="flex items-center gap-1 h-10 px-2.5 rounded-xl border border-border bg-card hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 text-muted-foreground text-xs font-bold transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LogOut size={13} aria-hidden="true" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
