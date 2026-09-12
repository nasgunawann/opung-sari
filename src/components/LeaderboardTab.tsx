import React, { useState } from 'react';
import {
  Trophy,
  Users,
  Crown,
  Medal,
  Sparkles,
  Flame,
  Award,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { SchoolClass, Student } from '../types';

interface LeaderboardTabProps {
  classes: SchoolClass[];
  students: Student[];
  currentStudent: Student;
  currentClass?: SchoolClass;
}

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({
  classes,
  students,
  currentStudent,
  currentClass,
}) => {
  const [viewMode, setViewMode] = useState<'student' | 'class'>('student');

  // Sorting: Siswa berdasarkan XP/Level (points), Kelas berdasarkan Total Poin Kelas
  const sortedStudents = [...students].sort((a, b) => b.points - a.points || b.level - a.level);
  const sortedClasses = [...classes].sort((a, b) => b.totalPoints - a.totalPoints || b.totalKg - a.totalKg);

  const topThreeStudents = sortedStudents.slice(0, 3);
  const topThreeClasses = sortedClasses.slice(0, 3);

  // Student's own rank
  const myStudentRank = sortedStudents.findIndex((s) => s.id === currentStudent.id) + 1;

  // Class rank
  const activeClass = currentClass || classes.find(
    (c) => currentStudent.className.includes(c.name.split(' - ')[0])
  );
  const myClassRank = activeClass
    ? sortedClasses.findIndex((c) => c.id === activeClass.id) + 1
    : 1;

  return (
    <div className="w-full min-w-0 max-w-4xl mx-auto space-y-4 pb-24 pt-1 md:px-2">
      {/* SECTION 0: Hero Papan Peringkat Adiwiyata */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-md p-4 sm:p-5">
        {/* Subtle background ambient glows */}
        <div className="pointer-events-none absolute -right-6 -top-6 w-36 h-36 rounded-full bg-white/10 blur-xl" />
        <div className="pointer-events-none absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-emerald-400/15 blur-lg" />

        {/* Top Bar: Emblem & Title */}
        <div className="relative flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl border border-white/25 shadow-inner">
                🏆
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="text-base sm:text-lg font-extrabold text-white truncate tracking-tight">
                  Papan Peringkat Adiwiyata
                </h2>
              </div>
              <p className="text-xs text-emerald-100/85 font-medium truncate">
                Kompetisi Positif Pemilahan Sampah &amp; Pelestarian Lingkungan
              </p>
            </div>
          </div>

          {/* Current Rank Spotlight Pill */}
          <div className="bg-black/20 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15 flex items-center gap-2 shrink-0">
            <div className="text-right">
              <div className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">
                {viewMode === 'student' ? 'Peringkat Kamu' : 'Peringkat Kelas'}
              </div>
              <div className="text-sm font-black text-white">
                #{viewMode === 'student' ? myStudentRank : myClassRank} dari{' '}
                {viewMode === 'student' ? sortedStudents.length : sortedClasses.length}
              </div>
            </div>
            <span className="text-xl">🌟</span>
          </div>
        </div>

        {/* Motivational Subtext */}
        <div className="relative mt-4 pt-3 border-t border-white/15 flex items-center justify-between gap-2 text-xs text-emerald-100/90 font-medium">
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-300 shrink-0" />
            <span>
              {viewMode === 'student'
                ? `Kumpulkan XP dari setor sampah & kuis untuk merebut posisi teratas!`
                : `Ajak teman sekelasmu aktif memilah untuk mendongkrak total poin kelas!`}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Segmented Pill Switcher */}
      <div className="bg-stone-100 p-1.5 rounded-2xl flex items-center gap-1.5 border border-stone-200/80 shadow-xs">
        <button
          onClick={() => setViewMode('student')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            viewMode === 'student'
              ? 'bg-white text-emerald-950 shadow-sm border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Trophy size={16} className={viewMode === 'student' ? 'text-amber-500' : 'text-stone-400'} />
          <span>Peringkat Siswa</span>
        </button>
        <button
          onClick={() => setViewMode('class')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            viewMode === 'class'
              ? 'bg-white text-emerald-950 shadow-sm border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Users size={16} className={viewMode === 'class' ? 'text-emerald-600' : 'text-stone-400'} />
          <span>Peringkat Kelas</span>
        </button>
      </div>

      {/* SECTION 2A: VIEW SISWA */}
      {viewMode === 'student' && (
        <div className="space-y-4">
          {/* Podium Siswa (Juara 1, 2, 3) */}
          {topThreeStudents.length >= 3 && (
            <div className="bg-gradient-to-b from-amber-50/70 via-amber-50/40 to-white rounded-3xl p-4 sm:p-5 border border-amber-200/70 shadow-xs">
              <div className="text-center mb-4">
                <h3 className="text-base sm:text-lg font-extrabold text-stone-900 mt-1">
                  Top 3 Siswa Teraktif
                </h3>
              </div>

              {/* 3 Pedestals Layout */}
              <div className="flex items-end justify-center gap-2 sm:gap-4 pt-2">
                {/* Juara 2: Perak (Kiri) */}
                <div className="flex-1 flex flex-col items-center min-w-0 max-w-[120px] sm:max-w-[140px]">
                  <div className="relative mb-1">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-slate-300 flex items-center justify-center text-2xl sm:text-3xl shadow-xs">
                      {topThreeStudents[1].avatar}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center border-2 border-white shadow-xs">
                      2
                    </span>
                  </div>

                  <span className="text-lg sm:text-xl drop-shadow-xs">🥈</span>
                  <div className="text-xs sm:text-sm font-extrabold text-stone-900 truncate w-full text-center mt-0.5">
                    {topThreeStudents[1].name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] font-bold text-stone-500 truncate w-full text-center">
                    {topThreeStudents[1].className}
                  </div>
                  <span className="text-[9px] font-black text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-full mt-0.5">
                    Lv.{topThreeStudents[1].level}
                  </span>

                  {/* Pedestal 2 */}
                  <div className="w-full bg-gradient-to-b from-slate-200 to-slate-300 border-2 border-slate-300/90 h-24 sm:h-28 rounded-t-2xl sm:rounded-t-3xl mt-2 flex flex-col items-center justify-center shadow-xs p-1">
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      {topThreeStudents[1].points}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600">XP</span>
                  </div>
                </div>

                {/* Juara 1: Emas (Tengah) */}
                <div className="flex-1 flex flex-col items-center min-w-0 max-w-[130px] sm:max-w-[160px] -mt-4">
                  <div className="relative mb-1">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-50 border-2 border-amber-400 flex items-center justify-center text-3xl sm:text-4xl shadow-md ring-2 ring-amber-300/60">
                      {topThreeStudents[0].avatar}
                    </div>
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl drop-shadow-sm animate-bounce">
                      👑
                    </span>
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center border-2 border-white shadow-xs">
                      1
                    </span>
                  </div>

                  <span className="text-xl sm:text-2xl drop-shadow-xs">🥇</span>
                  <div className="text-xs sm:text-sm font-black text-stone-900 truncate w-full text-center mt-0.5">
                    {topThreeStudents[0].name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] font-bold text-stone-500 truncate w-full text-center">
                    {topThreeStudents[0].className}
                  </div>
                  <span className="text-[9px] font-black text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded-full mt-0.5 shadow-xs">
                    Lv.{topThreeStudents[0].level}
                  </span>

                  {/* Pedestal 1 */}
                  <div className="w-full bg-gradient-to-b from-amber-300 via-amber-300 to-amber-400 border-2 border-amber-400 h-32 sm:h-36 rounded-t-2xl sm:rounded-t-3xl mt-2 flex flex-col items-center justify-center shadow-md p-1">
                    <span className="text-sm sm:text-base font-black text-amber-950">
                      {topThreeStudents[0].points}
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-900">XP</span>
                  </div>
                </div>

                {/* Juara 3: Perunggu (Kanan) */}
                <div className="flex-1 flex flex-col items-center min-w-0 max-w-[120px] sm:max-w-[140px]">
                  <div className="relative mb-1">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-amber-700/30 flex items-center justify-center text-2xl sm:text-3xl shadow-xs">
                      {topThreeStudents[2].avatar}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-xs">
                      3
                    </span>
                  </div>

                  <span className="text-lg sm:text-xl drop-shadow-xs">🥉</span>
                  <div className="text-xs sm:text-sm font-extrabold text-stone-900 truncate w-full text-center mt-0.5">
                    {topThreeStudents[2].name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] font-bold text-stone-500 truncate w-full text-center">
                    {topThreeStudents[2].className}
                  </div>
                  <span className="text-[9px] font-black text-amber-900 bg-orange-100 px-1.5 py-0.5 rounded-full mt-0.5">
                    Lv.{topThreeStudents[2].level}
                  </span>

                  {/* Pedestal 3 */}
                  <div className="w-full bg-gradient-to-b from-orange-200 to-orange-300 border-2 border-orange-300 h-20 sm:h-22 rounded-t-2xl sm:rounded-t-3xl mt-2 flex flex-col items-center justify-center shadow-xs p-1">
                    <span className="text-xs sm:text-sm font-black text-orange-950">
                      {topThreeStudents[2].points}
                    </span>
                    <span className="text-[10px] font-bold text-orange-800">XP</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Daftar Peringkat Seluruh Siswa */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-stone-900">
                Semua Siswa Terdaftar
              </h3>
            </div>

            <div className="space-y-2">
              {sortedStudents.map((stu, idx) => {
                const isMe = stu.id === currentStudent.id;
                const rank = idx + 1;

                let rankBadge = 'bg-stone-100 text-stone-600 border-stone-200';
                if (rank === 1) rankBadge = 'bg-amber-400 text-amber-950 border-amber-500 font-black';
                else if (rank === 2) rankBadge = 'bg-slate-300 text-slate-800 border-slate-400 font-black';
                else if (rank === 3) rankBadge = 'bg-amber-700 text-white border-amber-800 font-black';

                return (
                  <div
                    key={stu.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isMe
                        ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-2 ring-emerald-400/40'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-xs shrink-0 ${rankBadge}`}
                      >
                        {rank}
                      </div>

                      <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-2xl shadow-xs">
                          {stu.avatar}
                        </div>
                        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-amber-400 text-amber-950 rounded-full text-[9px] font-black border border-white">
                          Lv.{stu.level}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-xs sm:text-sm font-extrabold truncate ${
                            isMe ? 'text-emerald-950' : 'text-stone-900'
                          }`}>
                            {stu.name}
                          </span>
                          {isMe && (
                            <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full shadow-xs">
                              Kamu
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-stone-500 truncate">
                          {stu.className}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`text-sm sm:text-base font-black ${
                        isMe ? 'text-emerald-800' : 'text-stone-900'
                      }`}>
                        {stu.points} <span className="text-xs font-bold text-stone-500">XP</span>
                      </div>
                      <div className="text-[10px] font-semibold text-stone-400">
                        Total {stu.totalKg.toFixed(1)} kg
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2B: VIEW KELAS */}
      {viewMode === 'class' && (
        <div className="space-y-4">
          {/* Podium Kelas (Juara 1, 2, 3) */}
          {topThreeClasses.length >= 3 && (
            <div className="bg-gradient-to-b from-emerald-50/70 via-emerald-50/40 to-white rounded-3xl p-4 sm:p-5 border border-emerald-200/70 shadow-xs">
              <div className="text-center mb-4">
                <h3 className="text-base sm:text-lg font-extrabold text-stone-900 mt-1">
                  Top 3 Kelas Penggerak Lingkungan
                </h3>
              </div>

              {/* 3 Pedestals Layout Kelas */}
              <div className="flex items-end justify-center gap-2 sm:gap-4 pt-2">
                {/* Juara 2 Kelas: Perak (Kiri) */}
                <div className="flex-1 flex flex-col items-center min-w-0 max-w-[120px] sm:max-w-[140px]">
                  <span className="text-lg sm:text-xl drop-shadow-xs mb-1">🥈</span>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-slate-300 flex items-center justify-center text-xl sm:text-2xl font-black text-slate-800 shadow-xs">
                    🏛️
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-stone-900 truncate w-full text-center mt-1">
                    {topThreeClasses[1].name.split(' - ')[0]}
                  </div>
                  <div className="text-[10px] font-bold text-stone-500 truncate w-full text-center">
                    {topThreeClasses[1].activeStudents} Siswa Aktif
                  </div>

                  {/* Pedestal 2 */}
                  <div className="w-full bg-gradient-to-b from-slate-200 to-slate-300 border-2 border-slate-300/90 h-24 sm:h-28 rounded-t-2xl sm:rounded-t-3xl mt-2 flex flex-col items-center justify-center shadow-xs p-1">
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      {topThreeClasses[1].totalPoints.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600">Poin</span>
                  </div>
                </div>

                {/* Juara 1 Kelas: Emas (Tengah) */}
                <div className="flex-1 flex flex-col items-center min-w-0 max-w-[130px] sm:max-w-[160px] -mt-4">
                  <span className="text-2xl drop-shadow-sm animate-bounce mb-0.5">👑</span>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-50 border-2 border-amber-400 flex items-center justify-center text-2xl sm:text-3xl shadow-md ring-2 ring-amber-300/60 font-black">
                    🏆
                  </div>
                  <div className="text-xs sm:text-sm font-black text-stone-900 truncate w-full text-center mt-1">
                    {topThreeClasses[0].name.split(' - ')[0]}
                  </div>
                  <div className="text-[10px] font-bold text-stone-500 truncate w-full text-center">
                    {topThreeClasses[0].activeStudents} Siswa Aktif
                  </div>

                  {/* Pedestal 1 */}
                  <div className="w-full bg-gradient-to-b from-amber-300 via-amber-300 to-amber-400 border-2 border-amber-400 h-32 sm:h-36 rounded-t-2xl sm:rounded-t-3xl mt-2 flex flex-col items-center justify-center shadow-md p-1">
                    <span className="text-sm sm:text-base font-black text-amber-950">
                      {topThreeClasses[0].totalPoints.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-900">Poin</span>
                  </div>
                </div>

                {/* Juara 3 Kelas: Perunggu (Kanan) */}
                <div className="flex-1 flex flex-col items-center min-w-0 max-w-[120px] sm:max-w-[140px]">
                  <span className="text-lg sm:text-xl drop-shadow-xs mb-1">🥉</span>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-amber-700/30 flex items-center justify-center text-xl sm:text-2xl font-black text-stone-700 shadow-xs">
                    🌱
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-stone-900 truncate w-full text-center mt-1">
                    {topThreeClasses[2].name.split(' - ')[0]}
                  </div>
                  <div className="text-[10px] font-bold text-stone-500 truncate w-full text-center">
                    {topThreeClasses[2].activeStudents} Siswa Aktif
                  </div>

                  {/* Pedestal 3 */}
                  <div className="w-full bg-gradient-to-b from-orange-200 to-orange-300 border-2 border-orange-300 h-20 sm:h-22 rounded-t-2xl sm:rounded-t-3xl mt-2 flex flex-col items-center justify-center shadow-xs p-1">
                    <span className="text-xs sm:text-sm font-black text-orange-950">
                      {topThreeClasses[2].totalPoints.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] font-bold text-orange-800">Poin</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Daftar Peringkat Seluruh Kelas */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-stone-900">
                Peringkat Seluruh Kelas
              </h3>
            </div>

            <div className="space-y-2">
              {sortedClasses.map((cls, idx) => {
                const isMyClass = currentStudent.className.includes(cls.name.split(' - ')[0]);
                const rank = idx + 1;

                let rankBadge = 'bg-stone-100 text-stone-600 border-stone-200';
                if (rank === 1) rankBadge = 'bg-amber-400 text-amber-950 border-amber-500 font-black';
                else if (rank === 2) rankBadge = 'bg-slate-300 text-slate-800 border-slate-400 font-black';
                else if (rank === 3) rankBadge = 'bg-amber-700 text-white border-amber-800 font-black';

                return (
                  <div
                    key={cls.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isMyClass
                        ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-2 ring-emerald-400/40'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-xs shrink-0 ${rankBadge}`}
                      >
                        {rank}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs sm:text-sm font-extrabold truncate ${
                            isMyClass ? 'text-emerald-950' : 'text-stone-900'
                          }`}>
                            {cls.name}
                          </span>
                          {isMyClass && (
                            <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full shadow-xs">
                              Kelasmu
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-stone-500 truncate">
                          Wali Kelas: {cls.waliKelas} • {cls.activeStudents} Siswa
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`text-sm sm:text-base font-black ${
                        isMyClass ? 'text-emerald-800' : 'text-stone-900'
                      }`}>
                        {cls.totalPoints.toLocaleString('id-ID')}{' '}
                        <span className="text-xs font-bold text-stone-500">Poin</span>
                      </div>
                      <div className="text-[10px] font-semibold text-stone-400">
                        Total {cls.totalKg.toFixed(1)} kg sampah
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
