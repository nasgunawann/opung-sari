import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Users,
  Crown,
  Medal,
  Star,
  Landmark,
  Leaf,
  Flame,
  Award,
  ChevronRight,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { SchoolClass, Student } from '../types';
import { StudentAvatar } from '../lib/appIcons';

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
  const sortedStudents = useMemo(
    () => [...students].sort((a, b) => b.points - a.points || b.level - a.level),
    [students],
  );
  const sortedClasses = useMemo(
    () => [...classes].sort((a, b) => b.totalPoints - a.totalPoints || b.totalKg - a.totalKg),
    [classes],
  );

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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-active text-primary-foreground shadow-md p-4 sm:p-5">
        {/* Top Bar: Emblem & Title */}
        <div className="relative flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary-foreground/15 flex items-center justify-center border border-primary-foreground/25 shadow-inner">
                <Trophy size={28} className="text-amber-100" aria-hidden="true" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="text-base sm:text-lg font-extrabold text-primary-foreground truncate tracking-tight">
                  Papan Peringkat Adiwiyata
                </h2>
              </div>
              <p className="text-xs text-primary-foreground/85 font-medium truncate">
                Kompetisi Positif Pemilahan Sampah &amp; Pelestarian Lingkungan
              </p>
            </div>
          </div>

          {/* Current Rank Spotlight Pill */}
          <div className="bg-overlay/20 px-3.5 py-1.5 rounded-2xl border border-primary-foreground/15 flex items-center gap-2 shrink-0">
            <div className="text-right">
              <div className="text-[10px] font-bold text-primary-foreground/80">
                {viewMode === 'student' ? 'Peringkat Kamu' : 'Peringkat Kelas'}
              </div>
              <div className="text-sm font-black text-primary-foreground">
                #{viewMode === 'student' ? myStudentRank : myClassRank} dari{' '}
                {viewMode === 'student' ? sortedStudents.length : sortedClasses.length}
              </div>
            </div>
            <Star size={20} className="text-amber-300 shrink-0" aria-hidden="true" />
          </div>
        </div>

        {/* Motivational Subtext */}
        <div className="relative mt-4 pt-3 border-t border-primary-foreground/15 flex items-center justify-between gap-2 text-xs text-primary-foreground/90 font-medium">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={14} className="text-primary-foreground/80 shrink-0" aria-hidden="true" />
            <span>
              {viewMode === 'student'
                ? `Kumpulkan XP dari setor sampah & kuis untuk merebut posisi teratas!`
                : `Ajak teman sekelasmu aktif memilah untuk mendongkrak total poin kelas!`}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Segmented Pill Switcher */}
      <div className="bg-muted p-1.5 rounded-2xl flex items-center gap-1.5 border border-border shadow-xs">
        <button
          type="button"
          onClick={() => setViewMode('student')}
          className={`flex-1 min-h-10 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            viewMode === 'student'
              ? 'bg-card text-primary shadow-sm border border-border'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Trophy size={16} className={viewMode === 'student' ? 'text-amber-500' : 'text-muted-foreground'} aria-hidden="true" />
          <span>Peringkat Siswa</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode('class')}
          className={`flex-1 min-h-10 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            viewMode === 'class'
              ? 'bg-card text-primary shadow-sm border border-border'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users size={16} className={viewMode === 'class' ? 'text-primary' : 'text-muted-foreground'} aria-hidden="true" />
          <span>Peringkat Kelas</span>
        </button>
      </div>

      {/* SECTION 2A: VIEW SISWA */}
      {viewMode === 'student' && (
        <div className="space-y-4">
          {/* Podium Siswa (Juara 1, 2, 3) */}
          {topThreeStudents.length >= 3 && (
            <div className="bg-gradient-to-b from-amber-50/70 via-amber-50/40 to-background rounded-3xl p-4 sm:p-5 border border-amber-200/70 shadow-xs">
              <div className="text-center mb-4">
                <h3 className="text-base sm:text-lg font-extrabold text-foreground mt-1">
                  Top 3 Siswa Teraktif
                </h3>
              </div>

              {/* 3 Pedestals Layout */}
              <div className="flex items-end justify-center gap-2 sm:gap-4 pt-2">
                {/* Juara 2: Perak (Kiri) */}
                <div className="flex-1 flex flex-col items-center min-w-0 max-w-[120px] sm:max-w-[140px]">
                  <div className="relative mb-1">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-card border-2 border-border flex items-center justify-center text-2xl sm:text-3xl shadow-xs">
                      <StudentAvatar name={topThreeStudents[1].name} size={44} />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-muted text-foreground font-black text-xs flex items-center justify-center border-2 border-card shadow-xs">
                      2
                    </span>
                  </div>

                  <Medal size={20} className="text-muted-foreground drop-shadow-xs" aria-hidden="true" />
                  <div className="text-xs sm:text-sm font-extrabold text-foreground truncate w-full text-center mt-0.5">
                    {topThreeStudents[1].name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground truncate w-full text-center">
                    {topThreeStudents[1].className}
                  </div>
                  <span className="text-[9px] font-black text-foreground bg-muted px-1.5 py-0.5 rounded-full mt-0.5">
                    Lv.{topThreeStudents[1].level}
                  </span>

                  {/* Pedestal 2 */}
                  <div className="w-full bg-gradient-to-b from-muted to-border border-2 border-border h-24 sm:h-28 rounded-t-2xl sm:rounded-t-3xl mt-2 flex flex-col items-center justify-center shadow-xs p-1">
                    <span className="text-xs sm:text-sm font-black text-foreground">
                      {topThreeStudents[1].points}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground">XP</span>
                  </div>
                </div>

                {/* Juara 1: Emas (Tengah) */}
                <div className="flex-1 flex flex-col items-center min-w-0 max-w-[130px] sm:max-w-[160px] -mt-4">
                  <div className="relative mb-1">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-50 border-2 border-amber-400 flex items-center justify-center text-3xl sm:text-4xl shadow-md ring-2 ring-amber-300/60">
                      <StudentAvatar name={topThreeStudents[0].name} size={52} />
                    </div>
                    <Crown
                      size={22}
                      className="absolute -top-3 left-1/2 -translate-x-1/2 text-amber-400 drop-shadow-sm"
                      aria-hidden="true"
                    />
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center border-2 border-card shadow-xs">
                      1
                    </span>
                  </div>

                  <Medal size={22} className="text-amber-400 drop-shadow-xs" aria-hidden="true" />
                  <div className="text-xs sm:text-sm font-black text-foreground truncate w-full text-center mt-0.5">
                    {topThreeStudents[0].name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground truncate w-full text-center">
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
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-card border-2 border-amber-700/30 flex items-center justify-center text-2xl sm:text-3xl shadow-xs">
                      <StudentAvatar name={topThreeStudents[2].name} size={44} />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 text-amber-50 font-black text-xs flex items-center justify-center border-2 border-card shadow-xs">
                      3
                    </span>
                  </div>

                  <Medal size={20} className="text-amber-600 drop-shadow-xs" aria-hidden="true" />
                  <div className="text-xs sm:text-sm font-extrabold text-foreground truncate w-full text-center mt-0.5">
                    {topThreeStudents[2].name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground truncate w-full text-center">
                    {topThreeStudents[2].className}
                  </div>
                  <span className="text-[9px] font-black text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded-full mt-0.5">
                    Lv.{topThreeStudents[2].level}
                  </span>

                  {/* Pedestal 3 */}
                  <div className="w-full bg-gradient-to-b from-amber-200 to-amber-300 border-2 border-amber-300 h-20 sm:h-22 rounded-t-2xl sm:rounded-t-3xl mt-2 flex flex-col items-center justify-center shadow-xs p-1">
                    <span className="text-xs sm:text-sm font-black text-amber-950">
                      {topThreeStudents[2].points}
                    </span>
                    <span className="text-[10px] font-bold text-amber-800">XP</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Daftar Peringkat Seluruh Siswa */}
          <div className="bg-card rounded-3xl p-4 sm:p-5 border border-border shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-foreground">
                Semua Siswa Terdaftar
              </h3>
            </div>

            <div className="space-y-2">
              {sortedStudents.map((stu, idx) => {
                const isMe = stu.id === currentStudent.id;
                const rank = idx + 1;

                let rankBadge = 'bg-muted text-muted-foreground border-border';
                if (rank === 1) rankBadge = 'bg-amber-400 text-amber-950 border-amber-500 font-black';
                else if (rank === 2) rankBadge = 'bg-muted text-foreground border-border font-black';
                else if (rank === 3) rankBadge = 'bg-amber-700 text-amber-50 border-amber-800 font-black';

                return (
                  <div
                    key={stu.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isMe
                        ? 'bg-secondary/70 border-primary shadow-xs ring-2 ring-primary/40'
                        : 'bg-card border-border hover:border-muted-foreground/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center font-black text-xs shrink-0 ${rankBadge}`}
                      >
                        {rank}
                      </div>

                      <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-2xl bg-muted border border-border flex items-center justify-center text-2xl shadow-xs">
                          <StudentAvatar name={stu.name} size={32} />
                        </div>
                        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-primary text-primary-foreground rounded-full text-[9px] font-black border border-card">
                          Lv.{stu.level}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-xs sm:text-sm font-extrabold truncate ${
                            isMe ? 'text-primary' : 'text-foreground'
                          }`}>
                            {stu.name}
                          </span>
                          {isMe && (
                            <span className="text-[10px] bg-primary text-primary-foreground font-black px-2 py-0.5 rounded-full shadow-xs">
                              Kamu
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-muted-foreground truncate">
                          {stu.className}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`text-sm sm:text-base font-black ${
                        isMe ? 'text-primary' : 'text-foreground'
                      }`}>
                        {stu.points} <span className="text-xs font-bold text-muted-foreground">XP</span>
                      </div>
                      <div className="text-[10px] font-semibold text-muted-foreground">
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
            <div className="bg-gradient-to-b from-secondary/70 via-secondary/40 to-background rounded-3xl p-4 sm:p-5 border border-border shadow-xs">
              <div className="text-center mb-4">
                <h3 className="text-base sm:text-lg font-extrabold text-foreground mt-1">
                  Top 3 Kelas Teraktif
                </h3>
              </div>

              {/* 3 Pedestals Layout Kelas */}
              <div className="flex items-end justify-center gap-2 sm:gap-4 pt-2">
                {/* Juara 2 Kelas: Perak (Kiri) */}
                <div className="flex-1 flex flex-col items-center min-w-0 max-w-[120px] sm:max-w-[140px]">
                  <Medal size={20} className="text-muted-foreground drop-shadow-xs mb-1" aria-hidden="true" />
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-card border-2 border-border flex items-center justify-center shadow-xs">
                    <Landmark size={22} className="text-foreground" aria-hidden="true" />
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-foreground truncate w-full text-center mt-1">
                    {topThreeClasses[1].name.split(' - ')[0]}
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground truncate w-full text-center">
                    {topThreeClasses[1].activeStudents} Siswa Aktif
                  </div>

                  {/* Pedestal 2 */}
                  <div className="w-full bg-gradient-to-b from-muted to-border border-2 border-border h-24 sm:h-28 rounded-t-2xl sm:rounded-t-3xl mt-2 flex flex-col items-center justify-center shadow-xs p-1">
                    <span className="text-xs sm:text-sm font-black text-foreground">
                      {topThreeClasses[1].totalPoints.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground">Poin</span>
                  </div>
                </div>

                {/* Juara 1 Kelas: Emas (Tengah) */}
                <div className="flex-1 flex flex-col items-center min-w-0 max-w-[130px] sm:max-w-[160px] -mt-4">
                  <Crown size={22} className="text-amber-400 drop-shadow-sm mb-0.5" aria-hidden="true" />
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-50 border-2 border-amber-400 flex items-center justify-center shadow-md ring-2 ring-amber-300/60">
                    <Trophy size={24} className="text-amber-500" aria-hidden="true" />
                  </div>
                  <div className="text-xs sm:text-sm font-black text-foreground truncate w-full text-center mt-1">
                    {topThreeClasses[0].name.split(' - ')[0]}
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground truncate w-full text-center">
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
                  <Medal size={20} className="text-amber-600 drop-shadow-xs mb-1" aria-hidden="true" />
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-card border-2 border-amber-700/30 flex items-center justify-center shadow-xs">
                    <Leaf size={22} className="text-primary" aria-hidden="true" />
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-foreground truncate w-full text-center mt-1">
                    {topThreeClasses[2].name.split(' - ')[0]}
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground truncate w-full text-center">
                    {topThreeClasses[2].activeStudents} Siswa Aktif
                  </div>

                  {/* Pedestal 3 */}
                  <div className="w-full bg-gradient-to-b from-amber-200 to-amber-300 border-2 border-amber-300 h-20 sm:h-22 rounded-t-2xl sm:rounded-t-3xl mt-2 flex flex-col items-center justify-center shadow-xs p-1">
                    <span className="text-xs sm:text-sm font-black text-amber-950">
                      {topThreeClasses[2].totalPoints.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] font-bold text-amber-800">Poin</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Daftar Peringkat Seluruh Kelas */}
          <div className="bg-card rounded-3xl p-4 sm:p-5 border border-border shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-foreground">
                Peringkat Seluruh Kelas
              </h3>
            </div>

            <div className="space-y-2">
              {sortedClasses.map((cls, idx) => {
                const isMyClass = currentStudent.className.includes(cls.name.split(' - ')[0]);
                const rank = idx + 1;

                let rankBadge = 'bg-muted text-muted-foreground border-border';
                if (rank === 1) rankBadge = 'bg-amber-400 text-amber-950 border-amber-500 font-black';
                else if (rank === 2) rankBadge = 'bg-muted text-foreground border-border font-black';
                else if (rank === 3) rankBadge = 'bg-amber-700 text-amber-50 border-amber-800 font-black';

                return (
                  <div
                    key={cls.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isMyClass
                        ? 'bg-secondary/70 border-primary shadow-xs ring-2 ring-primary/40'
                        : 'bg-card border-border hover:border-muted-foreground/40'
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
                            isMyClass ? 'text-primary' : 'text-foreground'
                          }`}>
                            {cls.name}
                          </span>
                          {isMyClass && (
                            <span className="text-[10px] bg-primary text-primary-foreground font-black px-2 py-0.5 rounded-full shadow-xs">
                              Kelasmu
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-medium text-muted-foreground truncate">
                          Wali Kelas: {cls.waliKelas} • {cls.activeStudents} Siswa
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`text-sm sm:text-base font-black ${
                        isMyClass ? 'text-primary' : 'text-foreground'
                      }`}>
                        {cls.totalPoints.toLocaleString('id-ID')}{' '}
                        <span className="text-xs font-bold text-muted-foreground">Poin</span>
                      </div>
                      <div className="text-[10px] font-semibold text-muted-foreground">
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
