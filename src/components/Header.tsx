import React, { useState } from 'react';
import { Sparkles, Award, Wallet, ChevronDown, UserCheck } from 'lucide-react';
import { Student } from '../types';
import { UserRole } from '../App';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface HeaderProps {
  currentStudent: Student;
  studentsList: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenWithdrawal: () => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStudent,
  studentsList,
  onSelectStudent,
  onOpenWithdrawal,
  userRole,
  setUserRole,
}) => {
  const [showStudentPicker, setShowStudentPicker] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
      <header className="sticky top-0 z-30 bg-white border-b border-stone-200 shadow-sm transition-all duration-300">
        <div className={`w-full px-4 py-3`}>
          {/* Top bar: School branding & Role Switcher */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className={`flex items-center gap-2 ${userRole === 'student' ? 'md:hidden' : ''}`}>
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white text-base font-medium">
              🏫
            </div>
            <div>
              <div className="text-[12px] font-bold tracking-wider uppercase text-emerald-800 leading-none">
                SD Adiwiyata Pintar
              </div>
              <h1 className="text-[10px] text-stone-500 leading-tight font-medium mt-0.5">
                Bank Sampah & IoT
              </h1>
            </div>
          </div>
          
          <div className={`w-32 ${userRole === 'student' ? 'ml-auto' : ''}`}>
            <Select value={userRole} onValueChange={(val) => setUserRole(val as UserRole)}>
              <SelectTrigger className="h-7 text-[10px] border-stone-200 focus:ring-0 focus:ring-offset-0 bg-stone-50">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student" className="text-[11px]">👨‍🎓 Siswa</SelectItem>
                <SelectItem value="coordinator" className="text-[11px]">👨‍🏫 Koordinator</SelectItem>
                <SelectItem value="admin" className="text-[11px]">🛡️ Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Student Active Bar & Switcher */}
        {userRole === 'student' && currentStudent && (
          <div className="flex items-center justify-between bg-white border border-stone-200 shadow-sm rounded-xl p-2 relative">
            <button
              id="btn-student-switcher"
              onClick={() => {
                setShowStudentPicker(!showStudentPicker);
              }}
              className="flex items-center gap-2 text-left group"
            >
              <div className="relative">
                <span className="text-2xl">{currentStudent?.avatar || '🎓'}</span>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-stone-900 text-white rounded-full text-[9px] font-bold flex items-center justify-center border border-white">
                  {currentStudent?.level ?? 1}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-stone-900 text-sm group-hover:text-emerald-800 transition-colors">
                    {currentStudent?.name || 'Siswa'}
                  </span>
                  <ChevronDown size={14} className="text-stone-400 group-hover:text-stone-700" />
                </div>
                <div className="text-[11px] text-stone-500 flex items-center gap-1">
                  <span className="font-medium text-stone-700">{currentStudent?.className || '-'}</span>
                  <span>•</span>
                  <span>{currentStudent?.levelTitle || 'Pemula'}</span>
                </div>
              </div>
            </button>

            {/* Quick Badges: Poin & Saldo */}
            <div className="flex items-center gap-2">
              <div className="bg-stone-50 border border-stone-200 px-2.5 py-1.5 rounded-lg text-right">
                <div className="text-[9px] text-stone-500 font-medium leading-none mb-0.5">Poin</div>
                <div className="text-xs font-bold text-stone-900 leading-tight">
                  {currentStudent?.points ?? 0}
                </div>
              </div>

              <button
                id="btn-quick-withdraw"
                onClick={() => {
                  onOpenWithdrawal();
                }}
                title="Tarik Saldo"
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Wallet size={14} className="text-emerald-200" />
                <div className="text-left leading-none">
                  <div className="text-[9px] text-emerald-200 font-medium mb-0.5">Saldo</div>
                  <div className="text-xs font-bold tracking-tight">
                    {formatCurrency(currentStudent?.balanceRp ?? 0)}
                  </div>
                </div>
              </button>
            </div>

            {/* Dropdown switch student */}
            {showStudentPicker && (
              <div className="absolute top-[110%] left-0 right-0 bg-white rounded-xl border border-stone-200 shadow-lg p-2 z-50">
                <div className="text-[11px] font-semibold text-stone-500 px-2 py-1 mb-1 flex items-center justify-between border-b border-stone-100 pb-2">
                  <span>Pilih Akun Siswa (Mock)</span>
                  <span className="text-stone-400">
                    {studentsList.length} Siswa
                  </span>
                </div>
                <div className="max-h-56 overflow-y-auto space-y-1">
                  {studentsList.map((stu) => {
                    const isCurrent = stu.id === currentStudent.id;
                    return (
                      <button
                        key={stu.id}
                        onClick={() => {
                          onSelectStudent(stu);
                          setShowStudentPicker(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-colors ${
                          isCurrent
                            ? 'bg-stone-100 text-stone-900 ring-1 ring-stone-200'
                            : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{stu.avatar}</span>
                          <div>
                            <div className="text-sm font-semibold">{stu.name}</div>
                            <div className="text-[11px] text-stone-500 font-medium">
                              {stu.className} • NIS {stu.nis}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-emerald-700">
                            {formatCurrency(stu.balanceRp)}
                          </div>
                          <div className="text-[11px] text-stone-500 font-medium">
                            {stu.points} pts
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        
        {userRole === 'coordinator' && (
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
            <div className="text-2xl mt-0.5">👨‍🏫</div>
            <div>
              <div className="text-sm font-bold text-blue-900">Bapak Budi (Koordinator)</div>
              <div className="text-[11px] text-blue-700 mt-0.5">Anda sedang dalam mode Koordinator Bank Sampah. (Akses Input Timbangan)</div>
            </div>
          </div>
        )}
        
        {userRole === 'admin' && (
          <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl flex items-start gap-3">
            <div className="text-2xl mt-0.5">🛡️</div>
            <div>
              <div className="text-sm font-bold text-purple-900">Admin Sekolah</div>
              <div className="text-[11px] text-purple-700 mt-0.5">Mode Admin. (Akses Laporan & Master Data)</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};