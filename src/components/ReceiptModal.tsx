import React from 'react';
import { X, CheckCircle2, QrCode, Printer, Share2, Sparkles } from 'lucide-react';
import { BankTransaction } from '../types';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xs rounded-xl border border-stone-200 p-4 space-y-3 relative shadow-lg">
        {/* Top receipt title */}
        <div className="text-center pb-2 border-b border-dashed border-stone-200">
          <div className="w-8 h-8 mx-auto rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-base mb-1.5">
            {isDeposit ? '🌱' : '🎟️'}
          </div>
          <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
            {isDeposit ? 'Struk Setor Sampah' : 'Voucher Penarikan Reward'}
          </h3>
          <p className="text-[10px] text-stone-500 font-mono">
            Bank Sampah Sekolah
          </p>
        </div>

        {/* Amount Box - Flat Solid Visual Anchor */}
        <div
          className={`text-center py-2.5 rounded-lg border ${
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
          <div className="text-base font-bold font-mono text-white tracking-tight">
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
        <div className="space-y-1.5 text-xs text-stone-600 px-0.5">
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
              <CheckCircle2 size={12} /> Berhasil
            </span>
          </div>
        </div>

        {/* Mock QR Voucher for School Canteen / Koperasi */}
        {!isDeposit && (
          <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 flex flex-col items-center text-center space-y-1">
            <div className="w-20 h-20 bg-white p-1 rounded border border-stone-200 flex items-center justify-center">
              <QrCode size={68} className="text-stone-800" />
            </div>
            <span className="text-[9px] text-stone-500">
              Tunjukkan QR ini ke Petugas Kantin / Koperasi
            </span>
          </div>
        )}

        <button
          onClick={() => {
            onClose();
          }}
          className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
