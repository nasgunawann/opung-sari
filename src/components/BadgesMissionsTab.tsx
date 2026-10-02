import React, { useState } from 'react';
import {
  Award,
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
import { BadgeIcon, StudentAvatar } from '../lib/appIcons';
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
      colors: ['#10B981', '#F59E0B', '#34D399', '#059669'],
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-active text-primary-foreground shadow-md p-4 sm:p-5">
        {/* Top Bar: Profile, Level, and Piagam Action */}
        <div className="relative flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center text-3xl border border-primary-foreground/25 shadow-inner">
                <StudentAvatar name={currentStudent?.name ?? 'Siswa'} size={26} />
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-[10px] font-black shadow-xs border border-primary-foreground/80">
                Lv.{currentStudent.level}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="text-sm sm:text-base font-extrabold text-primary-foreground truncate tracking-tight">
                  {currentStudent.name}
                </h2>
              </div>
              <p className="text-xs text-primary-foreground/85 font-medium truncate">
                Level {currentStudent.level} • {currentStudent.className}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCertificate(true)}
            className="flex items-center gap-1.5 h-10 bg-card hover:bg-secondary active:scale-95 text-primary font-extrabold text-xs px-3.5 rounded-xl shadow-xs transition-all cursor-pointer shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <FileCheck size={14} className="text-primary" aria-hidden="true" />
            <span>Piagam Duta Adiwiyata</span>
          </button>
        </div>

        {/* Level XP Progress Bar */}
        <div className="relative mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-primary-foreground">
            <span>Kemajuan Menuju Level {currentStudent.level + 1}</span>
            <span className="text-primary-foreground font-extrabold">
              {currentStudent.points} / {nextLevelPoints} XP ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-overlay/20 h-3 rounded-full overflow-hidden p-0.5 border border-primary-foreground/20">
            <div
              className="bg-amber-400 h-full rounded-full transition-[width] duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-primary-foreground/75">
            Kumpulkan {Math.max(0, nextLevelPoints - currentStudent.points)} XP lagi dari pemilahan sampah &amp; kuis untuk naik pangkat!
          </p>
        </div>
      </div>

      {/* SECTION 1: Estimasi Dampak Ekologis Nyata */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <TreePine size={16} className="text-primary" aria-hidden="true" />
            <h3 className="text-sm font-extrabold text-foreground">
              Dampak Lingkungan Nyata Kamu
            </h3>
          </div>
          <span className="text-xs font-bold text-primary bg-secondary px-2.5 py-1 rounded-full border border-border">
            Total {currentStudent.totalKg.toFixed(1)} kg Terpilah
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-secondary border border-border rounded-2xl p-2.5 sm:p-3.5 text-center shadow-xs flex flex-col items-center justify-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-accent text-primary flex items-center justify-center mb-1 sm:mb-2">
              <TreePine size={16} className="sm:w-5 sm:h-5" aria-hidden="true" />
            </div>
            <div className="text-sm sm:text-xl font-black text-foreground truncate w-full">
              {treesSaved}
            </div>
            <div className="text-[10px] sm:text-xs font-extrabold text-foreground mt-0.5 leading-tight">
              Pohon Terjaga
            </div>
            <p className="hidden sm:block text-[11px] text-muted-foreground mt-1 leading-tight">
              Dari kertas yang kamu tabung
            </p>
          </div>

          <div className="bg-secondary border border-border rounded-2xl p-2.5 sm:p-3.5 text-center shadow-xs flex flex-col items-center justify-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-accent text-primary flex items-center justify-center mb-1 sm:mb-2">
              <Droplets size={16} className="sm:w-5 sm:h-5" aria-hidden="true" />
            </div>
            <div className="text-sm sm:text-xl font-black text-foreground truncate w-full">
              {waterSavedLiters} L
            </div>
            <div className="text-[10px] sm:text-xs font-extrabold text-foreground mt-0.5 leading-tight">
              Air Terhemat
            </div>
            <p className="hidden sm:block text-[11px] text-muted-foreground mt-1 leading-tight">
              Daur ulang sirkular ramah
            </p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-2.5 sm:p-3.5 text-center shadow-xs flex flex-col items-center justify-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-100/90 text-amber-700 flex items-center justify-center mb-1 sm:mb-2">
              <Wind size={16} className="sm:w-5 sm:h-5" aria-hidden="true" />
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
      <div className="bg-card rounded-3xl p-4 sm:p-5 border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-primary" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-extrabold text-foreground">
                Misi LISA Adiwiyata Pekan Ini
              </h3>
              <p className="text-xs text-muted-foreground">
                Selesaikan misi mingguan untuk mengumpulkan poin dan menaikkan level.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-primary bg-secondary px-3 py-1 rounded-full border border-border">
            {completedMissionsCount} / {missions.length} Selesai
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                mission.claimed
                  ? 'bg-muted border-border opacity-85'
                  : mission.done
                  ? 'bg-secondary border-border shadow-xs ring-1 ring-primary/20'
                  : 'bg-card border-border hover:border-primary/40'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5 shrink-0">
                  {mission.done ? (
                    <div className="w-7 h-7 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                      <CheckCircle2 size={16} strokeWidth={2.5} aria-hidden="true" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-xl bg-muted border-2 border-border text-muted-foreground flex items-center justify-center">
                      <Target size={14} aria-hidden="true" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className={`text-xs sm:text-sm font-extrabold leading-tight ${
                      mission.claimed ? 'text-muted-foreground' : 'text-foreground'
                    }`}>
                      {mission.title}
                    </h4>
                    <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full shrink-0">
                      +{mission.rewardPoints} XP
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">
                      {mission.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {mission.desc}
                  </p>

                  {/* Micro progress bar if incomplete */}
                  {!mission.done && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="w-24 bg-muted h-2 rounded-full overflow-hidden border border-border">
                        <div
                          className="bg-primary h-full rounded-full transition-[width]"
                          style={{ width: `${mission.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-muted-foreground">
                        {mission.progressText}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action / Status Pill */}
              <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-muted-foreground">Target Mingguan</span>
                {mission.claimed ? (
                  <span className="text-xs font-bold text-primary bg-accent px-2.5 py-1 rounded-xl flex items-center gap-1">
                    <Check size={12} strokeWidth={3} aria-hidden="true" />
                    <span>Selesai</span>
                  </span>
                ) : mission.done ? (
                  <button
                    type="button"
                    onClick={() => handleClaimReward(mission.id, mission.rewardPoints)}
                    className="h-10 bg-primary hover:bg-primary-active active:scale-95 text-primary-foreground font-extrabold text-xs px-3.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border-b-2 border-primary-active outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Gift size={13} aria-hidden="true" />
                    <span>Klaim +{mission.rewardPoints} XP</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-xl">
                    {mission.progressText}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Lemari Lencana Prestasi (Trophy Showcase) */}
      <div className="bg-card rounded-3xl p-4 sm:p-5 border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Medal size={16} className="text-primary" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-extrabold text-foreground">
                Lemari Lencana Adiwiyata
              </h3>
              <p className="text-xs text-muted-foreground">
                Koleksi medali penghargaan atas pencapaian pelestarian lingkunganmu.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-foreground bg-muted px-3 py-1 rounded-full border border-border">
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
              type="button"
              onClick={() => setBadgeFilter(tab.id as typeof badgeFilter)}
              className={`h-10 text-xs font-extrabold px-3 rounded-full transition-all shrink-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                badgeFilter === tab.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
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
              <button
                type="button"
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`w-full text-left p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isUnlocked
                    ? 'bg-secondary border-border hover:border-primary hover:bg-accent shadow-xs'
                    : 'bg-muted border-border opacity-75 hover:opacity-90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-2">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-card flex items-center justify-center text-xl sm:text-2xl shadow-xs border border-border shrink-0">
                      <BadgeIcon badgeId={badge.id} size={24} />
                    </div>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] font-black bg-accent text-primary border border-border px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                        <CheckCircle2 size={10} strokeWidth={3} aria-hidden="true" />
                        <span>Terbuka</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] font-bold bg-muted text-muted-foreground px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                        <Lock size={9} aria-hidden="true" />
                        <span>Terkunci</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-sm font-extrabold text-foreground leading-tight truncate">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-2.5 sm:mt-3 pt-2 border-t border-border">
                  {isUnlocked ? (
                    <div className="text-[10px] sm:text-[11px] font-bold text-primary truncate">
                      {badge.unlockedDate || 'Tercapai'}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold text-muted-foreground">
                        <span>Progres</span>
                        <span>
                          {badge.currentValue}/{badge.targetValue}
                        </span>
                      </div>
                      <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{
                            width: `${Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MODAL: Piagam Penghargaan Adiwiyata */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-overlay/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card w-full max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden min-w-0 rounded-3xl border-2 border-primary shadow-2xl p-5 sm:p-6 space-y-4 text-center relative">
            <button
              type="button"
              onClick={() => setShowCertificate(false)}
              aria-label="Tutup"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground size-10 rounded-full bg-muted flex items-center justify-center cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X size={16} aria-hidden="true" />
            </button>

            {/* Certificate Header Emblem */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-primary-foreground flex items-center justify-center mx-auto shadow-md border-4 border-amber-200">
              <Award size={30} aria-hidden="true" />
            </div>

            <div>
              <div className="text-[10px] font-extrabold tracking-widest text-primary">
                Pemerintah Kabupaten Deli Serdang
              </div>
              <h3 className="text-base sm:text-lg font-black text-foreground mt-0.5">
                Piagam Duta Sadar Lingkungan
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Program Adiwiyata &amp; Bank Sampah Sekolah
              </p>
            </div>

            {/* Certificate Body */}
            <div className="p-4 bg-gradient-to-br from-secondary to-accent rounded-2xl border border-border text-center space-y-2">
              <div className="text-xs text-muted-foreground">Diberikan dengan bangga kepada:</div>
              <div className="text-base sm:text-lg font-black text-foreground tracking-tight">
                {currentStudent.name}
              </div>
              <div className="inline-flex items-center gap-2 bg-card/90 px-3 py-1 rounded-full text-xs font-bold text-foreground border border-border">
                <span>{currentStudent.className}</span>
                <span>•</span>
                <span className="text-primary">Kontribusi {currentStudent.totalKg.toFixed(1)} kg Sampah</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                Atas keteladanan aktif memilah sampah dari sumbernya, menjaga kebersihan ruang kelas, dan menginspirasi budaya ramah lingkungan sekolah.
              </p>
            </div>

            {/* Official Stamp & Sign */}
            <div className="pt-2 flex items-center justify-between text-left border-t border-border px-2">
              <div>
                <div className="text-[10px] text-muted-foreground font-bold">Terverifikasi:</div>
                <div className="text-xs font-extrabold text-foreground">Bank Sampah Sekolah</div>
                <div className="text-[10px] text-primary font-bold">Status: Duta Aktif 2026</div>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-primary flex items-center justify-center text-primary text-[9px] font-black uppercase text-center leading-tight rotate-[-8deg] bg-secondary">
                Sah Adiwiyata
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="h-10 px-3 bg-muted hover:bg-muted/80 active:scale-95 text-foreground text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Download size={14} aria-hidden="true" />
                <span>Simpan Piagam</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCertificate(false)}
                className="h-10 px-3 bg-primary hover:bg-primary-active active:scale-95 text-primary-foreground text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Detail Lencana Pop-up */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card w-full max-w-[calc(100vw-2rem)] sm:max-w-sm rounded-3xl border border-border p-5 text-center space-y-3.5 shadow-xl relative">
            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              aria-label="Tutup"
              className="absolute top-3.5 right-3.5 text-muted-foreground hover:text-foreground size-10 rounded-full bg-muted flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X size={14} aria-hidden="true" />
            </button>

            <div className="w-16 h-16 rounded-3xl bg-secondary border-2 border-border flex items-center justify-center text-4xl mx-auto shadow-xs">
              <BadgeIcon badgeId={selectedBadge.id} size={36} />
            </div>

            <div>
              <div className="text-[10px] font-bold tracking-wider text-primary">
                {selectedBadge.unlocked ? 'Lencana Berhasil Diraih' : 'Lencana Sedang Diperjuangkan'}
              </div>
              <h3 className="text-base font-extrabold text-foreground mt-0.5">
                {selectedBadge.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {selectedBadge.description}
              </p>
            </div>

            <div className="p-3 bg-muted rounded-2xl border border-border text-xs font-bold text-foreground space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Syarat Target:</span>
                <span>{selectedBadge.targetValue} {selectedBadge.requiredMetric}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Capaian Saat Ini:</span>
                <span className="text-primary">{selectedBadge.currentValue} {selectedBadge.requiredMetric}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="w-full h-10 bg-primary hover:bg-primary-active active:scale-95 text-primary-foreground text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
