import React, { useState } from 'react';
import { UserRole } from '../../App';
import { Student } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { LogIn, Sparkles, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      {/* Brand Header */}
      <div className="text-center max-w-md mb-6 space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white text-2xl shadow-md shadow-emerald-700/20 mb-1">
          🏫
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900">
          Opung Sari Basah Bang 5.0
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-medium">
          Sistem Terpadu Bank Sampah, Kas Kelas & IoT Cerdas Deli Serdang
        </p>
      </div>

      {/* Main Login Card */}
      <Card className="w-full max-w-lg border-2 border-stone-200/80 shadow-xl rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-5 sm:p-6 space-y-5">
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <Label htmlFor="login-id" className="text-xs font-bold text-stone-700">
                NIS / NIP / Nama Pengguna
              </Label>
              <Input
                id="login-id"
                placeholder="Contoh: 202405012, Zahra, atau Koordinator"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="rounded-xl border-stone-200 text-sm h-11 focus-visible:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="login-pass" className="text-xs font-bold text-stone-700">
                  Kata Sandi
                </Label>
                <span className="text-[11px] text-stone-600 hover:text-emerald-700 cursor-pointer font-semibold">
                  Lupa sandi?
                </span>
              </div>
              <Input
                id="login-pass"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="rounded-xl border-stone-200 text-sm h-11 focus-visible:ring-emerald-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Masuk Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Quick Demo Switcher / Preset Logins */}
          <div className="pt-4 border-t border-stone-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Pilih Akun Demo Cepat
              </span>
              <span className="text-[10px] text-stone-600 font-medium">1-Klik Langsung Masuk</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* 1. Demo Student */}
              {studentsList.slice(0, 1).map((stu) => (
                <button
                  key={stu.id}
                  type="button"
                  onClick={() => onLogin('student', stu)}
                  className="flex items-center gap-2 p-2.5 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all group cursor-pointer"
                >
                  <span className="text-xl p-1 bg-white rounded-xl shadow-xs border border-stone-200">
                    👦
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-stone-800 group-hover:text-emerald-800 truncate">
                      Andi (Siswa)
                    </div>
                    <div className="text-[10px] text-stone-600 font-medium">
                      Pengurus Kas {stu.className}
                    </div>
                  </div>
                </button>
              ))}

              {/* 2. Demo Coordinator */}
              <button
                type="button"
                onClick={() => onLogin('coordinator')}
                className="flex items-center gap-2 p-2.5 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-blue-50 hover:border-blue-300 text-left transition-all group cursor-pointer"
              >
                <span className="text-xl p-1 bg-white rounded-xl shadow-xs border border-stone-200">
                  👨‍🏫
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-stone-800 group-hover:text-blue-800 truncate">
                    Pak Budi
                  </div>
                  <div className="text-[10px] text-stone-600 font-medium">
                    Koordinator Bank Sampah
                  </div>
                </div>
              </button>

              {/* 3. Demo Principal */}
              <button
                type="button"
                onClick={() => onLogin('admin', undefined, 'kepsek')}
                className="flex items-center gap-2 p-2.5 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-purple-50 hover:border-purple-300 text-left transition-all group cursor-pointer"
              >
                <span className="text-xl p-1 bg-white rounded-xl shadow-xs border border-stone-200">
                  👩‍💼
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-stone-800 group-hover:text-purple-800 truncate">
                    Ibu Ratna
                  </div>
                  <div className="text-[10px] text-stone-600 font-medium">
                    Kepala Sekolah (SMPN 1)
                  </div>
                </div>
              </button>

              {/* 4. Demo Dinas */}
              <button
                type="button"
                onClick={() => onLogin('admin', undefined, 'dinas')}
                className="flex items-center gap-2 p-2.5 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-all group cursor-pointer"
              >
                <span className="text-xl p-1 bg-white rounded-xl shadow-xs border border-stone-200">
                  🏢
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-stone-800 group-hover:text-amber-800 truncate">
                    Bpk. Anwar
                  </div>
                  <div className="text-[10px] text-stone-600 font-medium">
                    Dinas Lingkungan Hidup
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Provisioning Notice (PRD FR-AUTH-03) */}
          <div className="bg-stone-50 border border-stone-200 p-3 rounded-2xl flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
            <div className="text-[11px] text-stone-600 leading-relaxed">
              <span className="font-bold text-stone-700">Akses Internal Sekolah:</span> Akun siswa, wali kelas, dan koordinator didaftarkan oleh administrator sekolah. Jika belum terdaftar atau lupa kata sandi, hubungi Koordinator Bank Sampah Sekolah.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="mt-6 text-center text-xs text-stone-600 font-medium">
        Platform Inovasi Kolaborasi Sekolah Hijau & Dinas Pendidikan Deli Serdang
      </div>
    </div>
  );
};
