import React, { useState } from 'react';
import { Sparkles, Award, Wallet, ChevronDown, UserCheck } from 'lucide-react';
import { Student } from '../types';

interface HeaderProps {
  currentStudent: Student;
  studentsList: Student[];
  onSelectStudent: (student: Student) => void;
  onOpenWithdrawal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStudent,
  studentsList,
  onSelectStudent,
  onOpenWithdrawal,
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
    <header className="sticky top-0 z-30 bg-white border-b border-stone-200">
      <div className="max-w-md mx-auto px-4 py-2.5">
        {/* Top bar: School branding */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white text-sm font-medium">
              🌱
            </div>
            <div>
              <div className="text-[11px] font-semibold tracking-wider uppercase text-emerald-800 leading-none">
                SD Adiwiyata Pintar
              </div>
              <h1 className="text-[11px] text-stone-500 leading-tight">
                Bank Sampah & IoT Sekolah
              </h1>
            </div>
          </div>
        </div>

        {/* Student Active Bar & Switcher */}
        <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-xl p-2 relative">
          <button
            id="btn-student-switcher"
            onClick={() => {
              setShowStudentPicker(!showStudentPicker);
            }}
            className="flex items-center gap-2 text-left group"
          >
            <div className="relative">
              <span className="text-xl">{currentStudent.avatar}</span>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-stone-800 text-white rounded-full text-[8px] font-bold flex items-center justify-center">
                {currentStudent.level}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-stone-900 text-xs group-hover:text-emerald-800 transition-colors">
                  {currentStudent.name}
                </span>
                <ChevronDown size={12} className="text-stone-400 group-hover:text-stone-700" />
              </div>
              <div className="text-[10px] text-stone-500 flex items-center gap-1">
                <span className="font-medium text-stone-600">{currentStudent.className}</span>
                <span>•</span>
                <span>{currentStudent.levelTitle}</span>
              </div>
            </div>
          </button>

          {/* Quick Badges: Poin & Saldo */}
          <div className="flex items-center gap-1.5">
            {/* Eco Points */}
            <div className="bg-white border border-stone-200 px-2 py-1 rounded-lg text-right">
              <div className="text-[9px] text-stone-400 font-medium leading-none">Poin</div>
              <div className="text-xs font-bold text-stone-800 leading-tight">
                {currentStudent.points}
              </div>
            </div>

            {/* Bank Balance */}
            <button
              id="btn-quick-withdraw"
              onClick={() => {
                onOpenWithdrawal();
              }}
              title="Tarik Saldo"
              className="bg-emerald-800 hover:bg-emerald-900 text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Wallet size={12} />
              <div className="text-left leading-none">
                <div className="text-[8px] text-emerald-200">Saldo</div>
                <div className="text-[11px] font-semibold">
                  {formatCurrency(currentStudent.balanceRp)}
                </div>
              </div>
            </button>
          </div>

          {/* Dropdown switch student */}
          {showStudentPicker && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-stone-200 shadow-sm p-1.5 z-50">
              <div className="text-[10px] font-semibold text-stone-500 px-2 py-1 flex items-center justify-between border-b border-stone-100">
                <span>Pilih Akun Siswa</span>
                <span className="text-stone-400">
                  {studentsList.length} Siswa
                </span>
              </div>
              <div className="max-h-56 overflow-y-auto space-y-0.5 mt-1">
                {studentsList.map((stu) => {
                  const isCurrent = stu.id === currentStudent.id;
                  return (
                    <button
                      key={stu.id}
                      onClick={() => {
                        onSelectStudent(stu);
                        setShowStudentPicker(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                        isCurrent
                          ? 'bg-stone-100 text-stone-900 font-semibold'
                          : 'hover:bg-stone-50 text-stone-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{stu.avatar}</span>
                        <div>
                          <div className="text-xs font-medium text-stone-900">{stu.name}</div>
                          <div className="text-[10px] text-stone-400">
                            {stu.className} • NIS {stu.nis}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-emerald-800">
                          {formatCurrency(stu.balanceRp)}
                        </div>
                        <div className="text-[10px] text-stone-400">
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
      </div>
    </header>
  );
};
