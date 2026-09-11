import React from 'react';
import { CheckCircle2, QrCode } from 'lucide-react';
import { BankTransaction } from '../types';

import {
  Dialog,
  DialogContent,
} from './ui/dialog';
import { Button } from './ui/button';

interface ReceiptModalProps {
  transaction: BankTransaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  onClose,
}) => {
  if (!transaction) return null;

  const isDeposit = transaction.type === 'deposit';

  return (
    <Dialog open={!!transaction} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xs w-[90%] p-5 bg-white rounded-xl gap-4">
        {/* Top receipt title */}
        <div className="text-center pb-3 border-b border-dashed border-stone-200">
          <div className="w-10 h-10 mx-auto rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-lg mb-2">
            {isDeposit ? '🌱' : '🎟️'}
          </div>
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            {isDeposit ? 'Struk Setor Sampah' : 'Voucher Penarikan'}
          </h3>
          <p className="text-[10px] text-stone-500 font-mono mt-0.5">
            Opung Sari Basah Bang
          </p>
        </div>

        {/* Amount Box */}
        <div
          className={`text-center py-3 rounded-lg border ${
            isDeposit
              ? 'bg-emerald-900 text-white border-emerald-950'
              : 'bg-stone-900 text-white border-stone-950'
          }`}
        >
          <div
            className={`text-[10px] font-medium ${
              isDeposit ? 'text-emerald-300' : 'text-stone-400'
            }`}
          >
            {isDeposit ? 'Saldo Ditambahkan' : 'Nominal Voucher'}
          </div>
          <div className="text-xl font-bold font-mono text-white tracking-tight">
            {isDeposit ? '+' : '-'}Rp {transaction.amountRp.toLocaleString('id-ID')}
          </div>
          {transaction.pointsEarned && (
            <div
              className={`text-[10px] font-mono mt-0.5 ${
                isDeposit ? 'text-emerald-200' : 'text-stone-300'
              }`}
            >
              +{transaction.pointsEarned} Poin Kelas
            </div>
          )}
        </div>

        {/* Receipt Details Table */}
        <div className="space-y-2 text-xs text-stone-600 px-1">
          <div className="flex justify-between">
            <span className="text-stone-400">Nama:</span>
            <span className="font-medium text-stone-900">{transaction.studentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Kode Ref:</span>
            <span className="font-mono text-stone-900 font-medium">{transaction.referenceCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Waktu:</span>
            <span className="font-mono text-stone-700">{transaction.timestamp}</span>
          </div>
          {transaction.method && (
            <div className="flex justify-between">
              <span className="text-stone-400">Tujuan:</span>
              <span className="font-medium text-stone-900">{transaction.method}</span>
            </div>
          )}
          {transaction.wasteItemName && (
            <div className="flex justify-between">
              <span className="text-stone-400">Jenis Sampah:</span>
              <span className="font-medium text-stone-900 truncate max-w-[150px]">{transaction.wasteItemName}</span>
            </div>
          )}
          {transaction.weightKg && (
            <div className="flex justify-between">
              <span className="text-stone-400">Berat:</span>
              <span className="font-mono font-medium text-stone-900">{transaction.weightKg} kg</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-stone-400">Status:</span>
            <span className="text-emerald-800 font-medium flex items-center gap-1">
              <CheckCircle2 size={13} /> Berhasil
            </span>
          </div>
        </div>

        {/* Mock QR Voucher */}
        {!isDeposit && (
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-col items-center text-center space-y-1.5 mt-2">
            <div className="w-24 h-24 bg-white p-2 rounded-lg border border-stone-200 flex items-center justify-center">
              <QrCode size={80} className="text-stone-800" />
            </div>
            <span className="text-[10px] text-stone-500 max-w-[180px] leading-tight">
              Tunjukkan QR ini ke Petugas Kantin / Koperasi
            </span>
          </div>
        )}

        <Button
          onClick={onClose}
          className="w-full mt-2 font-medium"
        >
          Tutup Struk
        </Button>
      </DialogContent>
    </Dialog>
  );
};
