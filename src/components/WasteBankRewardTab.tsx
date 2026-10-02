import React, { useState } from 'react';
import {
  Wallet,
  Landmark,
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
import { DestinationIcon } from '../lib/appIcons';
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-active text-primary-foreground shadow-md p-4 sm:p-5">
        {/* Top Bar: Class identity & Wali Kelas */}
        <div className="relative flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary-active flex items-center justify-center border border-primary-foreground/25 shadow-inner">
                <Landmark size={24} className="text-primary-foreground" aria-hidden="true" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <h2 className="text-sm sm:text-base font-extrabold text-primary-foreground truncate tracking-tight">
                  Kas Bersama {currentClass?.name?.split(' - ')[0] || currentStudent?.className}
                </h2>
              </div>
              <p className="text-xs text-primary-foreground/85 font-medium truncate">
                Wali Kelas: {currentClass?.waliKelas || 'Guru Pembina'}
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center text-[10px] font-semibold bg-overlay/20 px-2.5 py-1 rounded-full border border-primary-foreground/20 text-primary-foreground/90">
            Buku Kas Kelas
          </span>
        </div>

        {/* Middle: Saldo Display */}
        <div className="relative mt-4">
          <div className="flex items-center gap-1.5 text-primary-foreground/90 text-[11px] font-bold tracking-wider">
            <Wallet size={13} className="opacity-90" aria-hidden="true" />
            <span>Saldo Kas Kelas Terkumpul</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-primary-foreground mt-1">
            {formatCurrency(currentClass?.balanceRp ?? currentStudent?.balanceRp ?? 0)}
          </div>
          <p className="text-[11px] text-primary-foreground/80 mt-0.5">
            Akumulasi hasil pemilahan sampah siswa {currentClass?.name?.split(' - ')[0] || currentStudent.className}.
          </p>
        </div>

        {/* Mini Ledger Quick Stats */}
        <div className="relative mt-3.5 grid grid-cols-2 gap-2">
          <div className="bg-overlay/20 rounded-2xl p-2.5 border border-primary-foreground/10">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-primary-foreground/90">
              <TrendingUp size={12} className="text-primary-foreground/80" aria-hidden="true" />
              <span>Total Pemasukan</span>
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-primary-foreground mt-0.5">
              +{formatCurrency(totalIncome)}
            </div>
          </div>

          <div className="bg-overlay/20 rounded-2xl p-2.5 border border-primary-foreground/10">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-primary-foreground/90">
              <TrendingDown size={12} className="text-primary-foreground/80" aria-hidden="true" />
              <span>Total Dicairkan</span>
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-primary-foreground mt-0.5">
              -{formatCurrency(totalExpense)}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Personal Contribution & Tarik Button */}
        <div className="relative mt-4 pt-3 border-t border-primary-foreground/15 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="inline-flex items-center gap-1 bg-overlay/20 px-2.5 py-1 rounded-full border border-primary-foreground/10 text-xs font-bold text-primary-foreground">
              <Coins size={13} className="text-primary-foreground/80" aria-hidden="true" />
              <span>{currentStudent.points} <span className="text-primary-foreground/80 text-[10px] font-semibold">poin</span></span>
            </div>
            <div className="inline-flex items-center gap-1 bg-overlay/20 px-2.5 py-1 rounded-full border border-primary-foreground/10 text-xs font-bold text-primary-foreground">
              <Scale size={13} className="text-primary-foreground/80" aria-hidden="true" />
              <span>{currentStudent.totalKg} <span className="text-primary-foreground/80 text-[10px] font-semibold">kg</span></span>
            </div>
          </div>

          <button
            id="btn-withdraw-main"
            type="button"
            onClick={onOpenWithdrawModal}
            className="flex items-center gap-1.5 bg-card hover:bg-secondary active:scale-95 text-primary font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowUpRight size={14} className="text-primary" aria-hidden="true" />
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
            className="w-full p-3 flex items-center justify-between gap-3 text-left hover:bg-muted/40 transition-colors cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-expanded={isDestinationsOpen}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Gift size={16} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-foreground truncate">
                    Pencairan Kas ke Mana Saja?
                  </h3>
                  <span className="text-[10px] font-semibold text-primary bg-secondary border border-border px-1.5 py-0.2 rounded-full shrink-0">
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
                aria-hidden="true"
              />
            </div>
          </button>

          {isDestinationsOpen && (
            <div className="p-3 pt-1 border-t border-border/60 bg-muted/10 space-y-2.5 animate-in fade-in-50 duration-150">
              <div className="grid grid-cols-2 gap-2 pt-1">
                {WITHDRAWAL_DESTINATIONS.map((dest) => {
                  const getCardStyle = (id: string) => {
                    switch (id) {
                      case 'kebersihan':
                        return 'bg-secondary/60 border-border hover:border-primary/50 hover:bg-secondary';
                      case 'tanaman':
                        return 'bg-accent/60 border-border hover:border-primary/50 hover:bg-accent';
                      case 'kantin':
                        return 'bg-muted/60 border-border hover:border-primary/50 hover:bg-muted';
                      default:
                        return 'bg-muted/60 border-border hover:border-primary/50 hover:bg-muted';
                    }
                  };

                  return (
                    <button
                      type="button"
                      key={dest.id}
                      onClick={onOpenWithdrawModal}
                      className={`p-2.5 rounded-xl border ${getCardStyle(
                        dest.id
                      )} cursor-pointer transition-all active:scale-[0.99] flex flex-col justify-between text-left w-full outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <div className="w-8 h-8 rounded-xl bg-card shadow-xs border border-border/80 flex items-center justify-center text-base shrink-0">
                            <DestinationIcon destinationId={dest.id} size={16} aria-hidden="true" />
                          </div>
                          <span className="text-[9px] font-bold text-foreground bg-card/90 border border-border/80 px-1.5 py-0.5 rounded shrink-0 truncate max-w-[110px] sm:max-w-none">
                            Min Rp {dest.minAmount.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-foreground truncate mt-1.5">
                          {dest.name}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-tight">
                          {dest.description}
                        </p>
                      </div>
                    </button>
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
                  <ArrowUpRight className="size-4" aria-hidden="true" />
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
            <Receipt size={18} className="text-primary" aria-hidden="true" />
            <h3 className="text-sm font-bold text-foreground tracking-wide">
              Arus Kas
            </h3>
          </div>
        </div>

        <Card className="border-border">
          <CardContent className="p-3.5 space-y-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`flex-1 h-10 inline-flex items-center justify-center text-xs font-bold rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  filterType === 'all'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setFilterType('deposit')}
                className={`flex-1 h-10 inline-flex items-center justify-center text-xs font-bold rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  filterType === 'deposit'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Setoran Masuk
              </button>
              <button
                type="button"
                onClick={() => setFilterType('withdrawal')}
                className={`flex-1 h-10 inline-flex items-center justify-center text-xs font-bold rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring ${
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
                    <button
                      type="button"
                      key={trx.id}
                      onClick={() => onViewReceipt(trx)}
                      className="w-full text-left p-2.5 sm:p-3 rounded-2xl border border-border hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer flex items-center justify-between gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isDeposit
                              ? 'bg-secondary text-primary'
                              : 'bg-destructive/10 text-destructive'
                          }`}
                        >
                          {isDeposit ? <ArrowDownRight size={18} aria-hidden="true" /> : <ArrowUpRight size={18} aria-hidden="true" />}
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
                                <Clock size={9} aria-hidden="true" /> Izin
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
                            isDeposit ? 'text-primary' : 'text-destructive'
                          }`}
                        >
                          {isDeposit ? '+' : '-'}Rp {trx.amountRp.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </button>
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
