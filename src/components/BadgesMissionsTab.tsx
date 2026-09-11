import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  TreePine,
  Droplets,
  Wind,
  CheckCircle,
  Lock,
  Medal,
  FileCheck,
  Target,
  Flame,
} from 'lucide-react';
import { BadgeAchievement, Student } from '../types';
import { BADGES_LIST } from '../data/initialData';

interface BadgesMissionsTabProps {
  currentStudent: Student;
}

export const BadgesMissionsTab: React.FC<BadgesMissionsTabProps> = ({
  currentStudent,
}) => {
  const [showCertificate, setShowCertificate] = useState(false);

  // Calculate environmental impact estimates based on student's total sorted waste
  const treesSaved = (currentStudent.totalKg * 0.017).toFixed(2);
  const waterSavedLiters = Math.round(currentStudent.totalKg * 26);
  const co2PreventedKg = (currentStudent.totalKg * 1.5).toFixed(1);

  // Next level calculation
  const nextLevelPoints = currentStudent.level * 100;
  const progressPercent = Math.min(
    100,
    Math.round((currentStudent.points / nextLevelPoints) * 100)
  );

  return (
      <div className="w-full space-y-3 pb-20 pt-1 md:px-4">
        {/* Level & Student Profile Card - Flat Solid Dark Visual Anchor */}
      <div className="bg-stone-900 text-white rounded-xl p-4 border border-stone-950 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-2xl">
            {currentStudent.avatar}
          </div>
          <div>
            <div className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">
              Level {currentStudent.level}
            </div>
            <h2 className="text-sm font-bold text-white leading-tight">{currentStudent.name}</h2>
            <div className="text-xs text-stone-300">
              {currentStudent.levelTitle} • {currentStudent.className}
            </div>
          </div>
        </div>

        {/* Level XP bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-medium text-stone-300">
            <span>Kemajuan Level Berikutnya</span>
            <span className="font-mono text-stone-300">
              {currentStudent.points} / {nextLevelPoints} XP
            </span>
          </div>
          <div className="w-full bg-stone-800 border border-stone-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Certificate button */}
        <div className="pt-1">
          <button
            onClick={() => {
              setShowCertificate(true);
            }}
            className="w-full py-1.5 bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-medium rounded-lg border border-stone-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <FileCheck size={13} />
            <span>Lihat Piagam Duta Lingkungan</span>
          </button>
        </div>
      </div>

      {/* Real Impact Counters (Dampak Lingkungan Nyata) */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TreePine size={15} className="text-stone-600" />
            <h3 className="text-xs font-semibold text-stone-900">
              Estimasi Dampak Lingkungan
            </h3>
          </div>
          <span className="text-[10px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded font-mono font-medium">
            Total {currentStudent.totalKg.toFixed(1)} kg
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
            <TreePine className="mx-auto text-stone-600 mb-1" size={16} />
            <div className="text-xs font-semibold font-mono text-stone-900">{treesSaved}</div>
            <div className="text-[10px] text-stone-500 leading-tight mt-0.5">
              Pohon Terlindungi
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
            <Droplets className="mx-auto text-stone-600 mb-1" size={16} />
            <div className="text-xs font-semibold font-mono text-stone-900">{waterSavedLiters} L</div>
            <div className="text-[10px] text-stone-500 leading-tight mt-0.5">
              Air Bersih Hemat
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
            <Wind className="mx-auto text-stone-600 mb-1" size={16} />
            <div className="text-xs font-semibold font-mono text-stone-900">{co2PreventedKg} kg</div>
            <div className="text-[10px] text-stone-500 leading-tight mt-0.5">
              CO₂ Dicegah
            </div>
          </div>
        </div>
      </div>

      {/* Misi Tantangan Mingguan */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Target size={15} className="text-emerald-600" />
            <h3 className="text-xs font-semibold text-stone-900">
              Misi Tantangan Adiwiyata Minggu Ini
            </h3>
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono font-medium">
            3/4 Tercapai
          </span>
        </div>

        <div className="space-y-2">
          {[
            {
              id: 'm-1',
              title: 'Pilah Sampah Plastik Bersih',
              desc: 'Setor minimal 1.0 kg botol/gelas plastik ke Smart Bin',
              reward: '+50 XP',
              progress: '1.2 / 1.0 kg',
              done: true,
            },
            {
              id: 'm-2',
              title: 'Disiplin Pemilahan 3 Hari',
              desc: 'Timbang sampah terpilah selama 3 hari dalam sepekan',
              reward: '+75 XP',
              progress: '3 / 3 Hari',
              done: true,
            },
            {
              id: 'm-3',
              title: 'Dukung Karya Daur Ulang',
              desc: 'Beli atau buat 1 produk kerajinan daur ulang siswa',
              reward: '+60 XP',
              progress: '1 / 1 Produk',
              done: true,
            },
            {
              id: 'm-4',
              title: 'Juara Kuis Edukasi 3R',
              desc: 'Selesaikan tantangan pilah sampah di modul edukasi dengan skor 100%',
              reward: '+100 XP',
              progress: '0 / 1 Selesai',
              done: false,
            },
          ].map((mission) => (
            <div
              key={mission.id}
              className={`p-3 rounded-lg border transition-colors flex items-center justify-between gap-2.5 ${
                mission.done
                  ? 'bg-emerald-50/40 border-emerald-200/80'
                  : 'bg-stone-50/70 border-stone-200'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5 shrink-0">
                  {mission.done ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <CheckCircle size={12} strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-stone-300 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-stone-300" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className={`text-xs font-semibold leading-tight ${mission.done ? 'text-stone-900 line-through decoration-stone-400' : 'text-stone-900'}`}>
                      {mission.title}
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded">
                      {mission.reward}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    {mission.desc}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span className={`text-[10px] font-mono font-medium px-2 py-1 rounded-md ${
                  mission.done
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-200/70 text-stone-600'
                }`}>
                  {mission.progress}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Koleksi Lencana Prestasi (Badges) */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Medal size={15} className="text-stone-600" />
            <h3 className="text-xs font-semibold text-stone-900">
              Lencana Adiwiyata
            </h3>
          </div>
          <span className="text-[10px] text-stone-500 font-mono">
            {BADGES_LIST.filter((b) => b.unlocked).length}/{BADGES_LIST.length} Terbuka
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {BADGES_LIST.map((badge) => {
            const isUnlocked = badge.unlocked;

            return (
              <div
                key={badge.id}
                className={`p-3 rounded-lg border transition-colors flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-white border-stone-300'
                    : 'bg-stone-50 border-stone-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl">{badge.icon}</span>
                    {isUnlocked ? (
                      <span className="w-4 h-4 rounded-full bg-stone-900 text-white flex items-center justify-center">
                        <CheckCircle size={10} strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center">
                        <Lock size={9} />
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-semibold text-stone-900 leading-tight">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-stone-400">Target:</span>
                  <span className="font-medium text-stone-700">
                    {badge.currentValue}/{badge.targetValue} {badge.requiredMetric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Piagam Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-[calc(100vw-2rem)] sm:max-w-sm max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden min-w-0 rounded-2xl border border-stone-200 p-5 text-center space-y-3 shadow-xl">
            <div className="text-2xl">🏅</div>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-stone-500">
              Piagam Penghargaan Adiwiyata
            </div>
            <h3 className="text-sm font-bold text-stone-900 leading-tight">
              Duta Sadar Lingkungan Sekolah
            </h3>
            <p className="text-xs text-stone-600">
              Diberikan kepada siswa:
            </p>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 min-w-0">
              <div className="text-sm font-bold text-stone-900 truncate">{currentStudent.name}</div>
              <div className="text-xs text-stone-600 font-mono truncate">
                {currentStudent.className} • {currentStudent.totalKg.toFixed(1)} kg sampah
              </div>
            </div>
            <p className="text-[11px] text-stone-500">
              Terima kasih atas kontribusi aktif memilah sampah dan menjaga lingkungan sekolah.
            </p>
            <button
              onClick={() => {
                setShowCertificate(false);
              }}
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Tutup Piagam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
