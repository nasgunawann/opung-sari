import React from 'react';
import { CheckCircle2, QrCode, Clock, Leaf, Ticket } from 'lucide-react';
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
      <DialogContent className="sm:max-w-xs w-full max-w-[calc(100vw-2rem)] p-4 sm:p-5 bg-card rounded-2xl gap-4 max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden min-w-0">
        {/* Top receipt title */}
        <div className="text-center pb-3 border-b border-dashed border-border min-w-0">
          <div className="w-10 h-10 mx-auto rounded-xl bg-muted border border-border flex items-center justify-center mb-2">
            {isDeposit ? (
              <Leaf size={20} className="text-primary" aria-hidden="true" />
            ) : (
              <Ticket size={20} className="text-foreground" aria-hidden="true" />
            )}
          </div>
          <p className="text-xs font-bold text-foreground tracking-wider">
            {isDeposit ? 'Struk Setor Sampah' : 'Voucher Penarikan'}
          </p>
          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
            Opung Sari Basah Bang
          </p>
        </div>

        {/* Amount Box */}
        <div
          className={`text-center py-3 px-2 rounded-xl border min-w-0 ${
            isDeposit
              ? 'bg-primary text-primary-foreground border-border'
              : 'bg-foreground text-background border-border'
          }`}
        >
          <div
            className={`text-[10px] font-medium ${
              isDeposit ? 'text-primary-foreground/70' : 'text-background/70'
            }`}
          >
            {isDeposit ? 'Saldo Ditambahkan' : 'Nominal Voucher'}
          </div>
          <div
            className={`text-xl font-bold font-mono tracking-tight truncate ${
              isDeposit ? 'text-primary-foreground' : 'text-background'
            }`}
          >
            {isDeposit ? '+' : '-'}Rp {transaction.amountRp.toLocaleString('id-ID')}
          </div>
          {transaction.pointsEarned && (
            <div
              className={`text-[10px] font-mono mt-0.5 truncate ${
                isDeposit ? 'text-primary-foreground/80' : 'text-background/80'
              }`}
            >
              +{transaction.pointsEarned} Poin Kelas
            </div>
          )}
        </div>

        {/* Receipt Details Table */}
        <div className="space-y-2 text-xs text-muted-foreground px-1 min-w-0">
          <div className="flex justify-between items-center gap-2 min-w-0">
            <span className="text-muted-foreground shrink-0">Nama:</span>
            <span className="font-medium text-foreground truncate text-right">{transaction.studentName}</span>
          </div>
          <div className="flex justify-between items-center gap-2 min-w-0">
            <span className="text-muted-foreground shrink-0">Kode Referensi:</span>
            <span className="font-mono text-foreground font-medium break-all text-right">{transaction.referenceCode}</span>
          </div>
          <div className="flex justify-between items-center gap-2 min-w-0">
            <span className="text-muted-foreground shrink-0">Waktu:</span>
            <span className="font-mono text-foreground text-right shrink-0">{transaction.timestamp}</span>
          </div>
          {transaction.method && (
            <div className="flex justify-between items-center gap-2 min-w-0">
              <span className="text-muted-foreground shrink-0">Tujuan:</span>
              <span className="font-medium text-foreground truncate text-right">{transaction.method}</span>
            </div>
          )}
          {transaction.wasteItemName && (
            <div className="flex justify-between items-center gap-2 min-w-0">
              <span className="text-muted-foreground shrink-0">Jenis Sampah:</span>
              <span className="font-medium text-foreground truncate text-right">{transaction.wasteItemName}</span>
            </div>
          )}
          {transaction.weightKg && (
            <div className="flex justify-between items-center gap-2 min-w-0">
              <span className="text-muted-foreground shrink-0">Berat:</span>
              <span className="font-mono font-medium text-foreground text-right">{transaction.weightKg} kg</span>
            </div>
          )}
          <div className="flex justify-between items-center gap-2 min-w-0">
            <span className="text-muted-foreground shrink-0">Status:</span>
            {transaction.status === 'diproses' ? (
              <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 shrink-0">
                <Clock size={12} aria-hidden="true" /> Menunggu Izin Wali Kelas
              </span>
            ) : (
              <span className="text-primary font-medium flex items-center gap-1 shrink-0">
                <CheckCircle2 size={13} aria-hidden="true" /> Berhasil
              </span>
            )}
          </div>
        </div>

        {/* Mock QR Voucher */}
        {!isDeposit && (
          <div className="p-3 bg-muted rounded-xl border border-border flex flex-col items-center text-center space-y-1.5 mt-2 min-w-0">
            <div className="w-24 h-24 bg-card p-2 rounded-lg border border-border flex items-center justify-center">
              <QrCode size={80} className="text-foreground" aria-hidden="true" />
            </div>
            <span className="text-[10px] text-muted-foreground max-w-[200px] leading-tight">
              {transaction.status === 'diproses'
                ? 'Tunjukkan bukti pengajuan ini kepada Wali Kelas selaku pemegang kas untuk persetujuan pencairan.'
                : 'Tunjukkan QR ini ke Petugas Kantin / Koperasi'}
            </span>
          </div>
        )}

        <Button
          onClick={onClose}
          className="w-full mt-2 font-bold h-10 rounded-xl cursor-pointer"
        >
          Tutup Struk
        </Button>
      </DialogContent>
    </Dialog>
  );
};
