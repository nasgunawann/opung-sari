import React, { useState } from 'react';
import {
  Wifi,
  Thermometer,
  Cpu,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowDownCircle,
  RotateCcw,
  Zap,
  QrCode,
  Layers,
  Scale,
} from 'lucide-react';
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
  iotBin: SmartBinIoTState;
  onUpdateBin: (updatedBin: SmartBinIoTState) => void;
  onWasteDisposed: (
    item: WasteItem,
    weightKg: number,
    earnedRp: number,
    earnedPoints: number
  ) => void;
}

export const SmartBinIoTTab: React.FC<SmartBinIoTTabProps> = ({
  currentStudent,
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
    rp: number;
    itemName: string;
    weight: number;
  } | null>(null);

  // Manual target bin selection (allows child to test if they guess the correct bin or let sensor guide them)
  const [chosenCompartment, setChosenCompartment] = useState<WasteCategory>('plastik');

  const handleSelectItem = (item: WasteItem) => {
    setSelectedItem(item);
    setItemWeightKg(item.defaultWeightKg);
    setItemCount(1);
    setChosenCompartment(item.category);
  };

  const calculateTotalWeight = () => {
    return Number((itemWeightKg * itemCount).toFixed(3));
  };

  const calculateRewardRp = () => {
    const totalKg = calculateTotalWeight();
    const rate = WASTE_CATEGORIES[selectedItem.category].pricePerKg;
    return Math.max(50, Math.round(totalKg * rate));
  };

  const calculateEarnedPoints = () => {
    return selectedItem.points * itemCount;
  };

  // Run the full realistic IoT disposal flow
  const handleStartDisposal = () => {
    if (isSimulating) return;

    setIsSimulating(true);
    setActiveStep('scanning_rfid');

    // Step 1: RFID Scan (Simulate reading student badge)
    setTimeout(() => {
      setActiveStep('sensor_detecting');

      // Step 2: Optical/Inductive Waste Sensor detection
      setTimeout(() => {
        setDetectedCategory(selectedItem.category);
        setActiveStep('lid_opening');

        // Open the corresponding lid
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
          const earnedRp = calculateRewardRp();
          const earnedPoints = calculateEarnedPoints();

          // Update bin weight and fill level
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

          onWasteDisposed(selectedItem, totalKg, earnedRp, earnedPoints);

          setLastRewardInfo({
            points: earnedPoints,
            rp: earnedRp,
            itemName: `${itemCount}x ${selectedItem.name}`,
            weight: totalKg,
          });

          setActiveStep('success');
          setIsSimulating(false);

          // Confetti celebration
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.5 },
            colors: ['#10B981', '#F59E0B', '#3B82F6', '#10B981'],
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

  return (
    <div className="space-y-3.5 pb-20 pt-1">
      {/* IoT Status Panel - Flat Solid Dark Visual Anchor */}
      <div className="bg-stone-900 rounded-xl p-3.5 border border-stone-950 space-y-3 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full block" />
            <div>
              <div className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">
                Status IoT Online
              </div>
              <h2 className="text-xs font-bold text-white leading-tight">
                {iotBin.binName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-stone-300 bg-stone-800 border border-stone-700 px-2 py-1 rounded-md font-mono">
            <span>Sinyal: 98%</span>
            <span className="text-stone-600">•</span>
            <span>{iotBin.temperatureC}°C</span>
          </div>
        </div>

        {/* 4 Kompartemen Tong Sampah */}
        <div className="grid grid-cols-4 gap-1.5 pt-0.5">
          {(['organik', 'plastik', 'kertas', 'logam_b3'] as WasteCategory[]).map((cat) => {
            const comp = iotBin.compartments[cat];
            const catInfo = WASTE_CATEGORIES[cat];
            const isFull = comp.fillPercent >= 90;

            return (
              <div
                key={cat}
                className="bg-stone-800/90 rounded-lg p-2 border border-stone-700 flex flex-col items-center text-center relative"
              >
                {comp.isOpen && (
                  <div className="absolute top-0 inset-x-0 bg-emerald-500 text-stone-950 text-[8px] font-bold py-0.5 rounded-t-lg">
                    TERBUKA
                  </div>
                )}

                <span className="text-base mt-1">{catInfo.icon}</span>
                <span className="text-[10px] font-medium text-stone-200 mt-0.5 truncate w-full">
                  {catInfo.name.split(' ')[0]}
                </span>

                {/* Progress bar vertical */}
                <div className="w-full bg-stone-950/80 border border-stone-700/60 h-9 rounded my-1.5 p-0.5 flex flex-col justify-end">
                  <div
                    className="w-full rounded-xs transition-all duration-500 flex items-center justify-center text-[8px] font-mono font-medium text-white"
                    style={{
                      height: `${comp.fillPercent}%`,
                      backgroundColor: comp.color,
                    }}
                  >
                    {comp.fillPercent > 25 && `${comp.fillPercent}%`}
                  </div>
                </div>

                <span className="text-[9px] text-stone-400 font-mono">
                  {comp.currentKg}/{comp.maxKg}kg
                </span>

                {/* Status indicator */}
                {isFull ? (
                  <button
                    onClick={() => handleEmptyBin(cat)}
                    className="mt-1 text-[8px] bg-rose-700 hover:bg-rose-600 text-white font-medium px-1.5 py-0.5 rounded"
                    title="Kosongkan Tong"
                  >
                    Kuras
                  </button>
                ) : (
                  <span className="text-[8px] text-stone-400 font-mono font-medium mt-0.5">
                    {comp.fillPercent}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulator: Pilih Sampah & Masukkan ke Tong */}
      <div className="bg-white rounded-xl p-3.5 border border-stone-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Radio size={15} className="text-stone-700" />
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
              Simulasi Setor Sampah
            </h3>
          </div>
          <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded font-mono">
            RFID: {currentStudent.rfidCode.split('-')[2]}
          </span>
        </div>

        {/* 1. Item Selection Grid */}
        <div>
          <label className="text-[11px] font-medium text-stone-700 mb-1.5 block">
            1. Pilih Jenis Sampah:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {WASTE_ITEMS.map((item) => {
              const isSelected = selectedItem.id === item.id;

              return (
                <button
                  key={item.id}
                  id={`select-waste-${item.id}`}
                  disabled={isSimulating}
                  onClick={() => handleSelectItem(item)}
                  className={`p-2 rounded-lg border text-left transition-colors ${
                    isSelected
                      ? 'bg-stone-100 border-stone-900 text-stone-900'
                      : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-[9px] font-mono text-stone-500">
                      {item.category.split('_')[0]}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-stone-900 mt-1 truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    +{item.points} pts • {item.defaultWeightKg} kg
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Amount Stepper & Weight Calculation */}
        <div className="bg-stone-50 rounded-lg p-3 border border-stone-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale size={15} className="text-stone-600" />
              <div>
                <div className="text-xs font-semibold text-stone-900">
                  {selectedItem.name}
                </div>
                <div className="text-[10px] text-stone-500">
                  Kategori: {WASTE_CATEGORIES[selectedItem.category].name}
                </div>
              </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-stone-200">
              <button
                disabled={itemCount <= 1 || isSimulating}
                onClick={() => {
                  setItemCount((prev) => Math.max(1, prev - 1));
                }}
                className="w-5 h-5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium flex items-center justify-center text-xs disabled:opacity-40"
              >
                -
              </button>
              <span className="text-xs font-semibold text-stone-800 min-w-[20px] text-center font-mono">
                {itemCount}
              </span>
              <button
                disabled={itemCount >= 10 || isSimulating}
                onClick={() => {
                  setItemCount((prev) => Math.min(10, prev + 1));
                }}
                className="w-5 h-5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium flex items-center justify-center text-xs disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          {/* Real-time Calculation metrics */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200 text-center">
            <div className="bg-white p-1.5 rounded border border-stone-200">
              <div className="text-[9px] text-stone-400 font-medium">Total Berat</div>
              <div className="text-xs font-semibold text-stone-800 font-mono">
                {calculateTotalWeight()} kg
              </div>
            </div>
            <div className="bg-white p-1.5 rounded border border-stone-200">
              <div className="text-[9px] text-stone-400 font-medium">Nilai Saldo</div>
              <div className="text-xs font-semibold text-emerald-800">
                Rp {calculateRewardRp().toLocaleString('id-ID')}
              </div>
            </div>
            <div className="bg-white p-1.5 rounded border border-stone-200">
              <div className="text-[9px] text-stone-400 font-medium">Poin Kelas</div>
              <div className="text-xs font-semibold text-stone-800 font-mono">
                +{calculateEarnedPoints()} pts
              </div>
            </div>
          </div>
        </div>

        {/* 3. Education Note */}
        <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-600">
          <span className="font-semibold text-stone-800">Catatan Lingkungan: </span>
          {selectedItem.funFact}
        </div>

        {/* 4. Action Button with IoT simulation stages */}
        <div>
          <button
            id="btn-trigger-iot-disposal"
            disabled={isSimulating}
            onClick={handleStartDisposal}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-colors ${
              isSimulating
                ? 'bg-stone-700 text-white'
                : 'bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white'
            }`}
          >
            {activeStep === 'idle' && (
              <>
                <Zap size={14} />
                <span>Dekatkan Sampah & Buka Tutup Tong</span>
              </>
            )}
            {activeStep === 'scanning_rfid' && (
              <>
                <QrCode size={14} className="animate-spin" />
                <span>Memindai RFID Siswa ({currentStudent.name})...</span>
              </>
            )}
            {activeStep === 'sensor_detecting' && (
              <>
                <Cpu size={14} />
                <span>Sensor Mengidentifikasi: {selectedItem.name}...</span>
              </>
            )}
            {activeStep === 'lid_opening' && (
              <>
                <Layers size={14} />
                <span>
                  Tutup Tong {WASTE_CATEGORIES[selectedItem.category].name} Terbuka...
                </span>
              </>
            )}
            {activeStep === 'success' && (
              <>
                <CheckCircle2 size={14} />
                <span>Sampah Berhasil Ditimbang & Disortir!</span>
              </>
            )}
          </button>
        </div>

        {/* Last Reward Banner if success */}
        {lastRewardInfo && activeStep === 'success' && (
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-300 text-stone-900 flex items-center justify-between animate-in fade-in duration-150">
            <div>
              <div className="text-xs font-bold text-emerald-900">
                +Rp {lastRewardInfo.rp.toLocaleString('id-ID')} & +{lastRewardInfo.points} Poin Diterima!
              </div>
              <div className="text-[11px] text-stone-600 mt-0.5">
                {lastRewardInfo.itemName} ({lastRewardInfo.weight} kg) telah dicatat ke saldo tabungan.
              </div>
            </div>
            <button
              onClick={() => setActiveStep('idle')}
              className="text-[11px] font-medium bg-emerald-800 text-white px-2.5 py-1 rounded hover:bg-emerald-900"
            >
              Selesai
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
