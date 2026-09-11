import React, { useState } from 'react';
import {
  Trophy,
  Users,
  Medal,
  Crown,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Scale,
  Award,
  Filter,
} from 'lucide-react';
import { SchoolClass, Student } from '../types';

interface LeaderboardTabProps {
  classes: SchoolClass[];
  students: Student[];
  currentStudent: Student;
}

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({
  classes,
  students,
  currentStudent,
}) => {
  const [viewMode, setViewMode] = useState<'class' | 'student'>('class');
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');

  // Sort classes by totalPoints descending
  const sortedClasses = [...classes].sort((a, b) => b.totalPoints - a.totalPoints);

  // Filter classes by grade
  const filteredClasses =
    selectedGrade === 'all'
      ? sortedClasses
      : sortedClasses.filter((c) => c.grade === selectedGrade);

  // Sort students by points descending
  const sortedStudents = [...students].sort((a, b) => b.points - a.points);

  const topThreeClasses = sortedClasses.slice(0, 3);
  const topThreeStudents = sortedStudents.slice(0, 3);

  return (
    <div className="space-y-3 pb-20 pt-1">
      {/* Header Info - Flat Solid Dark Visual Anchor */}
      <div className="bg-stone-900 text-white rounded-xl p-4 border border-stone-950">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-stone-300 bg-stone-800 px-2 py-0.5 rounded">
              <span>🏆</span>
              <span>Papan Peringkat Adiwiyata</span>
            </div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Peringkat Pemilah Sampah
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed">
              Dihitung berdasarkan total berat pemilahan sampah dan poin keaktifan siswa.
            </p>
          </div>

          <div className="w-10 h-10 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-xl shrink-0">
            🥇
          </div>
        </div>
      </div>

      {/* Switcher: Kelas vs Siswa - Segmented Control */}
      <div className="bg-stone-100 p-1 rounded-lg border border-stone-200 flex items-center gap-1">
        <button
          id="btn-view-class-rank"
          onClick={() => {
            setViewMode('class');
          }}
          className={`flex-1 py-1.5 rounded-md text-xs transition-colors flex items-center justify-center gap-1.5 ${
            viewMode === 'class'
              ? 'bg-white text-stone-900 font-semibold shadow-xs'
              : 'text-stone-500 hover:text-stone-900 font-normal'
          }`}
        >
          <Users size={13} />
          <span>Peringkat Kelas</span>
        </button>

        <button
          id="btn-view-student-rank"
          onClick={() => {
            setViewMode('student');
          }}
          className={`flex-1 py-1.5 rounded-md text-xs transition-colors flex items-center justify-center gap-1.5 ${
            viewMode === 'student'
              ? 'bg-white text-stone-900 font-semibold shadow-xs'
              : 'text-stone-500 hover:text-stone-900 font-normal'
          }`}
        >
          <Trophy size={13} />
          <span>Siswa Teraktif</span>
        </button>
      </div>

      {/* VIEW 1: PERINGKAT KELAS */}
      {viewMode === 'class' && (
        <div className="space-y-3">
          {/* Grade filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
            <span className="text-[10px] font-medium text-stone-500 px-0.5">Filter:</span>
            {[
              { label: 'Semua Kelas', val: 'all' as const },
              { label: 'Kelas 4', val: 4 },
              { label: 'Kelas 5', val: 5 },
              { label: 'Kelas 6', val: 6 },
            ].map((f) => (
              <button
                key={String(f.val)}
                onClick={() => {
                  setSelectedGrade(f.val);
                }}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  selectedGrade === f.val
                    ? 'bg-stone-900 text-white font-medium'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Top 3 Podium Visual - Flat & Clean */}
          {selectedGrade === 'all' && topThreeClasses.length >= 3 && (
            <div className="bg-white rounded-xl p-3.5 border border-stone-200">
              <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider text-center mb-3">
                Top 3 Kelas Teratas
              </div>

              <div className="flex items-end justify-center gap-2 pt-1">
                {/* 2nd Place */}
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-xl mb-1">🥈</span>
                  <div className="text-xs font-semibold text-stone-800 text-center truncate w-full">
                    {topThreeClasses[1].name.split('-')[0]}
                  </div>
                  <div className="text-[11px] font-mono text-stone-600">
                    {topThreeClasses[1].totalKg} kg
                  </div>
                  <div className="w-full bg-stone-100 border border-stone-200 h-14 rounded-t-lg mt-1.5 flex flex-col items-center justify-center p-1 text-[10px] font-medium text-stone-700 font-mono">
                    <span>{topThreeClasses[1].totalPoints} pts</span>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-2xl mb-1">🥇</span>
                  <div className="text-xs font-bold text-stone-900 text-center truncate w-full">
                    {topThreeClasses[0].name.split('-')[0]}
                  </div>
                  <div className="text-[11px] font-mono font-semibold text-emerald-800">
                    {topThreeClasses[0].totalKg} kg
                  </div>
                  <div className="w-full bg-stone-200 border border-stone-300 h-20 rounded-t-lg mt-1.5 flex flex-col items-center justify-center p-1 text-[11px] font-semibold text-stone-900 font-mono">
                    <span className="text-[9px] text-stone-500 font-normal">Juara 1</span>
                    <span>{topThreeClasses[0].totalPoints} pts</span>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-xl mb-1">🥉</span>
                  <div className="text-xs font-semibold text-stone-800 text-center truncate w-full">
                    {topThreeClasses[2].name.split('-')[0]}
                  </div>
                  <div className="text-[11px] font-mono text-stone-600">
                    {topThreeClasses[2].totalKg} kg
                  </div>
                  <div className="w-full bg-stone-100 border border-stone-200 h-10 rounded-t-lg mt-1.5 flex flex-col items-center justify-center p-1 text-[10px] font-medium text-stone-700 font-mono">
                    <span>{topThreeClasses[2].totalPoints} pts</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full Class Ranking List */}
          <div className="space-y-1.5">
            {filteredClasses.map((cls, idx) => {
              const isMyClass = currentStudent.className.includes(cls.name.split(' - ')[0]);
              const rank = idx + 1;

              return (
                <div
                  key={cls.id}
                  className={`p-3 rounded-xl border transition-colors ${
                    isMyClass
                      ? 'bg-stone-900 text-white border-stone-950'
                      : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded border flex items-center justify-center font-semibold text-xs font-mono ${
                          isMyClass
                            ? 'bg-stone-800 border-stone-700 text-white'
                            : 'bg-stone-100 border-stone-200 text-stone-800'
                        }`}
                      >
                        {rank}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-semibold ${isMyClass ? 'text-white' : 'text-stone-900'}`}>
                            {cls.name}
                          </span>
                          {isMyClass && (
                            <span className="text-[9px] bg-emerald-500 text-stone-950 font-bold px-1.5 py-0.2 rounded">
                              Kelas Anda
                            </span>
                          )}
                          {cls.weeklyChampionBadge && (
                            <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200 font-medium px-1.5 py-0.2 rounded">
                              Juara Pekan Ini
                            </span>
                          )}
                        </div>
                        <div className={`text-[10px] ${isMyClass ? 'text-stone-300' : 'text-stone-500'}`}>
                          Wali: {cls.waliKelas} • {cls.activeStudents}/{cls.totalStudents} siswa aktif
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className={`text-xs font-semibold ${isMyClass ? 'text-white' : 'text-stone-900'}`}>
                        {cls.totalKg.toFixed(1)} kg
                      </div>
                      <div className={`text-[10px] ${isMyClass ? 'text-stone-300' : 'text-stone-500'}`}>
                        {cls.totalPoints.toLocaleString('id-ID')} pts
                      </div>
                    </div>
                  </div>

                  {/* Waste breakdown bar per class */}
                  <div
                    className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] font-mono ${
                      isMyClass
                        ? 'border-stone-800 text-stone-300'
                        : 'border-stone-200/60 text-stone-500'
                    }`}
                  >
                    <span>Organik: {cls.organicKg.toFixed(1)}kg</span>
                    <span>Plastik: {cls.plasticKg.toFixed(1)}kg</span>
                    <span>Kertas: {cls.paperKg.toFixed(1)}kg</span>
                    <span>B3: {cls.b3Kg.toFixed(1)}kg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: PERINGKAT SISWA TERAKTIF SE-SEKOLAH */}
      {viewMode === 'student' && (
        <div className="space-y-2">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-700 text-xs">
            <span className="font-semibold text-stone-900">Siswa Paling Aktif: </span>
            Semakin rajin kamu memilah sampah di IoT Tong Pintar, poin dan peringkatmu akan terus meningkat.
          </div>

          <div className="space-y-1.5">
            {sortedStudents.map((stu, idx) => {
              const isMe = stu.id === currentStudent.id;
              const rank = idx + 1;

              return (
                <div
                  key={stu.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                    isMe
                      ? 'bg-stone-900 text-white border-stone-950'
                      : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center font-medium text-[11px] font-mono ${
                        isMe
                          ? 'bg-stone-800 border-stone-700 text-white'
                          : 'bg-stone-100 border-stone-200 text-stone-700'
                      }`}
                    >
                      {rank}
                    </div>

                    <span className="text-lg">{stu.avatar}</span>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-semibold ${isMe ? 'text-white' : 'text-stone-900'}`}>
                          {stu.name}
                        </span>
                        {isMe && (
                          <span className="text-[8px] bg-emerald-500 text-stone-950 font-bold px-1 py-0.2 rounded">
                            Anda
                          </span>
                        )}
                      </div>
                      <div className={`text-[10px] ${isMe ? 'text-stone-300' : 'text-stone-500'}`}>
                        {stu.className} • {stu.sortCount}x pilah
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className={`text-xs font-semibold ${isMe ? 'text-white' : 'text-stone-900'}`}>
                      {stu.points} pts
                    </div>
                    <div className={`text-[10px] ${isMe ? 'text-stone-300' : 'text-stone-500'}`}>
                      {stu.totalKg.toFixed(1)} kg
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
