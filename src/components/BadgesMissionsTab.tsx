import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  TreePine,
  Droplets,
  Wind,
  CheckCircle2,
  Lock,
  Medal,
  FileCheck,
  Target,
  Flame,
  ArrowRight,
  Gift,
  Share2,
  Download,
  X,
  Check,
} from 'lucide-react';
import { BadgeAchievement, Student } from '../types';
import { BADGES_LIST } from '../data/initialData';
import confetti from 'canvas-confetti';

interface BadgesMissionsTabProps {
  currentStudent: Student;
  onAddPoints?: (pts: number) => void;
}

interface MissionItem {
  id: string;
  title: string;
  desc: string;
  rewardPoints: number;
  progressText: string;
  progressPercent: number;
  done: boolean;
  claimed: boolean;
  category: string;
}

export const BadgesMissionsTab: React.FC<BadgesMissionsTabProps> = ({
  currentStudent,
  onAddPoints,
}) => {
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<BadgeAchievement | null>(null);
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  // Missions state with claimable rewards
  const [missions, setMissions] = useState<MissionItem[]>([
    {
      id: 'm-1',
      title: 'Pilah Botol Plastik Bersih',
      desc: 'Setor minimal 1.0 kg botol/gelas plastik ke Tong Kuning Smart Bin',
      rewardPoints: 50,
      progressText: '1.2 / 1.0 kg',
      progressPercent: 100,
      done: true,
      claimed: false,
      category: 'Smart Bin',
    },
    {
      id: 'm-2',
      title: 'Disiplin Pemilahan 3 Hari',
      desc: 'Aktif menyetor sampah terpilah selama 3 hari dalam sepekan',
      rewardPoints: 75,
      progressText: '3 / 3 Hari',
      progressPercent: 100,
      done: true,
      claimed: false,
      category: 'Kebiasaan',
    },
    {
      id: 'm-3',
      title: 'Jelajah Edukasi 3R',
      desc: 'Tonton video panduan daur ulang atau baca artikel di Beranda',
      rewardPoints: 40,
      progressText: '1 / 1 Modul',
      progressPercent: 100,
      done: true,
      claimed: true,
      category: 'Edukasi',
    },
    {
      id: 'm-4',
      title: 'Juara Kuis Lingkungan',
      desc: 'Selesaikan kuis peduli lingkungan di Beranda dengan jawaban tepat',
      rewardPoints: 60,
      progressText: '0 / 1 Kuis',
      progressPercent: 0,
      done: false,
      claimed: false,
      category: 'Kuis',
    },
  ]);

  // Environmental impact calculations (clean sans numbers)
  const treesSaved = (currentStudent.totalKg * 0.017).toFixed(2);
  const waterSavedLiters = Math.round(currentStudent.totalKg * 26);
  const co2PreventedKg = (currentStudent.totalKg * 1.5).toFixed(1);

  // Level XP progress
  const nextLevelPoints = currentStudent.level * 100;
  const progressPercent = Math.min(
    100,
    Math.round((currentStudent.points / nextLevelPoints) * 100)
  );

  const handleClaimReward = (missionId: string, pts: number) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === missionId ? { ...m, claimed: true } : m))
    );

    if (onAddPoints) {
      onAddPoints(pts);
    }

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'],
    });
  };

  const filteredBadges = BADGES_LIST.filter((b) => {
    if (badgeFilter === 'unlocked') return b.unlocked;
    if (badgeFilter === 'locked') return !b.unlocked;
    return true;
  });

  const unlockedCount = BADGES_LIST.filter((b) => b.unlocked).length;
  const totalBadges = BADGES_LIST.length;
  const completedMissionsCount = missions.filter((m) => m.done).length;

  return (
    <div className="w-full min-w-0 max-w-4xl mx-auto space-y-4 pb-24 pt-1 md:px-2">
      {/* SECTION 0: Hero Level & Student Identity Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-md p-4 sm:p-5">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -right-6 -top-6 w-36 h-36 rounded-full bg-white/10 blur-xl" />
        <div className="pointer-events-none absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-emerald-400/15 blur-lg" />

        {/* Top Bar: Profile, Level, and Piagam Action */}
        <div className="relative flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl border border-white/25 shadow-inner">
                {currentStudent.avatar || '🌱'}
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-amber-400 text-amber-950 rounded-full text-[10px] font-black shadow-xs border border-white/80">
                Lv.{currentStudent.level}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="text-sm sm:text-base font-extrabold text-white truncate tracking-tight">
                  {currentStudent.name}
                </h2>
              </div>
              <p className="text-xs text-emerald-100/85 font-medium truncate">
                {currentStudent.levelTitle} • {currentStudent.className}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCertificate(true)}
            className="flex items-center gap-1.5 bg-white hover:bg-emerald-50 active:scale-95 text-emerald-950 font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
          >
            <FileCheck size={14} className="text-emerald-700" />
            <span>Piagam Duta Adiwiyata</span>
          </button>
        </div>

        {/* Level XP Progress Bar */}
        <div className="relative mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-100">
            <span>Kemajuan Menuju Level {currentStudent.level + 1}</span>
            <span className="text-white font-extrabold">
              {currentStudent.points} / {nextLevelPoints} XP ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden p-0.5 border border-white/20">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-emerald-100/75">
            Kumpulkan {Math.max(0, nextLevelPoints - currentStudent.points)} XP lagi dari pemilahan sampah &amp; kuis untuk naik pangkat!
          </p>
        </div>
      </div>

      {/* SECTION 1: Estimasi Dampak Ekologis Nyata */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <TreePine size={16} className="text-emerald-700" />
            <h3 className="text-sm font-extrabold text-stone-900">
              Dampak Lingkungan Nyata Kamu
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Total {currentStudent.totalKg.toFixed(1)} kg Terpilah
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-2.5 sm:p-3.5 text-center shadow-xs flex flex-col items-center justify-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center mb-1 sm:mb-2">
              <TreePine size={16} className="sm:w-5 sm:h-5" />
            </div>
            <div className="text-sm sm:text-xl font-black text-emerald-950 truncate w-full">
              {treesSaved}
            </div>
            <div className="text-[10px] sm:text-xs font-extrabold text-emerald-900 mt-0.5 leading-tight">
              Pohon Terjaga
            </div>
            <p className="hidden sm:block text-[11px] text-emerald-700/85 mt-1 leading-tight">
              Dari kertas yang kamu tabung
            </p>
          </div>

          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-2.5 sm:p-3.5 text-center shadow-xs flex flex-col items-center justify-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-blue-100/90 text-blue-700 flex items-center justify-center mb-1 sm:mb-2">
              <Droplets size={16} className="sm:w-5 sm:h-5" />
            </div>
            <div className="text-sm sm:text-xl font-black text-blue-950 truncate w-full">
              {waterSavedLiters} L
            </div>
            <div className="text-[10px] sm:text-xs font-extrabold text-blue-900 mt-0.5 leading-tight">
              Air Terhemat
            </div>
            <p className="hidden sm:block text-[11px] text-blue-700/85 mt-1 leading-tight">
              Daur ulang sirkular ramah
            </p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-2.5 sm:p-3.5 text-center shadow-xs flex flex-col items-center justify-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-100/90 text-amber-700 flex items-center justify-center mb-1 sm:mb-2">
              <Wind size={16} className="sm:w-5 sm:h-5" />
            </div>
            <div className="text-sm sm:text-xl font-black text-amber-950 truncate w-full">
              {co2PreventedKg} kg
            </div>
            <div className="text-[10px] sm:text-xs font-extrabold text-amber-900 mt-0.5 leading-tight">
              CO₂ Dicegah
            </div>
            <p className="hidden sm:block text-[11px] text-amber-700/85 mt-1 leading-tight">
              Reduksi polusi lingkungan
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Misi Tantangan Adiwiyata & LISA */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-emerald-700" />
            <div>
              <h3 className="text-sm font-extrabold text-stone-900">
                Misi LISA Adiwiyata Pekan Ini
              </h3>
              <p className="text-xs text-stone-500">
                Selesaikan misi mingguan untuk mengumpulkan poin dan menaikkan level.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {completedMissionsCount} / {missions.length} Selesai
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                mission.claimed
                  ? 'bg-stone-50/80 border-stone-200 opacity-85'
                  : mission.done
                  ? 'bg-emerald-50/70 border-emerald-300 shadow-xs ring-1 ring-emerald-300/60'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5 shrink-0">
                  {mission.done ? (
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 size={16} strokeWidth={2.5} />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-xl bg-stone-100 border-2 border-stone-300 text-stone-400 flex items-center justify-center">
                      <Target size={14} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className={`text-xs sm:text-sm font-extrabold leading-tight ${
                      mission.claimed ? 'text-stone-700' : 'text-stone-900'
                    }`}>
                      {mission.title}
                    </h4>
                    <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full shrink-0">
                      +{mission.rewardPoints} XP
                    </span>
                    <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full shrink-0">
                      {mission.category}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {mission.desc}
                  </p>

                  {/* Micro progress bar if incomplete */}
                  {!mission.done && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="w-24 bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${mission.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-stone-500">
                        {mission.progressText}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action / Status Pill */}
              <div className="pt-2 border-t border-stone-100/80 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-stone-400">Target Mingguan</span>
                {mission.claimed ? (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-xl flex items-center gap-1">
                    <Check size={12} strokeWidth={3} />
                    <span>Selesai</span>
                  </span>
                ) : mission.done ? (
                  <button
                    onClick={() => handleClaimReward(mission.id, mission.rewardPoints)}
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border-b-2 border-emerald-800 animate-pulse"
                  >
                    <Gift size={13} />
                    <span>Klaim +{mission.rewardPoints} XP</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-xl">
                    {mission.progressText}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Lemari Lencana Prestasi (Trophy Showcase) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Medal size={16} className="text-emerald-700" />
            <div>
              <h3 className="text-sm font-extrabold text-stone-900">
                Lemari Lencana Adiwiyata
              </h3>
              <p className="text-xs text-stone-500">
                Koleksi medali penghargaan atas pencapaian pelestarian lingkunganmu.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
            {unlockedCount} dari {totalBadges} Terbuka
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: `Semua (${totalBadges})` },
            { id: 'unlocked', label: `Terbuka (${unlockedCount})` },
            { id: 'locked', label: `Terkunci (${totalBadges - unlockedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setBadgeFilter(tab.id as typeof badgeFilter)}
              className={`text-xs font-extrabold px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
                badgeFilter === tab.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Badges Grid (2-column on mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {filteredBadges.map((badge) => {
            const isUnlocked = badge.unlocked;

            return (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/70 shadow-xs'
                    : 'bg-stone-50/60 border-stone-200 opacity-75 hover:opacity-90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-2">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center text-xl sm:text-2xl shadow-xs border border-stone-100 shrink-0">
                      {badge.icon}
                    </div>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                        <CheckCircle2 size={10} strokeWidth={3} />
                        <span>Terbuka</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] font-bold bg-stone-200/80 text-stone-600 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                        <Lock size={9} />
                        <span>Terkunci</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 leading-tight truncate">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-2.5 sm:mt-3 pt-2 border-t border-stone-200/60">
                  {isUnlocked ? (
                    <div className="text-[10px] sm:text-[11px] font-bold text-emerald-800 truncate">
                      {badge.unlockedDate || 'Tercapai'}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold text-stone-500">
                        <span>Progres</span>
                        <span>
                          {badge.currentValue}/{badge.targetValue}
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full"
                          style={{
                            width: `${Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: Piagam Penghargaan Adiwiyata */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden min-w-0 rounded-3xl border-2 border-emerald-600 shadow-2xl p-5 sm:p-6 space-y-4 text-center relative">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X size={16} />
            </button>

            {/* Certificate Header Emblem */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto text-3xl shadow-md border-4 border-amber-200">
              🏅
            </div>

            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800">
                Pemerintah Kabupaten Deli Serdang
              </div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 mt-0.5">
                Piagam Duta Sadar Lingkungan
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Program Adiwiyata &amp; Bank Sampah Sekolah
              </p>
            </div>

            {/* Certificate Body */}
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 text-center space-y-2">
              <div className="text-xs text-stone-600">Diberikan dengan bangga kepada:</div>
              <div className="text-base sm:text-lg font-black text-emerald-950 tracking-tight">
                {currentStudent.name}
              </div>
              <div className="inline-flex items-center gap-2 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-stone-700 border border-emerald-200">
                <span>{currentStudent.className}</span>
                <span>•</span>
                <span className="text-emerald-800">Kontribusi {currentStudent.totalKg.toFixed(1)} kg Sampah</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed pt-1">
                Atas keteladanan aktif memilah sampah dari sumbernya, menjaga kebersihan ruang kelas, dan menginspirasi budaya ramah lingkungan sekolah.
              </p>
            </div>

            {/* Official Stamp & Sign */}
            <div className="pt-2 flex items-center justify-between text-left border-t border-stone-200/80 px-2">
              <div>
                <div className="text-[10px] text-stone-500 font-bold">Terverifikasi:</div>
                <div className="text-xs font-extrabold text-stone-900">Bank Sampah Sekolah</div>
                <div className="text-[10px] text-emerald-700 font-bold">Status: Duta Aktif 2026</div>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-600 flex items-center justify-center text-emerald-800 text-[9px] font-black uppercase text-center leading-tight rotate-[-8deg] bg-emerald-50">
                Sah Adiwiyata
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  window.print();
                }}
                className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download size={14} />
                <span>Simpan Piagam</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Detail Lencana Pop-up */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-[calc(100vw-2rem)] sm:max-w-sm rounded-3xl border border-stone-200 p-5 text-center space-y-3.5 shadow-xl relative">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-3.5 right-3.5 text-stone-400 hover:text-stone-700 w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center cursor-pointer"
            >
              <X size={14} />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-4xl mx-auto shadow-xs">
              {selectedBadge.icon}
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                {selectedBadge.unlocked ? 'Lencana Berhasil Diraih' : 'Lencana Sedang Diperjuangkan'}
              </div>
              <h3 className="text-base font-extrabold text-stone-900 mt-0.5">
                {selectedBadge.title}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {selectedBadge.description}
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs font-bold text-stone-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Syarat Target:</span>
                <span>{selectedBadge.targetValue} {selectedBadge.requiredMetric}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Capaian Saat Ini:</span>
                <span className="text-emerald-800">{selectedBadge.currentValue} {selectedBadge.requiredMetric}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
