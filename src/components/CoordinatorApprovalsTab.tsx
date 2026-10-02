import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Wallet,
  AlertCircle,
  Building2,
  User,
  ArrowDownLeft,
  Info,
  Calendar,
} from 'lucide-react';
import { BankTransaction, SchoolClass } from '../types';

interface CoordinatorApprovalsTabProps {
  transactions: BankTransaction[];
  classes: SchoolClass[];
  onApproveWithdrawal: (trxId: string) => void;
  onRejectWithdrawal: (trxId: string, reason: string) => void;
}

export const CoordinatorApprovalsTab: React.FC<CoordinatorApprovalsTabProps> = ({
  transactions,
  classes,
  onApproveWithdrawal,
  onRejectWithdrawal,
}) => {
  const [filterStatus, setFilterStatus] = useState<'semua' | 'diproses' | 'berhasil' | 'ditolak'>('diproses');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Only withdrawal transactions are relevant here
  const withdrawalTransactions = transactions.filter((t) => t.type === 'withdrawal');

  const pendingList = withdrawalTransactions.filter((t) => t.status === 'diproses');
  const approvedList = withdrawalTransactions.filter((t) => t.status === 'berhasil');
  const rejectedList = withdrawalTransactions.filter((t) => t.status === 'ditolak');

  const pendingAmount = pendingList.reduce((sum, t) => sum + t.amountRp, 0);
  const approvedAmount = approvedList.reduce((sum, t) => sum + t.amountRp, 0);

  const filteredList = withdrawalTransactions.filter((t) => {
    if (filterStatus !== 'semua' && t.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchClass = (t.className || '').toLowerCase().includes(q);
      const matchStudent = (t.studentName || '').toLowerCase().includes(q);
      const matchDesc = (t.description || '').toLowerCase().includes(q);
      const matchRef = t.referenceCode.toLowerCase().includes(q);
      return matchClass || matchStudent || matchDesc || matchRef;
    }
    return true;
  });

  const handleConfirmReject = (trxId: string) => {
    if (!rejectReason.trim()) return;
    onRejectWithdrawal(trxId, rejectReason);
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-5 px-3 sm:px-6 space-y-5">
      {/* Header Banner */}
      <div className="bg-foreground text-background rounded-2xl p-4 sm:p-6 border border-border shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-background/15 text-background text-xs font-bold">
            <ClipboardCheck size={14} aria-hidden="true" /> Persetujuan Dua Pihak
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-background">
            Validasi & Persetujuan Pencairan Kas
          </h2>
          <p className="text-xs sm:text-sm text-background/90 max-w-2xl">
            Sesuai regulasi Adiwiyata, setiap pengajuan pencairan saldo kas kelas wajib diverifikasi
            oleh koordinator sekolah sebelum dana fisik diserahkan kepada pengurus kelas.
          </p>
        </div>
      </div>

      {/* KPI Metrics: 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Pending Card */}
        <button
          type="button"
          onClick={() => setFilterStatus('diproses')}
          className={`text-left w-full p-4 rounded-2xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            filterStatus === 'diproses'
              ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400 shadow-xs'
              : 'bg-card border-border hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <Clock size={15} aria-hidden="true" /> Menunggu Validasi
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
              {pendingList.length} Pengajuan
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-foreground">
            Rp {pendingAmount.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Perlu dicek & disetujui fisik</p>
        </button>

        {/* Approved Card */}
        <button
          type="button"
          onClick={() => setFilterStatus('berhasil')}
          className={`text-left w-full p-4 rounded-2xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            filterStatus === 'berhasil'
              ? 'bg-secondary border-primary ring-2 ring-primary shadow-xs'
              : 'bg-card border-border hover:border-primary/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-primary flex items-center gap-1.5">
              <CheckCircle2 size={15} aria-hidden="true" /> Telah Disetujui
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-secondary text-primary">
              {approvedList.length}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-primary">
            Rp {approvedAmount.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Tercatat sah keluar dari kas</p>
        </button>

        {/* Rejected Card */}
        <button
          type="button"
          onClick={() => setFilterStatus('ditolak')}
          className={`text-left w-full p-4 rounded-2xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            filterStatus === 'ditolak'
              ? 'bg-destructive/10 border-destructive ring-2 ring-destructive shadow-xs'
              : 'bg-card border-border hover:border-destructive/40'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-destructive flex items-center gap-1.5">
              <XCircle size={15} aria-hidden="true" /> Ditolak / Dibatalkan
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
              {rejectedList.length}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-foreground">
            {rejectedList.length} Pengajuan
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Saldo dikembalikan ke kelas</p>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card rounded-2xl p-3 sm:p-4 border border-border shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(
            [
              { key: 'diproses', label: `Menunggu (${pendingList.length})` },
              { key: 'berhasil', label: `Disetujui (${approvedList.length})` },
              { key: 'ditolak', label: `Ditolak (${rejectedList.length})` },
              { key: 'semua', label: `Semua (${withdrawalTransactions.length})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterStatus(tab.key)}
              className={`inline-flex items-center justify-center min-h-10 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                filterStatus === tab.key
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted hover:bg-muted/70 text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full min-w-0 sm:min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Cari permohonan pencairan"
            placeholder="Cari kelas, siswa, ref..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* List of Applications */}
      <div className="space-y-3">
        {filteredList.map((trx) => {
          const matchedClass = classes.find((c) => c.id === trx.classId);
          const isPending = trx.status === 'diproses';
          const isApproved = trx.status === 'berhasil';
          const isRejected = trx.status === 'ditolak';

          return (
            <div
              key={trx.id}
              className={`bg-card rounded-2xl p-4 sm:p-5 border transition-all ${
                isPending
                  ? 'border-amber-300 ring-1 ring-amber-200 shadow-xs'
                  : isApproved
                  ? 'border-primary/30 bg-secondary/40'
                  : 'border-destructive/30 bg-destructive/10'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b pb-3.5">
                {/* Left info: Class and Status */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-base sm:text-lg text-foreground">
                      {trx.className || 'Kelas'}
                    </span>
                    {matchedClass && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md font-medium">
                        Wali: {matchedClass.waliKelas.split(',')[0]}
                      </span>
                    )}

                    {/* Status Badge */}
                    {isPending && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                        <Clock size={12} aria-hidden="true" /> Menunggu Validasi Fisik
                      </span>
                    )}
                    {isApproved && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-primary bg-secondary border border-primary/30 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 size={12} aria-hidden="true" /> Telah Disetujui
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-destructive bg-destructive/10 border border-destructive/30 px-2.5 py-0.5 rounded-full">
                        <XCircle size={12} aria-hidden="true" /> Ditolak / Saldo Dikembalikan
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-3 pt-0.5">
                    <span className="flex items-center gap-1 font-medium">
                      <User size={13} className="text-muted-foreground" aria-hidden="true" /> Pemohon: {trx.studentName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar size={13} className="text-muted-foreground" aria-hidden="true" /> {trx.timestamp}
                    </span>
                    <span>•</span>
                    <span className="font-bold text-muted-foreground">{trx.referenceCode}</span>
                  </div>
                </div>

                {/* Right info: Amount */}
                <div className="sm:text-right">
                  <span className="text-[11px] text-muted-foreground block font-medium">Nominal Pengajuan:</span>
                  <div className="text-xl sm:text-2xl font-black text-primary">
                    Rp {trx.amountRp.toLocaleString('id-ID')}
                  </div>
                  {trx.method && (
                    <span className="text-[11px] font-bold text-primary bg-secondary border border-primary/20 px-2 py-0.5 rounded-md inline-block mt-0.5">
                      Peruntukan: {trx.method}
                    </span>
                  )}
                </div>
              </div>

              {/* Description / Notes */}
              <div className="py-3 text-xs sm:text-sm text-foreground bg-muted/50 p-3 rounded-xl border border-border mt-3 space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground tracking-wider block">
                  Keterangan / Rencana Penggunaan:
                </span>
                <p className="font-medium text-foreground">{trx.description}</p>
                {trx.targetAccount && (
                  <p className="text-[11px] text-muted-foreground pt-1">
                    Diserahkan kepada: <span className="font-bold text-foreground">{trx.targetAccount}</span>
                  </p>
                )}
                {trx.rejectionReason && (
                  <div className="mt-2 p-2 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-xs font-medium">
                    <span className="font-bold">Alasan Penolakan:</span> {trx.rejectionReason}
                  </div>
                )}
              </div>

              {/* Approval Action Buttons (Only when status is 'diproses') */}
              {isPending && (
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                  {rejectingId === trx.id ? (
                    <div className="w-full flex flex-col sm:flex-row items-center gap-2 p-2.5 bg-destructive/10 border border-destructive/30 rounded-xl animate-in fade-in">
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        aria-label="Alasan penolakan"
                        placeholder="Tulis alasan penolakan (misal: nota belum lengkap)..."
                        className="flex-1 w-full px-3 py-2.5 rounded-lg border border-destructive/30 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-background"
                      />
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setRejectingId(null);
                            setRejectReason('');
                          }}
                          className="min-h-10 px-3.5 rounded-lg bg-muted text-foreground hover:bg-muted/70 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleConfirmReject(trx.id)}
                          disabled={!rejectReason.trim()}
                          className="min-h-10 px-3.5 rounded-lg bg-destructive hover:bg-destructive/90 disabled:opacity-50 text-destructive-foreground text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          Kirim Penolakan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setRejectingId(trx.id);
                          setRejectReason('');
                        }}
                        className="w-full sm:w-auto min-h-10 px-4 py-2 rounded-xl border border-border hover:border-destructive/40 hover:bg-destructive/10 text-destructive text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <XCircle size={15} aria-hidden="true" />
                        Tolak / Minta Revisi
                      </button>

                      <button
                        type="button"
                        onClick={() => onApproveWithdrawal(trx.id)}
                        className="w-full sm:w-auto min-h-10 px-5 py-2 rounded-xl bg-primary hover:bg-primary-active text-primary-foreground text-xs font-black shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <CheckCircle2 size={16} aria-hidden="true" />
                        Setujui & Cairkan Kas
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredList.length === 0 && (
          <div className="bg-card rounded-2xl p-8 border border-border text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-muted text-muted-foreground mx-auto flex items-center justify-center">
              <ClipboardCheck size={24} aria-hidden="true" />
            </div>
            <h3 className="font-bold text-foreground text-sm">Tidak Ada Permohonan</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {filterStatus === 'diproses'
                ? 'Semua permohonan pencairan kas kelas telah selesai diproses dan diverifikasi.'
                : 'Tidak ada data pencairan yang sesuai dengan filter saat ini.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
