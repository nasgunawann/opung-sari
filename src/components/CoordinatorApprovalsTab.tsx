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
  Sparkles,
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
      <div className="bg-stone-900 text-white rounded-2xl p-4 sm:p-6 border border-stone-800 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-800 text-amber-300 text-xs font-bold">
            <ClipboardCheck size={14} /> Two-Party Approval
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Validasi & Persetujuan Pencairan Kas
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 max-w-2xl">
            Sesuai regulasi Adiwiyata, setiap pengajuan pencairan saldo kas kelas wajib diverifikasi
            oleh koordinator sekolah sebelum dana fisik diserahkan kepada pengurus kelas.
          </p>
        </div>
      </div>

      {/* KPI Metrics: 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Pending Card */}
        <div
          onClick={() => setFilterStatus('diproses')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            filterStatus === 'diproses'
              ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400 shadow-xs'
              : 'bg-white border-stone-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <Clock size={15} /> Menunggu Validasi
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
              {pendingList.length} Pengajuan
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900">
            Rp {pendingAmount.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Perlu dicek & disetujui fisik</p>
        </div>

        {/* Approved Card */}
        <div
          onClick={() => setFilterStatus('berhasil')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            filterStatus === 'berhasil'
              ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-400 shadow-xs'
              : 'bg-white border-stone-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 size={15} /> Telah Disetujui
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
              {approvedList.length}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-900">
            Rp {approvedAmount.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Tercatat sah keluar dari kas</p>
        </div>

        {/* Rejected Card */}
        <div
          onClick={() => setFilterStatus('ditolak')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            filterStatus === 'ditolak'
              ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-400 shadow-xs'
              : 'bg-white border-stone-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
              <XCircle size={15} /> Ditolak / Dibatalkan
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              {rejectedList.length}
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-800">
            {rejectedList.length} Pengajuan
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Saldo dikembalikan ke kelas</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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
              onClick={() => setFilterStatus(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterStatus === tab.key
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kelas, siswa, ref..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all ${
                isPending
                  ? 'border-amber-300 ring-1 ring-amber-200 shadow-xs'
                  : isApproved
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-rose-200 bg-rose-50/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b pb-3.5">
                {/* Left info: Class and Status */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-base sm:text-lg text-stone-900">
                      {trx.className || 'Kelas'}
                    </span>
                    {matchedClass && (
                      <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md font-medium">
                        Wali: {matchedClass.waliKelas.split(',')[0]}
                      </span>
                    )}

                    {/* Status Badge */}
                    {isPending && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                        <Clock size={12} /> Menunggu Validasi Fisik
                      </span>
                    )}
                    {isApproved && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 size={12} /> Telah Disetujui
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-800 bg-rose-100 border border-rose-300 px-2.5 py-0.5 rounded-full">
                        <XCircle size={12} /> Ditolak / Saldo Dikembalikan
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-stone-500 flex flex-wrap items-center gap-3 pt-0.5">
                    <span className="flex items-center gap-1 font-medium">
                      <User size={13} className="text-stone-400" /> Pemohon: {trx.studentName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar size={13} className="text-stone-400" /> {trx.timestamp}
                    </span>
                    <span>•</span>
                    <span className="font-bold text-stone-600">{trx.referenceCode}</span>
                  </div>
                </div>

                {/* Right info: Amount */}
                <div className="sm:text-right">
                  <span className="text-[11px] text-stone-500 block font-medium">Nominal Pengajuan:</span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-800">
                    Rp {trx.amountRp.toLocaleString('id-ID')}
                  </div>
                  {trx.method && (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md inline-block mt-0.5">
                      Peruntukan: {trx.method}
                    </span>
                  )}
                </div>
              </div>

              {/* Description / Notes */}
              <div className="py-3 text-xs sm:text-sm text-stone-700 bg-stone-50/70 p-3 rounded-xl border border-stone-100 mt-3 space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  Keterangan / Rencana Penggunaan:
                </span>
                <p className="font-medium text-stone-800">{trx.description}</p>
                {trx.targetAccount && (
                  <p className="text-[11px] text-stone-500 pt-1">
                    Diserahkan kepada: <span className="font-bold text-stone-700">{trx.targetAccount}</span>
                  </p>
                )}
                {trx.rejectionReason && (
                  <div className="mt-2 p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-medium">
                    <span className="font-bold">Alasan Penolakan:</span> {trx.rejectionReason}
                  </div>
                )}
              </div>

              {/* Approval Action Buttons (Only when status is 'diproses') */}
              {isPending && (
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                  {rejectingId === trx.id ? (
                    <div className="w-full flex flex-col sm:flex-row items-center gap-2 p-2.5 bg-rose-50 border border-rose-300 rounded-xl animate-in fade-in">
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Tulis alasan penolakan (misal: nota belum lengkap)..."
                        className="flex-1 px-3 py-1.5 rounded-lg border border-rose-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                      />
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setRejectingId(null);
                            setRejectReason('');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-stone-200 text-stone-700 hover:bg-stone-300 text-xs font-bold"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleConfirmReject(trx.id)}
                          disabled={!rejectReason.trim()}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold"
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
                        className="w-full sm:w-auto px-4 py-2 rounded-xl border border-stone-300 hover:border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <XCircle size={15} />
                        Tolak / Minta Revisi
                      </button>

                      <button
                        type="button"
                        onClick={() => onApproveWithdrawal(trx.id)}
                        className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 size={16} />
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
          <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
              <ClipboardCheck size={24} />
            </div>
            <h3 className="font-bold text-stone-800 text-sm">Tidak Ada Permohonan</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
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
