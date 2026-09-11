import React, { useState } from 'react';
import {
  Wallet,
  ArrowRight,
  AlertCircle,
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
      <DialogContent className="sm:max-w-md w-[95%] p-4 bg-white rounded-xl gap-0">
        <DialogHeader className="flex flex-row items-center gap-2 pb-3 mb-3 border-b">
          <div className="w-8 h-8 rounded-md bg-stone-100 border border-stone-200 text-stone-700 flex items-center justify-center shrink-0">
            <Wallet size={16} />
          </div>
          <div className="flex flex-col items-start gap-0.5">
            <DialogTitle className="text-sm font-semibold">Tarik Saldo Bank Sampah</DialogTitle>
            <DialogDescription className="text-xs">
              Pencairan reward pemilahan sampah
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Current Balance Reminder */}
        <div className="p-3 mb-4 bg-emerald-900 text-white rounded-lg border border-emerald-950 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-emerald-300 font-medium">Saldo Tersedia</div>
            <div className="text-base font-bold font-mono text-white">
              Rp {currentStudent.balanceRp.toLocaleString('id-ID')}
            </div>
          </div>
          <span className="text-[10px] bg-emerald-800 text-emerald-100 px-2 py-1 rounded-md font-medium">
            {currentStudent.nickname}
          </span>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-4">
          {/* Destination Selection */}
          <div className="space-y-2">
            <Label className="text-xs">1. Pilih Tujuan Penarikan:</Label>
            <div className="grid grid-cols-2 gap-2">
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
                    className={`p-2.5 rounded-lg border text-left transition-colors flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-stone-100 border-stone-800 text-stone-900'
                        : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-lg">{dest.icon}</span>
                      <span className="text-[9px] bg-stone-100 text-stone-700 font-mono px-1 py-0.5 rounded">
                        Min {dest.minAmount / 1000}k
                      </span>
                    </div>
                    <div className="text-xs font-semibold line-clamp-1">
                      {dest.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Selection */}
          <div className="space-y-2">
            <Label className="text-xs">2. Nominal Penarikan:</Label>
            
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(q)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-colors ${
                    amount === q
                      ? 'bg-stone-900 text-white font-medium'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Rp {q.toLocaleString('id-ID')}
                </button>
              ))}
            </div>

            <div className="relative">
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
                className="pl-9 font-mono text-sm"
                placeholder="Masukkan nominal"
                required
              />
            </div>
          </div>

          {selectedDest.category === 'ewallet' && (
            <div className="space-y-1.5">
              <Label className="text-[11px]">No. HP / Akun E-Wallet:</Label>
              <Input
                type="text"
                placeholder="0812-3456-7890"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="text-sm"
                required
              />
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isProcessing || currentStudent.balanceRp < selectedDest.minAmount}
            className="w-full font-medium"
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
