import React, { useState } from 'react';
import {
  Wifi,
  Thermometer,
  Cpu,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
  QrCode,
  Layers,
  Scale,
  Leaf,
  Tag,
  Wallet,
  Coins,
  Plus,
  Minus,
  ArrowRight,
  Info,
  Trash2,
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import {
  BinCompartment,
  SchoolClass,
  SmartBinIoTState,
  Student,
  WasteCategory,
  WasteItem,
} from '../types';
import { WASTE_CATEGORIES, WASTE_ITEMS } from '../data/initialData';
import confetti from 'canvas-confetti';

interface SmartBinIoTTabProps {
  currentStudent: Student;
  currentClass?: SchoolClass;
  iotBin: SmartBinIoTState;
  onUpdateBin: (updatedBin: SmartBinIoTState) => void;
  onWasteDisposed: (
    item: WasteItem,
    weightKg: number,
    earnedPoints: number
  ) => void;
}

export const SmartBinIoTTab: React.FC<SmartBinIoTTabProps> = ({
  currentStudent,
  currentClass,
  iotBin,
  onUpdateBin,
  onWasteDisposed,
}) => {
  const [selectedItem, setSelectedItem] = useState<WasteItem>(WASTE_ITEMS[0]);
  const [itemWeightKg, setItemWeightKg] = useState<number>(WASTE_ITEMS[0].defaultWeightKg);
  const [itemCount, setItemCount] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<
    'idle' | 'scanning_rfid' | 'sensor_detecting' | 'lid_opening' | 'success'
  >('idle');
  const [detectedCategory, setDetectedCategory] = useState<WasteCategory | null>(null);
  const [lastRewardInfo, setLastRewardInfo] = useState<{
    points: number;
    itemName: string;
    weight: number;
  } | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const handleSelectItem = (item: WasteItem) => {
    setSelectedItem(item);
    setItemWeightKg(item.defaultWeightKg);
    setItemCount(1);
  };

  const calculateTotalWeight = () => {
    return Number((itemWeightKg * itemCount).toFixed(3));
  };

  const calculateEarnedPoints = () => {
    return selectedItem.points * itemCount;
  };

  const handleStartDisposal = () => {
    if (isSimulating) return;

    setIsSimulating(true);
    setActiveStep('scanning_rfid');

    // Step 1: RFID Scan
    setTimeout(() => {
      setActiveStep('sensor_detecting');

      // Step 2: Optical sensor identification
      setTimeout(() => {
        setDetectedCategory(selectedItem.category);
        setActiveStep('lid_opening');

        // Open compartment lid
        const updatedCompartments = { ...iotBin.compartments };
        updatedCompartments[selectedItem.category].isOpen = true;
        onUpdateBin({
          ...iotBin,
          currentLidStatus: 'opening',
          compartments: updatedCompartments,
        });

        // Step 3: Weighing & Dropping into container
        setTimeout(() => {
          const totalKg = calculateTotalWeight();
          const earnedPoints = calculateEarnedPoints();

          const comp = updatedCompartments[selectedItem.category];
          const newCurrentKg = Number((comp.currentKg + totalKg).toFixed(2));
          const newFillPercent = Math.min(100, Math.round((newCurrentKg / comp.maxKg) * 100));

          updatedCompartments[selectedItem.category] = {
            ...comp,
            currentKg: newCurrentKg,
            fillPercent: newFillPercent,
            isOpen: false,
            status: newFillPercent >= 90 ? 'penuh' : newFillPercent >= 75 ? 'hampir_penuh' : 'normal',
          };

          onUpdateBin({
            ...iotBin,
            currentLidStatus: 'closed',
            lastSyncTime: 'Baru saja',
            compartments: updatedCompartments,
          });

          onWasteDisposed(selectedItem, totalKg, earnedPoints);

          setLastRewardInfo({
            points: earnedPoints,
            itemName: `${itemCount}x ${selectedItem.name}`,
            weight: totalKg,
          });

          setActiveStep('success');
          setIsSimulating(false);

          confetti({
            particleCount: 60,
            spread: 65,
            origin: { y: 0.6 },
            colors: ['#10B981', '#F59E0B', '#3B82F6', '#14B8A6'],
          });
        }, 1600);
      }, 1200);
    }, 1000);
  };

  const handleEmptyBin = (category: WasteCategory) => {
    const updated = { ...iotBin.compartments };
    updated[category] = {
      ...updated[category],
      currentKg: 0,
      fillPercent: 0,
      status: 'normal',
    };
    onUpdateBin({
      ...iotBin,
      compartments: updated,
      lastSyncTime: 'Telah dikosongkan petugas',
    });
  };

  const filteredWasteItems = activeCategoryFilter === 'all'
    ? WASTE_ITEMS
    : WASTE_ITEMS.filter((item) => item.category === activeCategoryFilter);

  const getStatusLabel = (comp: BinCompartment) => {
    if (comp.fillPercent >= 90) return { label: 'Penuh!', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
    if (comp.fillPercent >= 70) return { label: 'Hampir Penuh', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { label: 'Normal', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  };

  return (
    <div className="w-full min-w-0 max-w-4xl mx-auto space-y-4 pb-24 pt-1 md:px-2">
      {/* SECTION 0: Hero IoT Smart Bin Station Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-md p-4 sm:p-5">
        {/* Subtle background ambient glows */}
        <div className="pointer-events-none absolute -right-6 -top-6 w-36 h-36 rounded-full bg-white/10 blur-xl" />
        <div className="pointer-events-none absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-emerald-400/15 blur-lg" />

        {/* Top Bar: Station identity & Live Status */}
        <div className="relative flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/25 shadow-inner">
                ♻️
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse shrink-0" />
                <h2 className="text-sm sm:text-base font-extrabold text-white truncate tracking-tight">
                  {iotBin.binName}
                </h2>
              </div>
              <p className="text-xs text-emerald-100/85 font-medium truncate">
                {currentClass?.name?.split(' - ')[0] || currentStudent.className} • Terhubung IoT Otomatis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-xs font-bold text-white">
              <Wifi size={13} className="text-emerald-300" />
              <span>Sinyal Kuat</span>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-xs font-bold text-emerald-100">
              <Thermometer size={13} className="text-amber-300" />
              <span>{iotBin.temperatureC}°C</span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="relative mt-4">
          <div className="text-base sm:text-lg font-extrabold text-white">
            Status Keterisian 4 Tong Kelas
          </div>
          <p className="text-xs text-emerald-100/80 mt-0.5">
            Sensor digital memantau kapasitas tong agar kelas tetap bersih, rapi, dan siap ditimbang.
          </p>
        </div>

        {/* 4 Kompartemen Tong Sampah in Squircle Cards */}
        <div className="relative mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(['organik', 'plastik', 'kertas', 'logam_b3'] as WasteCategory[]).map((cat) => {
            const comp = iotBin.compartments[cat];
            const catInfo = WASTE_CATEGORIES[cat];
            const isFull = comp.fillPercent >= 90;
            const statusInfo = getStatusLabel(comp);

            return (
              <div
                key={cat}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-white/50 text-stone-900 shadow-xs flex flex-col justify-between relative transition-all"
              >
                {/* Lid Open Animated Badge */}
                {comp.isOpen && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md animate-bounce tracking-wide shrink-0 whitespace-nowrap z-10">
                    TUTUP TERBUKA
                  </div>
                )}

                {/* Top Info */}
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-2xl drop-shadow-xs">{catInfo.icon}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${statusInfo.bg}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="font-extrabold text-xs text-stone-900 mt-2 truncate">
                    {catInfo.name}
                  </div>
                  <div className="text-[11px] font-semibold text-stone-500">
                    Tong {catInfo.colorName}
                  </div>
                </div>

                {/* Rounded Progress Bar */}
                <div className="mt-3 space-y-1.5">
                  <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden p-0.5 border border-stone-200">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.max(6, comp.fillPercent)}%`,
                        backgroundColor: comp.color,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-stone-700">
                      {comp.fillPercent}%
                    </span>
                    <span className="font-medium text-stone-500">
                      {comp.currentKg} / {comp.maxKg} kg
                    </span>
                  </div>
                </div>

                {/* Empty Bin Action if Full */}
                {isFull && (
                  <button
                    onClick={() => handleEmptyBin(cat)}
                    className="mt-2.5 w-full text-[11px] bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    title="Kosongkan Tong"
                  >
                    <Trash2 size={12} />
                    <span>Kosongkan</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: Panduan Tong & Nilai Kas (Katalog Terpadu) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-700" />
            <h3 className="text-sm font-extrabold text-stone-900">
              Panduan Tong & Nilai Kas Kelas
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
          {[
            {
              cat: 'organik',
              bg: 'bg-emerald-50/70 hover:bg-emerald-50',
              border: 'border-emerald-200',
              accent: 'text-emerald-800',
              pill: 'bg-emerald-100/90 text-emerald-900 border-emerald-300',
            },
            {
              cat: 'plastik',
              bg: 'bg-amber-50/70 hover:bg-amber-50',
              border: 'border-amber-200',
              accent: 'text-amber-800',
              pill: 'bg-amber-100/90 text-amber-900 border-amber-300',
            },
            {
              cat: 'kertas',
              bg: 'bg-blue-50/70 hover:bg-blue-50',
              border: 'border-blue-200',
              accent: 'text-blue-800',
              pill: 'bg-blue-100/90 text-blue-900 border-blue-300',
            },
            {
              cat: 'logam_b3',
              bg: 'bg-rose-50/70 hover:bg-rose-50',
              border: 'border-rose-200',
              accent: 'text-rose-800',
              pill: 'bg-rose-100/90 text-rose-900 border-rose-300',
            },
          ].map((style) => {
            const data = WASTE_CATEGORIES[style.cat as keyof typeof WASTE_CATEGORIES];
            return (
              <div
                key={style.cat}
                onClick={() => setActiveCategoryFilter(style.cat)}
                className={`${style.bg} border ${style.border} rounded-2xl p-3 sm:p-3.5 shadow-xs transition-all flex flex-col justify-between cursor-pointer hover:shadow-sm`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xl sm:text-2xl drop-shadow-xs">{data.icon}</span>
                    <span className={`text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${style.pill} truncate max-w-[85px] sm:max-w-none`}>
                      Tong {data.colorName}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-stone-900 mt-1.5 sm:mt-2 truncate">
                    {data.name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-stone-600 mt-0.5 sm:mt-1 line-clamp-2 leading-tight">
                    {data.examples.join(', ')}
                  </p>
                </div>

                <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-stone-200/60 flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-bold text-stone-500">Nilai</span>
                  <div className="flex items-baseline gap-0.5 sm:gap-1">
                    <span className={`text-xs sm:text-sm font-black ${style.accent}`}>
                      Rp {data.pricePerKg.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-stone-400">/kg</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Simulator Setor Sampah Siswa */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-4">
        {/* Simulator Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-emerald-700" />
            <div>
              <h3 className="text-sm font-extrabold text-stone-900">
                Simulasi Setor Sampah
              </h3>
              <p className="text-xs text-stone-500">
                Pilih sampah untuk mencoba interaksi sensor timbang otomatis.
              </p>
            </div>
          </div>
        </div>

        {/* Step 1: Filter & Item Grid */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-extrabold text-stone-900">
              1. Pilih Sampah yang Hendak Disetor:
            </label>
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'plastik', label: 'Plastik' },
                { id: 'kertas', label: 'Kertas' },
                { id: 'organik', label: 'Organik' },
                { id: 'logam_b3', label: 'Logam' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveCategoryFilter(f.id)}
                  className={`text-[11px] font-extrabold px-3 py-1 rounded-full transition-all shrink-0 cursor-pointer ${
                    activeCategoryFilter === f.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {filteredWasteItems.map((item) => {
              const isSelected = selectedItem.id === item.id;
              const catData = WASTE_CATEGORIES[item.category];

              return (
                <button
                  key={item.id}
                  id={`select-waste-${item.id}`}
                  disabled={isSimulating}
                  onClick={() => handleSelectItem(item)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-600 shadow-sm'
                      : 'bg-white border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl drop-shadow-xs">{item.icon}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                      Tong {catData.colorName}
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <div className="text-xs font-extrabold text-stone-900 leading-tight truncate">
                      {item.name}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                      <span className="font-bold text-amber-700">+{item.points} Poin</span>
                      <span className="font-semibold text-stone-400">{item.defaultWeightKg} kg</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Quantity Stepper & Live Summary Cards */}
        <div className="bg-stone-50 rounded-2xl p-3.5 sm:p-4 border border-stone-200/90 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Scale size={16} className="text-emerald-700" />
              <div>
                <div className="text-xs font-extrabold text-stone-900">
                  {selectedItem.name}
                </div>
                <div className="text-[11px] font-medium text-stone-500">
                  Kategori: {WASTE_CATEGORIES[selectedItem.category].name}
                </div>
              </div>
            </div>

            {/* Tactile Big Stepper */}
            <div className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-2xl border border-stone-200 shadow-xs">
              <button
                disabled={itemCount <= 1 || isSimulating}
                onClick={() => setItemCount((prev) => Math.max(1, prev - 1))}
                className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-700 font-black flex items-center justify-center text-sm disabled:opacity-40 cursor-pointer transition-all"
                title="Kurangi Jumlah"
              >
                <Minus size={14} />
              </button>
              <div className="text-sm font-black text-stone-900 min-w-[36px] text-center">
                {itemCount}
              </div>
              <button
                disabled={itemCount >= 10 || isSimulating}
                onClick={() => setItemCount((prev) => Math.min(10, prev + 1))}
                className="w-8 h-8 rounded-xl bg-emerald-100 hover:bg-emerald-200 active:scale-95 text-emerald-800 font-black flex items-center justify-center text-sm disabled:opacity-40 cursor-pointer transition-all"
                title="Tambah Jumlah"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Real-time Calculation Cards (Friendly Sans Nunito) */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-white p-2.5 rounded-2xl border border-stone-200/80 text-center shadow-xs">
              <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                Total Berat
              </div>
              <div className="text-sm sm:text-base font-black text-stone-900 mt-0.5">
                {calculateTotalWeight()} kg
              </div>
            </div>
            <div className="bg-emerald-50/80 p-2.5 rounded-2xl border border-emerald-200 text-center shadow-xs">
              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                Habituasi LISA
              </div>
              <div className="text-sm sm:text-base font-black text-emerald-800 mt-0.5">
                +1 Log Pilah
              </div>
            </div>
            <div className="bg-amber-50/80 p-2.5 rounded-2xl border border-amber-200 text-center shadow-xs">
              <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                Poin LISA
              </div>
              <div className="text-sm sm:text-base font-black text-amber-900 mt-0.5">
                +{calculateEarnedPoints()} Poin
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Flow Information & Fun Fact Memo */}
        <div className="space-y-2">
          <div className="p-3 bg-blue-50/90 rounded-2xl border border-blue-200/80 text-xs text-blue-950 flex items-start gap-2.5 leading-relaxed">
            <Info size={16} className="text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-blue-950">Alur Opung Sari &amp; Bank Sampah: </span>
              <span className="text-blue-900">
                Tong Pintar IoT mendata volume &amp; habituasi LISA harian serta memberi Poin Kelas. Saldo Rupiah Kas Kelas diperoleh saat sampah terpilah disetor fisik ke <strong>Koordinator Bank Sampah Sekolah</strong>.
              </span>
            </div>
          </div>

          <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2.5 leading-relaxed">
            <span className="text-base shrink-0">💡</span>
            <div>
              <span className="font-extrabold text-amber-950">Tahukah Kamu? </span>
              <span className="text-amber-900">{selectedItem.funFact}</span>
            </div>
          </div>
        </div>

        {/* Step 4: 3D Tactile CTA Action Button */}
        <div>
          <button
            id="btn-trigger-iot-disposal"
            disabled={isSimulating}
            onClick={handleStartDisposal}
            className={`w-full py-4 px-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-md active:translate-y-1 ${
              isSimulating
                ? 'bg-stone-700 border-b-4 border-stone-900 text-white cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-700 active:border-b-0 border-b-4 border-emerald-800 text-white cursor-pointer'
            }`}
          >
            {activeStep === 'idle' && (
              <>
                <Zap size={16} />
                <span>Buka Tutup Tong &amp; Catat LISA Sekarang</span>
              </>
            )}
            {activeStep === 'scanning_rfid' && (
              <>
                <QrCode size={16} className="animate-spin text-amber-300" />
                <span>Memindai Kartu Siswa {currentStudent.name}...</span>
              </>
            )}
            {activeStep === 'sensor_detecting' && (
              <>
                <Cpu size={16} className="animate-pulse text-cyan-300" />
                <span>Sensor Mengenali: {selectedItem.name}...</span>
              </>
            )}
            {activeStep === 'lid_opening' && (
              <>
                <Layers size={16} className="animate-bounce text-emerald-300" />
                <span>
                  Tutup Tong {WASTE_CATEGORIES[selectedItem.category].name} Terbuka...
                </span>
              </>
            )}
            {activeStep === 'success' && (
              <>
                <CheckCircle2 size={16} className="text-emerald-300" />
                <span>Sampah Berhasil Masuk &amp; Ditimbang!</span>
              </>
            )}
          </button>
        </div>

        {/* Success Celebration Card */}
        {lastRewardInfo && activeStep === 'success' && (
          <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl text-white flex items-center justify-between gap-3 shadow-md animate-in fade-in zoom-in-95 duration-200">
            <div>
              <div className="text-sm font-black flex items-center gap-1.5">
                <span>🎉 Hore! Habituasi LISA Berhasil Dicatat</span>
              </div>
              <div className="text-xs text-emerald-100 mt-1 leading-tight">
                {lastRewardInfo.itemName} ({lastRewardInfo.weight} kg) tercatat pada Tong Cerdas! Menambah +1 log LISA kelas &amp;{' '}
                <span className="font-extrabold text-amber-200">
                  +{lastRewardInfo.points} Eco-Points
                </span>{' '}
                untukmu.
              </div>
            </div>
            <button
              onClick={() => setActiveStep('idle')}
              className="text-xs font-black bg-white text-emerald-900 px-3.5 py-2 rounded-xl hover:bg-emerald-50 active:scale-95 transition-all shrink-0 cursor-pointer shadow-xs"
            >
              Setor Lagi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
