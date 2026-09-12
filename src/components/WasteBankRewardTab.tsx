import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  PlusCircle,
  Clock,
  Sparkles,
  Receipt,
  Calculator,
  ChevronRight,
  Gift,
} from 'lucide-react';
import { BankTransaction, SchoolClass, Student, WasteCategory } from '../types';
import { WASTE_CATEGORIES, WITHDRAWAL_DESTINATIONS } from '../data/initialData';

interface WasteBankRewardTabProps {
  currentStudent: Student;
  currentClass?: SchoolClass;
  transactions: BankTransaction[];
  onOpenWithdrawModal: () => void;
  onViewReceipt: (trx: BankTransaction) => void;
}

export const WasteBankRewardTab: React.FC<WasteBankRewardTabProps> = ({
  currentStudent,
  currentClass,
  transactions,
  onOpenWithdrawModal,
  onViewReceipt,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdrawal'>('all');

  // Interactive Waste Calculator state
  const [calcCategory, setCalcCategory] = useState<WasteCategory>('plastik');
  const [calcQuantity, setCalcQuantity] = useState<number>(10); // e.g. 10 bottles
  const [calcUnit, setCalcUnit] = useState<'item' | 'kg'>('item');

  const classTransactions = transactions.filter(
    (t) => (t.classId && t.classId === currentClass?.id) || t.studentId === currentStudent.id
  );

  const filteredTransactions = classTransactions.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  // Calculate earnings in interactive calculator
  const calculateEstimate = () => {
    const cat = WASTE_CATEGORIES[calcCategory];
    if (calcUnit === 'kg') {
      return Math.round(calcQuantity * cat.pricePerKg);
    } else {
      // 1 item roughly 0.05kg for plastic bottle, 0.15kg for paper, 0.06kg for can, 0.1kg for organic
      const approxWeights: Record<WasteCategory, number> = {
        plastik: 0.05,
        kertas: 0.15,
        logam_b3: 0.06,
        organik: 0.1,
      };
      const totalKg = calcQuantity * approxWeights[calcCategory];
      return Math.round(totalKg * cat.pricePerKg);
    }
  };

  return (
      <div className="w-full space-y-3 pb-20 pt-1 md:px-4">
      {/* Saldo Kas Kelas Card */}
      <div className="bg-emerald-900 text-white rounded-xl p-4 border border-emerald-950 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-medium text-emerald-200">
            <Wallet size={14} className="text-emerald-300" />
            <span>Kas Bersama {currentClass?.name || currentStudent.className}</span>
          </div>
          <span className="bg-emerald-800/80 px-2 py-0.5 rounded text-[11px] text-emerald-100 font-mono">
            Wali Kelas: {currentClass?.waliKelas?.split(',')[0] || 'Guru'}
          </span>
        </div>

        <div>
          <div className="text-[11px] text-emerald-300 font-medium">Saldo Kas Bersama Kelas</div>
          <div className="text-2xl font-bold font-mono text-white mt-0.5">
            Rp {(currentClass?.balanceRp ?? currentStudent.balanceRp).toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-emerald-200/80 mt-1">
            Akumulasi hasil setor sampah seluruh siswa {currentClass?.name?.split(' - ')[0] || currentStudent.className}.
          </p>
        </div>

        <div className="pt-3 border-t border-emerald-800/80 flex items-center justify-between">
          <div className="text-xs text-emerald-200">
            <span className="font-semibold text-white block">Perwakilan Siswa: {currentStudent.name}</span>
            <span className="text-[11px] text-emerald-300 font-mono">
              Kontribusi Kamu: {currentStudent.totalKg} kg • {currentStudent.points} pts
            </span>
          </div>

          <button
            id="btn-withdraw-main"
            onClick={() => {
              onOpenWithdrawModal();
            }}
            className="bg-white hover:bg-emerald-50 text-emerald-950 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Pencairan Kas</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* Saldo Bisa Dipakai untuk Apa Saja? */}
      <div className="bg-white rounded-xl p-3.5 border border-stone-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-stone-900">
              Saldo Bisa Dipakai untuk Apa Saja?
            </h3>
            <p className="text-[11px] text-stone-500">
              Minta izin ke Wali Kelas (pemegang kas) untuk mencairkan saldo bagi keperluan:
            </p>
          </div>
          <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-200 font-semibold px-2 py-0.5 rounded-full shrink-0">
            Izin Wali Kelas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
          {WITHDRAWAL_DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onOpenWithdrawModal()}
              className="p-2.5 rounded-lg border border-stone-200 bg-stone-50/50 hover:bg-emerald-50/40 hover:border-emerald-300 cursor-pointer transition-all flex items-start gap-2.5"
            >
              <span className="text-xl shrink-0 mt-0.5">{dest.icon}</span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-stone-900 leading-tight">
                  {dest.name}
                </div>
                <div className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                  {dest.description}
                </div>
                <div className="text-[10px] text-emerald-700 font-medium mt-1">
                  Min. penarikan: Rp {dest.minAmount.toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kalkulator Simulasi Tabungan Sampah */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Calculator size={15} className="text-stone-600" />
            <h3 className="text-xs font-semibold text-stone-900">
              Kalkulator Taksiran Sampah
            </h3>
          </div>
          <span className="text-[10px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded font-medium">
            Simulasi
          </span>
        </div>

        <p className="text-xs text-stone-600">
          Hitung perkiraan saldo yang didapat saat menyetorkan sampah ke IoT tong pintar.
        </p>

        {/* Category buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {(['plastik', 'kertas', 'logam_b3', 'organik'] as WasteCategory[]).map((catKey) => {
            const isSel = calcCategory === catKey;
            const cat = WASTE_CATEGORIES[catKey];
            return (
              <button
                key={catKey}
                onClick={() => {
                  setCalcCategory(catKey);
                }}
                className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 whitespace-nowrap transition-colors ${
                  isSel
                    ? 'bg-stone-900 text-white font-medium'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Stepper amount */}
        <div className="flex items-center justify-between bg-stone-50 p-3 rounded-lg border border-stone-200">
          <div>
            <div className="text-[10px] text-stone-500 font-medium">Jumlah Sampah</div>
            <div className="text-xs font-semibold text-stone-900">
              {calcQuantity} {calcUnit === 'item' ? 'Buah / Kemasan' : 'Kilogram'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCalcQuantity((prev) => Math.max(1, prev - 5));
              }}
              className="w-7 h-7 rounded bg-white border border-stone-300 text-stone-800 font-medium flex items-center justify-center hover:bg-stone-100"
            >
              -
            </button>
            <span className="text-xs font-mono font-semibold text-stone-900 min-w-[28px] text-center">
              {calcQuantity}
            </span>
            <button
              onClick={() => {
                setCalcQuantity((prev) => prev + 5);
              }}
              className="w-7 h-7 rounded bg-stone-900 text-white font-medium flex items-center justify-center hover:bg-stone-800"
            >
              +
            </button>
          </div>
        </div>

        {/* Estimated reward banner */}
        <div className="p-3 bg-stone-100 rounded-lg border border-stone-200 text-stone-900 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-stone-500 font-medium">Estimasi Saldo Bank Sampah</div>
            <div className="text-base font-bold font-mono text-stone-900">
              Rp {calculateEstimate().toLocaleString('id-ID')}
            </div>
          </div>
          <span className="text-xl">💰</span>
        </div>
      </div>

      {/* Riwayat Mutasi Setor & Tarik Saldo */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock size={15} className="text-stone-600" />
            <h3 className="text-xs font-semibold text-stone-900">
              Riwayat Mutasi Saldo
            </h3>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 text-[10px] bg-stone-100 p-0.5 rounded border border-stone-200">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                filterType === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType('deposit')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                filterType === 'deposit' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setFilterType('withdrawal')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                filterType === 'withdrawal' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              Tarik
            </button>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-6 text-stone-400 text-xs">
            Belum ada catatan mutasi transaksi
          </div>
        ) : (
          <div className="space-y-1.5">
            {filteredTransactions.map((trx) => {
              const isDeposit = trx.type === 'deposit';

              return (
                <div
                  key={trx.id}
                  onClick={() => {
                    onViewReceipt(trx);
                  }}
                  className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded flex items-center justify-center font-bold ${
                        isDeposit
                          ? 'bg-stone-100 text-stone-700'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {isDeposit ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-stone-900 leading-tight flex items-center gap-1.5 flex-wrap">
                        <span>
                          {isDeposit
                            ? `${trx.studentName}: ${trx.wasteItemName || 'Setor Sampah'}`
                            : trx.description}
                        </span>
                        {trx.status === 'diproses' && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-medium px-1.5 py-0.2 rounded border border-amber-200">
                            Menunggu Izin
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5 font-mono">
                        {trx.timestamp} • {trx.referenceCode}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-xs font-semibold text-stone-900">
                      {isDeposit ? '+' : '-'}Rp {trx.amountRp.toLocaleString('id-ID')}
                    </div>
                    {trx.pointsEarned && (
                      <div className="text-[10px] text-stone-500">
                        +{trx.pointsEarned} pts
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
