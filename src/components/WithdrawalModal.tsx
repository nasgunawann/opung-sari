import React, { useState } from 'react';
import {
  X,
  Wallet,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { BankTransaction, Student, WithdrawalDestination } from '../types';
import { WITHDRAWAL_DESTINATIONS } from '../data/initialData';
import confetti from 'canvas-confetti';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: Student;
  onConfirmWithdrawal: (transaction: BankTransaction) => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  onConfirmWithdrawal,
}) => {
  const [selectedDest, setSelectedDest] = useState<WithdrawalDestination>(
    WITHDRAWAL_DESTINATIONS[0]
  );
  const [amount, setAmount] = useState<number>(10000);
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const quickAmounts = [5000, 10000, 15000, 20000, 30000];

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (amount < selectedDest.minAmount) {
      setErrorMsg(`Minimal penarikan untuk ${selectedDest.name} adalah Rp ${selectedDest.minAmount.toLocaleString('id-ID')}`);
      return;
    }

    if (amount > currentStudent.balanceRp) {
      setErrorMsg('Saldo tabungan bank sampah tidak mencukupi!');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

      const newTrx: BankTransaction = {
        id: `trx-${Date.now()}`,
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        type: 'withdrawal',
        amountRp: amount,
        description: `Penarikan Reward ke ${selectedDest.name}`,
        timestamp: `Hari ini, ${timeStr}`,
        method: selectedDest.name,
        targetAccount: accountNumber || selectedDest.name,
        referenceCode: `WDR-${Date.now().toString().slice(-6)}`,
        status: 'berhasil',
      };

      onConfirmWithdrawal(newTrx);
      setIsProcessing(false);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#F59E0B', '#60A5FA'],
      });

      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm rounded-xl border border-stone-200 p-4 space-y-3 relative shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center">
              <Wallet size={15} />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-stone-900">Tarik Saldo Bank Sampah</h3>
              <p className="text-[10px] text-stone-500">
                Pencairan reward pemilahan sampah
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
            }}
            className="p-1 text-stone-400 hover:text-stone-600 rounded"
          >
            <X size={16} />
          </button>
        </div>

        {/* Current Balance Reminder - Flat Solid Emerald Anchor */}
        <div className="p-2.5 bg-emerald-900 text-white rounded-lg border border-emerald-950 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-emerald-300 font-medium">Saldo Tersedia</div>
            <div className="text-sm font-bold font-mono text-white">
              Rp {currentStudent.balanceRp.toLocaleString('id-ID')}
            </div>
          </div>
          <span className="text-[10px] bg-emerald-800 text-emerald-100 px-2 py-0.5 rounded font-medium">
            {currentStudent.nickname} ({currentStudent.className})
          </span>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-3">
          {/* Destination Selection */}
          <div>
            <label className="text-xs font-medium text-stone-700 mb-1.5 block">
              1. Pilih Tujuan Penarikan:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {WITHDRAWAL_DESTINATIONS.map((dest) => {
                const isSelected = selectedDest.id === dest.id;
                return (
                  <button
                    key={dest.id}
                    type="button"
                    onClick={() => {
                      setSelectedDest(dest);
                      if (amount < dest.minAmount) {
                        setAmount(dest.minAmount);
                      }
                    }}
                    className={`p-2 rounded-lg border text-left transition-colors ${
                      isSelected
                        ? 'bg-stone-100 border-stone-800 text-stone-900'
                        : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg">{dest.icon}</span>
                      <span className="text-[9px] bg-stone-100 text-stone-700 font-mono px-1 py-0.2 rounded">
                        Min {dest.minAmount / 1000}k
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-stone-900 line-clamp-1">
                      {dest.name}
                    </div>
                    <div className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">
                      {dest.badge}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Selection */}
          <div>
            <label className="text-xs font-medium text-stone-700 mb-1 block">
              2. Nominal Penarikan:
            </label>

            {/* Quick chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setAmount(q);
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap transition-colors ${
                    amount === q
                      ? 'bg-stone-900 text-white font-medium'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Rp {q.toLocaleString('id-ID')}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="relative mt-1">
              <span className="absolute left-2.5 top-2 text-xs font-mono text-stone-400">
                Rp
              </span>
              <input
                type="number"
                min={selectedDest.minAmount}
                max={currentStudent.balanceRp}
                step="1000"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono font-medium text-stone-900 focus:outline-none focus:border-stone-400"
                placeholder="Masukkan nominal"
                required
              />
            </div>
          </div>

          {/* Extra input if ewallet / tabungan */}
          {selectedDest.category === 'ewallet' && (
            <div>
              <label className="text-[10px] font-medium text-stone-600 mb-1 block">
                No. HP / Akun E-Wallet Orang Tua:
              </label>
              <input
                type="text"
                placeholder="Contoh: 0812-3456-7890 (Ibu)"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                required
              />
            </div>
          )}

          {errorMsg && (
            <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-1.5 text-[10px] text-rose-700">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || currentStudent.balanceRp < selectedDest.minAmount}
            className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
          >
            {isProcessing ? (
              <span>Memproses Penarikan...</span>
            ) : (
              <>
                <span>Cairkan Rp {amount.toLocaleString('id-ID')}</span>
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
