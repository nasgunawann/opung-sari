import React, { useState } from 'react';
import {
  Wallet,
  ArrowRight,
  AlertCircle,
  Check,
} from 'lucide-react';
import { BankTransaction, Student, WithdrawalDestination } from '../types';
import { WITHDRAWAL_DESTINATIONS } from '../data/initialData';
import confetti from 'canvas-confetti';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md w-full max-w-[calc(100vw-2rem)] p-4 sm:p-5 bg-white rounded-2xl gap-0 max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden min-w-0">
        <DialogHeader className="flex flex-row items-center gap-2.5 pb-3 mb-3 border-b pr-8 w-full min-w-0">
          <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center shrink-0">
            <Wallet size={16} />
          </div>
          <div className="flex flex-col items-start gap-0.5 min-w-0">
            <DialogTitle className="text-sm font-bold text-stone-900 truncate max-w-full">
              Tarik Saldo Bank Sampah
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500 truncate max-w-full">
              Pencairan reward pemilahan sampah
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Current Balance Reminder */}
        <div className="p-3 mb-4 bg-emerald-900 text-white rounded-xl border border-emerald-950 flex items-center justify-between gap-2 w-full min-w-0">
          <div className="min-w-0">
            <div className="text-[10px] text-emerald-300 font-medium">Saldo Tersedia</div>
            <div className="text-base font-bold font-mono text-white truncate">
              Rp {currentStudent.balanceRp.toLocaleString('id-ID')}
            </div>
          </div>
          <span className="text-[10px] bg-emerald-800 text-emerald-100 px-2 py-1 rounded-md font-medium shrink-0">
            {currentStudent.nickname}
          </span>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-4 w-full min-w-0">
          {/* Destination Selection */}
          <div className="space-y-1.5 w-full min-w-0">
            <Label className="text-xs font-bold text-stone-700">1. Pilih Tujuan Penarikan:</Label>
            <div className="space-y-1.5 w-full min-w-0">
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
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 min-w-0 cursor-pointer active:scale-[0.99] ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-600 text-emerald-950 ring-1.5 ring-emerald-500/30 shadow-xs'
                        : 'bg-white border-stone-200 hover:bg-stone-50 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-stone-100/90 border border-stone-200/70 flex items-center justify-center text-lg shrink-0">
                        {dest.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold leading-tight truncate">
                          {dest.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                          <span className={`font-semibold truncate ${isSelected ? 'text-emerald-700' : 'text-stone-500'}`}>
                            {dest.badge || 'Bebas biaya'}
                          </span>
                          <span className="text-stone-300">•</span>
                          <span className="font-mono text-stone-500 font-medium shrink-0">
                            Min Rp {dest.minAmount.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300 bg-white text-transparent'
                    }`}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Selection */}
          <div className="space-y-2 w-full min-w-0">
            <Label className="text-xs font-semibold">2. Nominal Penarikan:</Label>
            
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 w-full min-w-0">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(q)}
                  className={`w-full py-1.5 px-1 rounded-lg text-[11px] font-mono text-center transition-colors truncate ${
                    amount === q
                      ? 'bg-stone-900 text-white font-bold shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 font-medium'
                  }`}
                >
                  Rp {q.toLocaleString('id-ID')}
                </button>
              ))}
            </div>

            <div className="relative w-full min-w-0">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-stone-500">
                Rp
              </span>
              <Input
                type="number"
                min={selectedDest.minAmount}
                max={currentStudent.balanceRp}
                step="1000"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="pl-9 font-mono text-sm h-10 rounded-xl"
                placeholder="Masukkan nominal"
                required
              />
            </div>
          </div>

          {selectedDest.category === 'ewallet' && (
            <div className="space-y-1.5 w-full min-w-0">
              <Label className="text-[11px] font-medium">No. HP / Akun E-Wallet:</Label>
              <Input
                type="text"
                placeholder="0812-3456-7890"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="text-sm h-10 rounded-xl"
                required
              />
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 w-full min-w-0">
              <AlertCircle size={14} className="shrink-0" />
              <span className="truncate">{errorMsg}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isProcessing || currentStudent.balanceRp < selectedDest.minAmount}
            className="w-full h-11 rounded-xl font-bold text-sm cursor-pointer shadow-sm"
          >
            {isProcessing ? (
              <span>Memproses...</span>
            ) : (
              <>
                <span>Cairkan Rp {amount.toLocaleString('id-ID')}</span>
                <ArrowRight size={14} className="ml-2" />
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
