import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  Receipt,
  Calculator,
  Gift,
  Scale,
  Coins,
  FileText,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { BankTransaction, SchoolClass, Student, WasteCategory } from '../types';
import { WASTE_CATEGORIES, WITHDRAWAL_DESTINATIONS } from '../data/initialData';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

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
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false);

  // Interactive Waste Calculator state
  const [calcCategory, setCalcCategory] = useState<WasteCategory>('plastik');
  const [calcQuantity, setCalcQuantity] = useState<number>(10);
  const [calcUnit, setCalcUnit] = useState<'item' | 'kg'>('item');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const classTransactions = transactions.filter(
    (t) => (t.classId && t.classId === currentClass?.id) || t.studentId === currentStudent.id
  );

  const filteredTransactions = classTransactions.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  const totalIncome = classTransactions
    .filter((t) => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amountRp, 0);

  const totalExpense = classTransactions
    .filter((t) => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amountRp, 0);

  // Calculate earnings in interactive calculator
  const calculateEstimate = () => {
    const cat = WASTE_CATEGORIES[calcCategory];
    if (calcUnit === 'kg') {
      return Math.round(calcQuantity * cat.pricePerKg);
    } else {
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
    <div className="w-full min-w-0 max-w-4xl mx-auto space-y-4 pb-24 pt-1 md:px-2">
      {/* SECTION 0: Hero Fintech Wallet Card (Buku Kas Bersama) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-md p-4 sm:p-5">
        {/* Subtle background ambient glows */}
        <div className="pointer-events-none absolute -right-6 -top-6 w-36 h-36 rounded-full bg-white/10 blur-xl" />
        <div className="pointer-events-none absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-emerald-400/15 blur-lg" />

        {/* Top Bar: Class identity & Wali Kelas */}
        <div className="relative flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/25 shadow-inner">
                🏦
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <h2 className="text-sm sm:text-base font-extrabold text-white truncate tracking-tight">
                  Kas Bersama {currentClass?.name?.split(' - ')[0] || currentStudent?.className}
                </h2>
              </div>
              <p className="text-xs text-emerald-100/85 font-medium truncate">
                Wali Kelas: {currentClass?.waliKelas || 'Guru Pembina'}
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center text-[10px] font-semibold bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-emerald-100">
            Buku Kas Kelas
          </span>
        </div>

        {/* Middle: Saldo Display */}
        <div className="relative mt-4">
          <div className="flex items-center gap-1.5 text-emerald-100/90 text-[11px] font-bold uppercase tracking-wider">
            <Wallet size={13} className="opacity-90" />
            <span>Saldo Kas Kelas Terkumpul</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
            {formatCurrency(currentClass?.balanceRp ?? currentStudent?.balanceRp ?? 0)}
          </div>
          <p className="text-[11px] text-emerald-100/80 mt-0.5">
            Akumulasi hasil pemilahan sampah siswa {currentClass?.name?.split(' - ')[0] || currentStudent.className}.
          </p>
        </div>

        {/* Mini Ledger Quick Stats */}
        <div className="relative mt-3.5 grid grid-cols-2 gap-2">
          <div className="bg-black/15 backdrop-blur-md rounded-2xl p-2.5 border border-white/10">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-200">
              <TrendingUp size={12} className="text-emerald-300" />
              <span>Total Pemasukan</span>
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-white mt-0.5">
              +{formatCurrency(totalIncome)}
            </div>
          </div>

          <div className="bg-black/15 backdrop-blur-md rounded-2xl p-2.5 border border-white/10">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-200">
              <TrendingDown size={12} className="text-amber-300" />
              <span>Total Dicairkan</span>
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-white mt-0.5">
              -{formatCurrency(totalExpense)}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Personal Contribution & Tarik Button */}
        <div className="relative mt-4 pt-3 border-t border-white/15 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="inline-flex items-center gap-1 bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-xs font-bold text-white">
              <Coins size={13} className="text-amber-300" />
              <span>{currentStudent.points} <span className="text-emerald-200 text-[10px] font-semibold">poin</span></span>
            </div>
            <div className="inline-flex items-center gap-1 bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-xs font-bold text-white">
              <Scale size={13} className="text-emerald-200" />
              <span>{currentStudent.totalKg} <span className="text-emerald-200 text-[10px] font-semibold">kg</span></span>
            </div>
          </div>

          <button
            id="btn-withdraw-main"
            onClick={onOpenWithdrawModal}
            className="flex items-center gap-1.5 bg-white hover:bg-emerald-50 active:scale-95 text-emerald-950 font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
          >
            <ArrowUpRight size={14} className="text-emerald-700" />
            <span>Ajukan Pencairan</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Accordion Rekomendasi Peruntukan Kas Kelas */}
      <section>
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => setIsDestinationsOpen((prev) => !prev)}
            className="w-full p-3 flex items-center justify-between gap-3 text-left hover:bg-muted/40 transition-colors cursor-pointer select-none"
            aria-expanded={isDestinationsOpen}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Gift size={16} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs sm:text-sm font-bold text-foreground truncate">
                    Pencairan Kas ke Mana Saja?
                  </h2>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full shrink-0">
                    4 Pilihan
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  Panduan peruntukan kas kelas & batas minimum penarikan
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
              <span className="text-[11px] font-semibold hidden sm:inline text-primary">
                {isDestinationsOpen ? 'Tutup' : 'Lihat'}
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isDestinationsOpen ? 'rotate-180 text-foreground' : ''
                }`}
              />
            </div>
          </button>

          {isDestinationsOpen && (
            <div className="p-3 pt-1 border-t border-border/60 bg-muted/10 space-y-2.5 animate-in fade-in-50 duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {WITHDRAWAL_DESTINATIONS.map((dest) => {
                  const getCardStyle = (id: string) => {
                    switch (id) {
                      case 'kebersihan':
                        return 'bg-emerald-50/60 border-emerald-200/80 hover:border-emerald-400 hover:bg-emerald-50';
                      case 'tanaman':
                        return 'bg-teal-50/60 border-teal-200/80 hover:border-teal-400 hover:bg-teal-50';
                      case 'kantin':
                        return 'bg-amber-50/60 border-amber-200/80 hover:border-amber-400 hover:bg-amber-50';
                      default:
                        return 'bg-blue-50/60 border-blue-200/80 hover:border-blue-400 hover:bg-blue-50';
                    }
                  };

                  return (
                    <div
                      key={dest.id}
                      onClick={onOpenWithdrawModal}
                      className={`p-2.5 rounded-xl border ${getCardStyle(
                        dest.id
                      )} cursor-pointer transition-all active:scale-[0.99] flex items-start gap-2.5`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-white shadow-xs border border-border/80 flex items-center justify-center text-base shrink-0">
                        {dest.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="text-xs font-bold text-foreground truncate">
                            {dest.name}
                          </h3>
                          <span className="text-[9px] font-bold text-emerald-900 bg-white/90 border border-emerald-200/80 px-1.5 py-0.2 rounded shrink-0">
                            Min. Rp {dest.minAmount.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-tight">
                          {dest.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-1">
                <Button
                  type="button"
                  onClick={onOpenWithdrawModal}
                  size="sm"
                  className="w-full font-bold text-xs gap-1.5 cursor-pointer"
                >
                  <ArrowUpRight className="size-4" />
                  <span>Ajukan Pencairan Kas Kelas</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: Buku Besar Mutasi Saldo Kas (PRD FR-BS-03) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Receipt size={18} className="text-primary" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
              Arus Kas
            </h2>
          </div>
        </div>

        <Card className="border-border">
          <CardContent className="p-3.5 space-y-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border">
              <button
                onClick={() => setFilterType('all')}
                className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                  filterType === 'all'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterType('deposit')}
                className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                  filterType === 'deposit'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Setoran Masuk
              </button>
              <button
                onClick={() => setFilterType('withdrawal')}
                className={`flex-1 py-1 text-xs font-bold rounded-lg transition-all ${
                  filterType === 'withdrawal'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Pencairan Kas
              </button>
            </div>

            {/* List */}
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-xs">
                Belum ada catatan mutasi transaksi pada filter ini.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTransactions.map((trx) => {
                  const isDeposit = trx.type === 'deposit';

                  return (
                    <div
                      key={trx.id}
                      onClick={() => onViewReceipt(trx)}
                      className="p-2.5 sm:p-3 rounded-2xl border border-border hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer flex items-center justify-between gap-2.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isDeposit
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isDeposit ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-foreground truncate flex items-center gap-1.5">
                            <span className="truncate">
                              {isDeposit
                                ? (trx.wasteItemName || 'Setor Sampah')
                                : trx.description}
                            </span>
                            {trx.status === 'diproses' && (
                              <span className="inline-flex items-center gap-1 text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-full border border-amber-200 shrink-0">
                                <Clock size={9} /> Izin
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5 truncate flex items-center gap-1.5">
                            <span>{trx.timestamp}</span>
                            <span>•</span>
                            <span className="truncate">
                              {isDeposit ? trx.studentName.split(' ')[0] : 'Kas Kelas'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={`text-xs sm:text-sm font-extrabold ${
                            isDeposit ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {isDeposit ? '+' : '-'}Rp {trx.amountRp.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
