import React, { useState } from 'react';
import {
  Wifi,
  Thermometer,
  Cpu,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Recycle,
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
  Lightbulb,
  PartyPopper,
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
import { WasteCategoryIcon, WasteItemIcon } from '../lib/appIcons';
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
    if (comp.fillPercent >= 90) return { label: 'Penuh!', bg: 'bg-destructive/10 text-destructive border-destructive/20' };
    if (comp.fillPercent >= 70) return { label: 'Hampir Penuh', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { label: 'Normal', bg: 'bg-secondary text-primary border-border' };
  };

  return (
    <div className="w-full min-w-0 max-w-4xl mx-auto space-y-4 pb-24 pt-1 md:px-2">
      {/* SECTION 0: Hero IoT Smart Bin Station Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-active text-primary-foreground shadow-md p-4 sm:p-5">
        {/* Top Bar: Station identity & Live Status */}
        <div className="relative flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary-active flex items-center justify-center border border-primary-foreground/25 shadow-inner">
                <Recycle size={24} className="text-primary-foreground" aria-hidden="true" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-foreground/70 shrink-0" />
                <h2 className="text-sm sm:text-base font-extrabold text-primary-foreground truncate tracking-tight">
                  {iotBin.binName}
                </h2>
              </div>
              <p className="text-xs text-primary-foreground/80 font-medium truncate">
                {currentClass?.name?.split(' - ')[0] || currentStudent.className} • Terhubung IoT Otomatis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex items-center gap-1.5 bg-overlay/20 px-3 py-1 rounded-full border border-primary-foreground/15 text-xs font-bold text-primary-foreground">
              <Wifi size={13} className="text-primary-foreground/80" aria-hidden="true" />
              <span>Sinyal Kuat</span>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 bg-overlay/20 px-3 py-1 rounded-full border border-primary-foreground/15 text-xs font-bold text-primary-foreground/90">
              <Thermometer size={13} className="text-primary-foreground/80" aria-hidden="true" />
              <span>{iotBin.temperatureC}°C</span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="relative mt-4">
          <div className="text-base sm:text-lg font-extrabold text-primary-foreground">
            Status Keterisian 4 Tong Kelas
          </div>
          <p className="text-xs text-primary-foreground/80 mt-0.5">
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
                className="bg-card rounded-2xl p-3 border border-border text-foreground shadow-xs flex flex-col justify-between relative transition-all"
              >
                {/* Lid Open Animated Badge */}
                {comp.isOpen && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md tracking-wide shrink-0 whitespace-nowrap z-10">
                    Terbuka
                  </div>
                )}

                {/* Top Info */}
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <WasteCategoryIcon category={catInfo.id} size={24} aria-hidden="true" />
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${statusInfo.bg}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="font-extrabold text-xs text-foreground mt-2 truncate">
                    {catInfo.name}
                  </div>
                  <div className="text-[11px] font-semibold text-muted-foreground">
                    Tong {catInfo.colorName}
                  </div>
                </div>

                {/* Rounded Progress Bar */}
                <div className="mt-3 space-y-1.5">
                  <div className="w-full bg-muted h-3 rounded-full overflow-hidden p-0.5 border border-border">
                    <div
                      className="h-full rounded-full transition-[width] duration-700"
                      style={{
                        width: `${Math.max(6, comp.fillPercent)}%`,
                        backgroundColor: comp.color,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-foreground">
                      {comp.fillPercent}%
                    </span>
                    <span className="font-medium text-muted-foreground">
                      {comp.currentKg} / {comp.maxKg} kg
                    </span>
                  </div>
                </div>

                {/* Empty Bin Action if Full */}
                {isFull && (
                  <button
                    type="button"
                    onClick={() => handleEmptyBin(cat)}
                    className="mt-2.5 w-full h-10 text-[11px] bg-destructive hover:bg-destructive/90 active:scale-95 text-destructive-foreground font-extrabold px-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    title="Kosongkan Tong"
                  >
                    <Trash2 size={12} aria-hidden="true" />
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
            <Activity size={16} className="text-primary" aria-hidden="true" />
            <h3 className="text-sm font-extrabold text-foreground">
              Panduan Tong & Nilai Kas Kelas
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
          {[
            {
              cat: 'organik',
              bg: 'bg-secondary/70 hover:bg-secondary',
              border: 'border-border',
              accent: 'text-primary',
              pill: 'bg-secondary text-secondary-foreground border-border',
            },
            {
              cat: 'plastik',
              bg: 'bg-muted/70 hover:bg-muted',
              border: 'border-border',
              accent: 'text-foreground',
              pill: 'bg-muted text-muted-foreground border-border',
            },
            {
              cat: 'kertas',
              bg: 'bg-accent/70 hover:bg-accent',
              border: 'border-border',
              accent: 'text-accent-foreground',
              pill: 'bg-accent text-accent-foreground border-border',
            },
            {
              cat: 'logam_b3',
              bg: 'bg-destructive/10 hover:bg-destructive/15',
              border: 'border-destructive/20',
              accent: 'text-destructive',
              pill: 'bg-destructive/10 text-destructive border-destructive/20',
            },
          ].map((style) => {
            const data = WASTE_CATEGORIES[style.cat as keyof typeof WASTE_CATEGORIES];
            return (
              <button
                type="button"
                key={style.cat}
                onClick={() => setActiveCategoryFilter(style.cat)}
                className={`${style.bg} border ${style.border} rounded-2xl p-3 sm:p-3.5 shadow-xs transition-all flex flex-col justify-between text-left w-full cursor-pointer hover:shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <WasteCategoryIcon category={data.id} size={24} aria-hidden="true" />
                    <span className={`text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${style.pill} truncate max-w-[110px] sm:max-w-none`}>
                      Tong {data.colorName}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-foreground mt-1.5 sm:mt-2 truncate">
                    {data.name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 line-clamp-2 leading-tight">
                    {data.examples.join(', ')}
                  </p>
                </div>

                <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-border flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground">Nilai</span>
                  <div className="flex items-baseline gap-0.5 sm:gap-1">
                    <span className={`text-xs sm:text-sm font-black ${style.accent}`}>
                      Rp {data.pricePerKg.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground">/kg</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Simulator Setor Sampah Siswa */}
      <div className="bg-card rounded-3xl p-4 sm:p-5 border border-border shadow-xs space-y-4">
        {/* Simulator Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-primary" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-extrabold text-foreground">
                Simulasi Setor Sampah
              </h3>
              <p className="text-xs text-muted-foreground">
                Pilih sampah untuk mencoba interaksi sensor timbang otomatis.
              </p>
            </div>
          </div>
        </div>

        {/* Step 1: Filter & Item Grid */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs font-extrabold text-foreground">
              1. Pilih Sampah yang Hendak Disetor:
            </p>
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
                  type="button"
                  onClick={() => setActiveCategoryFilter(f.id)}
                  className={`text-[11px] font-extrabold px-3 h-10 inline-flex items-center rounded-full transition-all shrink-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    activeCategoryFilter === f.id
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
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
                  type="button"
                  disabled={isSimulating}
                  onClick={() => handleSelectItem(item)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isSelected
                      ? 'bg-secondary/80 border-primary shadow-sm'
                      : 'bg-card border-border hover:border-primary/50 hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <WasteItemIcon itemId={item.id} size={24} aria-hidden="true" />
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      Tong {catData.colorName}
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <div className="text-xs font-extrabold text-foreground leading-tight truncate">
                      {item.name}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                      <span className="font-bold text-primary">+{item.points} Poin</span>
                      <span className="font-semibold text-muted-foreground">{item.defaultWeightKg} kg</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Quantity Stepper & Live Summary Cards */}
        <div className="bg-muted/50 rounded-2xl p-3.5 sm:p-4 border border-border space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Scale size={16} className="text-primary" aria-hidden="true" />
              <div>
                <div className="text-xs font-extrabold text-foreground">
                  {selectedItem.name}
                </div>
                <div className="text-[11px] font-medium text-muted-foreground">
                  Kategori: {WASTE_CATEGORIES[selectedItem.category].name}
                </div>
              </div>
            </div>

            {/* Tactile Big Stepper */}
            <div className="flex items-center gap-2 bg-card px-2.5 py-1.5 rounded-2xl border border-border shadow-xs">
              <button
                type="button"
                disabled={itemCount <= 1 || isSimulating}
                onClick={() => setItemCount((prev) => Math.max(1, prev - 1))}
                className="size-10 rounded-xl bg-muted hover:bg-accent active:scale-95 text-foreground font-black flex items-center justify-center text-sm disabled:opacity-40 cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring"
                title="Kurangi Jumlah"
                aria-label="Kurangi jumlah"
              >
                <Minus size={14} aria-hidden="true" />
              </button>
              <div className="text-sm font-black text-foreground min-w-[36px] text-center">
                {itemCount}
              </div>
              <button
                type="button"
                disabled={itemCount >= 10 || isSimulating}
                onClick={() => setItemCount((prev) => Math.min(10, prev + 1))}
                className="size-10 rounded-xl bg-secondary hover:bg-accent active:scale-95 text-primary font-black flex items-center justify-center text-sm disabled:opacity-40 cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring"
                title="Tambah Jumlah"
                aria-label="Tambah jumlah"
              >
                <Plus size={14} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Real-time Calculation Cards (Friendly Sans Nunito) */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-card p-2.5 rounded-2xl border border-border text-center shadow-xs">
              <div className="text-[10px] font-bold text-muted-foreground tracking-wider">
                Total Berat
              </div>
              <div className="text-sm sm:text-base font-black text-foreground mt-0.5">
                {calculateTotalWeight()} kg
              </div>
            </div>
            <div className="bg-secondary/80 p-2.5 rounded-2xl border border-border text-center shadow-xs">
              <div className="text-[10px] font-bold text-primary tracking-wider">
                Habituasi LISA
              </div>
              <div className="text-sm sm:text-base font-black text-primary mt-0.5">
                +1 Log Pilah
              </div>
            </div>
            <div className="bg-muted/80 p-2.5 rounded-2xl border border-border text-center shadow-xs">
              <div className="text-[10px] font-bold text-foreground tracking-wider">
                Poin LISA
              </div>
              <div className="text-sm sm:text-base font-black text-foreground mt-0.5">
                +{calculateEarnedPoints()} Poin
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Flow Information & Fun Fact Memo */}
        <div className="space-y-2">
          <div className="p-3 bg-muted/60 rounded-2xl border border-border text-xs text-foreground flex items-start gap-2.5 leading-relaxed">
            <Info size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-extrabold text-foreground">Alur Opung Sari &amp; Bank Sampah: </span>
              <span className="text-muted-foreground">
                Tong Pintar IoT mendata volume &amp; habituasi LISA harian serta memberi Poin Kelas. Saldo Rupiah Kas Kelas diperoleh saat sampah terpilah disetor fisik ke <strong>Koordinator Bank Sampah Sekolah</strong>.
              </span>
            </div>
          </div>

          <div className="p-3 bg-secondary/60 rounded-2xl border border-border text-xs text-foreground flex items-start gap-2.5 leading-relaxed">
            <Lightbulb size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-extrabold text-foreground">Tahukah Kamu? </span>
              <span className="text-muted-foreground">{selectedItem.funFact}</span>
            </div>
          </div>
        </div>

        {/* Step 4: 3D Tactile CTA Action Button */}
        <div>
          <button
            id="btn-trigger-iot-disposal"
            type="button"
            disabled={isSimulating}
            onClick={handleStartDisposal}
            className={`w-full py-4 px-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-md active:translate-y-1 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isSimulating
                ? 'bg-muted border-b-4 border-border text-muted-foreground cursor-wait'
                : 'bg-primary hover:bg-primary/90 active:border-b-0 border-b-4 border-primary-active text-primary-foreground cursor-pointer'
            }`}
          >
            {activeStep === 'idle' && (
              <>
                <Activity size={16} aria-hidden="true" />
                <span>Buka Tutup Tong &amp; Catat LISA Sekarang</span>
              </>
            )}
            {activeStep === 'scanning_rfid' && (
              <>
                <QrCode size={16} className="text-primary-foreground/80" aria-hidden="true" />
                <span>Memindai Kartu Siswa {currentStudent.name}...</span>
              </>
            )}
            {activeStep === 'sensor_detecting' && (
              <>
                <Cpu size={16} className="text-primary-foreground/80" aria-hidden="true" />
                <span>Sensor Mengenali: {selectedItem.name}...</span>
              </>
            )}
            {activeStep === 'lid_opening' && (
              <>
                <Layers size={16} className="text-primary-foreground/80" aria-hidden="true" />
                <span>
                  Tutup Tong {WASTE_CATEGORIES[selectedItem.category].name} Terbuka...
                </span>
              </>
            )}
            {activeStep === 'success' && (
              <>
                <CheckCircle2 size={16} className="text-primary-foreground/80" aria-hidden="true" />
                <span>Sampah Berhasil Masuk &amp; Ditimbang!</span>
              </>
            )}
          </button>
        </div>

        {/* Success Celebration Card */}
        {lastRewardInfo && activeStep === 'success' && (
          <div className="p-4 bg-gradient-to-r from-primary to-primary-active rounded-2xl text-primary-foreground flex items-center justify-between gap-3 shadow-md animate-in fade-in zoom-in-95 duration-200">
            <div>
              <div className="text-sm font-black flex items-center gap-1.5">
                <PartyPopper size={16} className="text-primary-foreground/80 shrink-0" aria-hidden="true" />
                <span>Hore! Habituasi LISA Berhasil Dicatat</span>
              </div>
              <div className="text-xs text-primary-foreground/85 mt-1 leading-tight">
                {lastRewardInfo.itemName} ({lastRewardInfo.weight} kg) tercatat pada Tong Cerdas! Menambah +1 log LISA kelas &amp;{' '}
                <span className="font-extrabold text-primary-foreground">
                  +{lastRewardInfo.points} Poin LISA
                </span>{' '}
                untukmu.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveStep('idle')}
              className="text-xs font-black bg-card text-primary px-3.5 py-2 rounded-xl hover:bg-secondary active:scale-95 transition-all shrink-0 cursor-pointer shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Setor Lagi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
