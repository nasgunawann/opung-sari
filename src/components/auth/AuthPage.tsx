import React, { useState } from 'react';
import { UserRole } from '../../App';
import { Student } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import {
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  School,
  UserRound,
  Presentation,
  Briefcase,
  Building2,
} from 'lucide-react';

interface AuthPageProps {
  studentsList: Student[];
  onLogin: (role: UserRole, student?: Student, adminPersona?: 'kepsek' | 'dinas') => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  studentsList,
  onLogin,
}) => {
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const query = loginIdentifier.trim().toLowerCase();

    // Match by student name or NIS, else coordinator, else admin, else first student
    const matchedStudent = studentsList.find(
      (s) =>
        s.nis.toLowerCase() === query ||
        s.name.toLowerCase().includes(query) ||
        s.nickname.toLowerCase() === query
    );

    if (matchedStudent) {
      onLogin('student', matchedStudent);
    } else if (query.includes('koor') || query.includes('budi') || query.includes('guru')) {
      onLogin('coordinator');
    } else if (query.includes('admin') || query.includes('ratna') || query.includes('kepala')) {
      onLogin('admin');
    } else {
      onLogin('student', studentsList[0]);
    }
  };

  const demoButtons = [
    {
      key: 'student',
      Icon: UserRound,
      title: 'Andi',
      subtitle: `Pengurus Kas ${studentsList[0]?.className ?? 'MTs'}`,
      onClick: () => onLogin('student', studentsList[0]),
    },
    {
      key: 'coordinator',
      Icon: Presentation,
      title: 'Pak Budi',
      subtitle: 'Koordinator Bank Sampah',
      onClick: () => onLogin('coordinator'),
    },
    {
      key: 'principal',
      Icon: Briefcase,
      title: 'Ibu Ratna',
      subtitle: 'Kepala Madrasah MTsN 2',
      onClick: () => onLogin('admin', undefined, 'kepsek'),
    },
    {
      key: 'dinas',
      Icon: Building2,
      title: 'Bpk. Anwar',
      subtitle: 'Dinas Lingkungan Hidup',
      onClick: () => onLogin('admin', undefined, 'dinas'),
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      {/* Brand Header */}
      <div className="text-center max-w-md mb-6 space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20 mb-1">
          <School size={28} aria-hidden="true" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Opung Sari Basah Bang 5.0
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          Sistem Terpadu Bank Sampah, Kas Kelas &amp; IoT Cerdas Deli Serdang
        </p>
      </div>

      {/* Main Login Card */}
      <Card className="w-full max-w-lg shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-5 sm:p-6 space-y-5">
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-id" className="text-xs font-bold text-foreground">
                NIS / NIP / Nama Pengguna
              </Label>
              <Input
                id="login-id"
                placeholder="Contoh: 202405012"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="login-pass" className="text-xs font-bold text-foreground">
                Kata Sandi
              </Label>
              <Input
                id="login-pass"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-2xl text-sm font-bold gap-2"
            >
              <span>Masuk Sekarang</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </form>

          {/* Quick Demo Switcher / Preset Logins */}
          <div className="pt-4 border-t border-border space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-extrabold tracking-wide text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                Pilih Akun Demo Cepat
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">1-klik langsung masuk</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoButtons.map(({ key, Icon, title, subtitle, onClick }) => (
                <button
                  key={key}
                  type="button"
                  onClick={onClick}
                  className="flex items-center gap-2 p-2.5 rounded-2xl border border-border bg-muted/50 hover:bg-accent hover:border-primary/40 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <span className="p-1 rounded-xl bg-card border border-border text-primary">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-foreground truncate">
                      {title}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-medium truncate">
                      {subtitle}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Provisioning Notice (PRD FR-AUTH-03) */}
          <div className="bg-muted/50 border border-border p-3 rounded-2xl flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-bold text-foreground">Akses internal sekolah:</span> Akun siswa, wali kelas, dan koordinator didaftarkan oleh administrator sekolah. Jika belum terdaftar atau lupa kata sandi, hubungi Koordinator Bank Sampah Sekolah.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="mt-6 text-center text-xs text-muted-foreground font-medium">
        Platform Inovasi Kolaborasi Sekolah Hijau &amp; Dinas Pendidikan Deli Serdang
      </div>
    </div>
  );
};
