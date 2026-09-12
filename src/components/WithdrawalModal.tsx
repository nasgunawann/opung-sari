import React, { useState } from 'react';
import {
  Wallet,
  ArrowRight,
  AlertCircle,
  Check,
  Info,
} from 'lucide-react';
import { BankTransaction, SchoolClass, Student, WithdrawalDestination } from '../types';
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
  currentClass?: SchoolClass;
  onConfirmWithdrawal: (transaction: BankTransaction) => void;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  currentClass,
  onConfirmWithdrawal,
}) => {
  const [selectedDest, setSelectedDest] = useState<WithdrawalDestination>(
    WITHDRAWAL_DESTINATIONS[0]
  );
  const [amount, setAmount] = useState<number>(10000);
  const [notes, setNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const quickAmounts = [5000, 10000, 15000, 20000, 30000];
  const availableBalance = currentClass?.balanceRp ?? currentStudent.balanceRp;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (amount < selectedDest.minAmount) {
      setErrorMsg(`Minimal penarikan untuk ${selectedDest.name} adalah Rp ${selectedDest.minAmount.toLocaleString('id-ID')}`);
      return;
    }

    if (amount > availableBalance) {
      setErrorMsg('Saldo kas kelas tidak mencukupi!');
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
        classId: currentClass?.id || currentStudent.classId,
        className: currentClass?.name || currentStudent.className,
        type: 'withdrawal',
        amountRp: amount,
        description: notes
          ? `Pengajuan Kas: ${notes} (${selectedDest.name})`
          : `Pencairan Kas Kelas untuk ${selectedDest.name}`,
        timestamp: `Hari ini, ${timeStr}`,
        method: selectedDest.name,
        targetAccount: `Wali Kelas ${currentClass?.waliKelas?.split(',')[0] || currentStudent.className}`,
        referenceCode: `WDR-${Date.now().toString().slice(-6)}`,
        status: 'diproses',
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
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md w-full max-w-[calc(100vw-2rem)] p-4 sm:p-5 bg-white rounded-2xl gap-0 max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden min-w-0">
        <DialogHeader className="flex flex-row items-center gap-2.5 pb-3 mb-3 border-b pr-8 w-full min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
            <Wallet size={16} />
          </div>
          <div className="flex flex-col items-start gap-0.5 min-w-0">
            <DialogTitle className="text-sm font-bold text-stone-900 truncate max-w-full">
              Pengajuan Pencairan Kas Kelas
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500 truncate max-w-full">
              Kas bersama {currentClass?.name?.split(' - ')[0] || currentStudent.className} & izin Wali Kelas
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Notice Wali Kelas / Kas Kelas */}
        <div className="p-2.5 mb-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-start gap-2">
          <Info size={15} className="text-amber-700 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-tight">
            <strong>Kas Bersama:</strong> Saldo ini milik kas kelas. Pengajuan akan tercatat dan wajib diverifikasi oleh <strong>Wali Kelas ({currentClass?.waliKelas || 'Pemegang Kas'})</strong> sebelum pencairan dana fisik.
          </div>
        </div>

        {/* Current Balance Reminder */}
        <div className="p-3 mb-4 bg-emerald-900 text-white rounded-xl border border-emerald-950 flex items-center justify-between gap-2 w-full min-w-0">
          <div className="min-w-0">
            <div className="text-[10px] text-emerald-300 font-medium">Saldo Kas Kelas Tersedia</div>
          <div className="text-base font-extrabold text-white truncate">
            Rp {availableBalance.toLocaleString('id-ID')}
          </div>
          </div>
          <span className="text-[10px] bg-emerald-800 text-emerald-100 px-2 py-1 rounded-md font-medium shrink-0">
            Pemohon: {currentStudent.nickname} ({currentStudent.className})
          </span>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-4 w-full min-w-0">
          {/* Destination Selection (Guidance) */}
          <div className="space-y-1.5 w-full min-w-0">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-stone-700">1. Bisa Dipakai untuk Apa Saja?</Label>
              <span className="text-[10px] text-stone-500">Pilih keperluan kas</span>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full min-w-0">
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
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 min-w-0 cursor-pointer active:scale-[0.99] ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-600 text-emerald-950 ring-1.5 ring-emerald-500/30 shadow-xs'
                        : 'bg-white border-stone-200 hover:bg-stone-50 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200/70 flex items-center justify-center text-base shrink-0">
                        {dest.icon}
                      </div>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300 bg-white text-transparent'
                      }`}>
                        <Check size={10} strokeWidth={3} />
                      </div>
                    </div>
                    <div className="min-w-0 w-full">
                      <div className="text-xs font-bold leading-tight truncate">
                        {dest.name}
                      </div>
                      <div className="text-[10px] font-bold text-emerald-800 mt-0.5 truncate">
                        Min Rp {dest.minAmount.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Selection */}
          <div className="space-y-2 w-full min-w-0">
            <Label className="text-xs font-semibold">2. Nominal Kas yang Ditarik:</Label>
            
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 w-full min-w-0">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(q)}
                  className={`w-full py-1.5 px-1 rounded-lg text-[11px] font-mono text-center transition-colors truncate ${
                    amount === q
                      ? 'bg-stone-900 text-white font-bold shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 font-bold'
                  }`}
                >
                  Rp {q.toLocaleString('id-ID')}
                </button>
              ))}
            </div>

            <div className="relative w-full min-w-0">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                Rp
              </span>
              <Input
                type="number"
                min={selectedDest.minAmount}
                max={availableBalance}
                step="1000"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="pl-9 font-bold text-sm h-10 rounded-xl"
                placeholder="Masukkan nominal"
                required
              />
            </div>
          </div>

          {/* Notes for Homeroom Teacher / Wali Kelas */}
          <div className="space-y-1.5 w-full min-w-0">
            <Label className="text-[11px] font-medium text-stone-700">
              3. Catatan Izin untuk Wali Kelas (Keperluan Kas):
            </Label>
            <Input
              type="text"
              placeholder={`Contoh: Beli perlengkapan di ${selectedDest.name} untuk kelas`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs h-10 rounded-xl"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 w-full min-w-0">
              <AlertCircle size={14} className="shrink-0" />
              <span className="truncate">{errorMsg}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={isProcessing || availableBalance < selectedDest.minAmount}
            className="w-full h-11 rounded-xl font-bold text-sm cursor-pointer shadow-sm bg-emerald-800 hover:bg-emerald-900 text-white"
          >
            {isProcessing ? (
              <span>Mengajukan Permintaan...</span>
            ) : (
              <>
                <span>Ajukan Izin Tarik Kas Rp {amount.toLocaleString('id-ID')}</span>
                <ArrowRight size={14} className="ml-2" />
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
