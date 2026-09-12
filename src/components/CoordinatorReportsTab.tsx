import React, { useState } from 'react';
import {
  BarChart3,
  Printer,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Calendar,
  Building2,
  Search,
  Filter,
  ShieldCheck,
  TrendingUp,
  Award,
  ArrowUpRight,
  ArrowDownLeft,
  Share2,
} from 'lucide-react';
import { SchoolClass, Student, BankTransaction } from '../types';

interface CoordinatorReportsTabProps {
  classes: SchoolClass[];
  students: Student[];
  transactions: BankTransaction[];
}

export const CoordinatorReportsTab: React.FC<CoordinatorReportsTabProps> = ({
  classes,
  students,
  transactions,
}) => {
  const [activeReportSubTab, setActiveReportSubTab] = useState<'classes' | 'transactions'>('classes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [isReportCertified, setIsReportCertified] = useState(true);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Overall KPIs
  const totalKgAllClasses = classes.reduce((sum, c) => sum + (c.totalKg || 0), 0);
  const totalBalanceAllClasses = classes.reduce((sum, c) => sum + (c.balanceRp || 0), 0);
  const totalApprovedWithdrawals = transactions
    .filter((t) => t.type === 'withdrawal' && t.status === 'berhasil')
    .reduce((sum, t) => sum + t.amountRp, 0);

  const totalOrganicKg = classes.reduce((sum, c) => sum + (c.organicKg || 0), 0);
  const totalPlasticKg = classes.reduce((sum, c) => sum + (c.plasticKg || 0), 0);
  const totalPaperKg = classes.reduce((sum, c) => sum + (c.paperKg || 0), 0);
  const totalB3Kg = classes.reduce((sum, c) => sum + (c.b3Kg || 0), 0);

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    if (selectedClassFilter !== 'all' && t.classId !== selectedClassFilter) return false;
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-5 px-3 sm:px-6 space-y-5">
      {/* Header Banner */}
      <div className="bg-blue-900 text-white rounded-2xl p-4 sm:p-6 border border-blue-950 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-200 text-xs font-bold">
              <BarChart3 size={14} /> FR-REP-01 Pelaporan Adiwiyata
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Rekapitulasi & Laporan Bulanan
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl">
              Kompilasi otomatis data reduksi sampah, perputaran kas kelas, dan transparansi buku
              besar untuk audit sekolah dan Dinas Lingkungan Hidup Deli Serdang.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs font-black shadow transition-all active:scale-95"
            >
              <Printer size={15} />
              <span>Cetak Rekap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Certification Status Alert (FR-REP-02) */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              isReportCertified
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <span>Siklus Pelaporan Periode Bulan Ini</span>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  isReportCertified
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isReportCertified ? 'Telah Disahkan' : 'Belum Disahkan'}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Kewajiban konfirmasi & publikasi laporan sebelum tanggal 5 tiap bulannya.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsReportCertified(!isReportCertified)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 self-start sm:self-center ${
            isReportCertified
              ? 'border border-stone-300 text-stone-700 hover:bg-stone-50'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white'
          }`}
        >
          {isReportCertified ? 'Perbarui Pengesahan' : 'Sahkan Laporan Sekarang'}
        </button>
      </div>

      {/* 4 Summary KPI Cards (2x2 on mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 block">Total Sampah Terpilah</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">
            {totalKgAllClasses.toFixed(1)} <span className="text-xs font-bold text-stone-500">kg</span>
          </div>
          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-1">
            🌱 Reduksi TPA
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 block">Saldo Kas Kelas Total</span>
          <div className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
            Rp {totalBalanceAllClasses.toLocaleString('id-ID')}
          </div>
          <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded inline-block mt-1">
            {classes.length} Rekening Kelas
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 block">Pencairan Kas Sah</span>
          <div className="text-xl sm:text-2xl font-black text-amber-800 mt-1">
            Rp {totalApprovedWithdrawals.toLocaleString('id-ID')}
          </div>
          <span className="text-[10px] font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded inline-block mt-1">
            Alat/Kegiatan Kelas
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 block">Total Transaksi</span>
          <div className="text-xl sm:text-2xl font-black text-blue-800 mt-1">
            {transactions.length}{' '}
            <span className="text-xs font-bold text-stone-500">kali</span>
          </div>
          <span className="text-[10px] font-medium text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded inline-block mt-1">
            100% Tercatat
          </span>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-1">
        <button
          onClick={() => setActiveReportSubTab('classes')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
            activeReportSubTab === 'classes'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Building2 size={15} />
          Rekapitulasi Per Kelas
        </button>

        <button
          onClick={() => setActiveReportSubTab('transactions')}
          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
            activeReportSubTab === 'transactions'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <FileSpreadsheet size={15} />
          Buku Besar Transaksi
        </button>
      </div>

      {/* Sub-tab 1: Rekap Per Kelas */}
      {activeReportSubTab === 'classes' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                Tabel Akumulasi Pengelolaan Sampah Kelas
              </h2>
              <p className="text-xs text-stone-500">
                Rincian timbulan per kategori (organik, plastik, kertas, B3) dan saldo kas masing-masing.
              </p>
            </div>
            <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full self-start sm:self-auto">
              Urut berdasarkan Peringkat
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3 sm:px-4">Pos</th>
                  <th className="py-3 px-3 sm:px-4">Kelas & Wali</th>
                  <th className="py-3 px-2 sm:px-3 text-right">Organik</th>
                  <th className="py-3 px-2 sm:px-3 text-right">Plastik</th>
                  <th className="py-3 px-2 sm:px-3 text-right">Kertas</th>
                  <th className="py-3 px-2 sm:px-3 text-right">B3</th>
                  <th className="py-3 px-3 sm:px-4 text-right font-black text-emerald-800">Total (Kg)</th>
                  <th className="py-3 px-3 sm:px-4 text-right font-black text-stone-900">Saldo Kas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-3 sm:px-4 font-black text-stone-700">
                      {cls.rank === 1 ? '🥇' : cls.rank === 2 ? '🥈' : cls.rank === 3 ? '🥉' : `#${cls.rank}`}
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      <div className="font-bold text-stone-900">{cls.name}</div>
                      <div className="text-[11px] text-stone-500">{cls.waliKelas}</div>
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-right text-stone-600">
                      {(cls.organicKg || 0).toFixed(1)}
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-right text-stone-600">
                      {(cls.plasticKg || 0).toFixed(1)}
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-right text-stone-600">
                      {(cls.paperKg || 0).toFixed(1)}
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-right text-stone-600">
                      {(cls.b3Kg || 0).toFixed(1)}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right font-black text-emerald-800">
                      {(cls.totalKg || 0).toFixed(1)} kg
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right font-black text-stone-900">
                      Rp {(cls.balanceRp ?? 0).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-stone-100 font-black text-stone-900 border-t">
                <tr>
                  <td colSpan={2} className="py-3 px-3 sm:px-4 text-stone-700 uppercase tracking-wider text-xs">
                    Total Agregat Sekolah
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-right">{totalOrganicKg.toFixed(1)}</td>
                  <td className="py-3 px-2 sm:px-3 text-right">{totalPlasticKg.toFixed(1)}</td>
                  <td className="py-3 px-2 sm:px-3 text-right">{totalPaperKg.toFixed(1)}</td>
                  <td className="py-3 px-2 sm:px-3 text-right">{totalB3Kg.toFixed(1)}</td>
                  <td className="py-3 px-3 sm:px-4 text-right text-emerald-800 text-sm">
                    {totalKgAllClasses.toFixed(1)} kg
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right text-sm">
                    Rp {totalBalanceAllClasses.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Buku Besar Transaksi (Ledger) */}
      {activeReportSubTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-3 p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filter by class */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-600">Filter Kelas:</span>
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Kelas ({classes.length})</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative min-w-[220px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari transaksi..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Kode Ref / Waktu</th>
                  <th className="py-3 px-3">Kelas & Penyetor</th>
                  <th className="py-3 px-3">Jenis & Kategori</th>
                  <th className="py-3 px-3 text-right">Bobot</th>
                  <th className="py-3 px-3 text-right">Mutasi Kas</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {filteredTransactions.map((t) => {
                  const isDeposit = t.type === 'deposit';
                  return (
                    <tr key={t.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-stone-800">{t.referenceCode}</div>
                        <div className="text-[11px] text-stone-500">{t.timestamp}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-stone-900">{t.className}</div>
                        <div className="text-[11px] text-stone-500">{t.studentName}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-stone-800">
                          {isDeposit ? t.wasteItemName || 'Setor Sampah' : t.description}
                        </div>
                        {t.category && (
                          <span className="text-[10px] text-stone-500 uppercase">{t.category}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right text-stone-700">
                        {t.weightKg ? `${t.weightKg} kg` : '-'}
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-black ${
                          isDeposit ? 'text-emerald-800' : 'text-amber-800'
                        }`}
                      >
                        {isDeposit ? '+' : '-'}Rp {t.amountRp.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            t.status === 'berhasil'
                              ? 'bg-emerald-100 text-emerald-800'
                              : t.status === 'diproses'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {t.status === 'berhasil'
                            ? 'Sukses'
                            : t.status === 'diproses'
                            ? 'Proses'
                            : 'Ditolak'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Printable Report Modal Preview */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Header Surat Resmi */}
            <div className="border-b-2 border-stone-800 pb-4 text-center space-y-1">
              <div className="text-xs font-bold uppercase tracking-widest text-stone-600">
                Pemerintah Kabupaten Deli Serdang • Dinas Lingkungan Hidup
              </div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 uppercase">
                Laporan Bulanan Bank Sampah Sekolah Adiwiyata
              </h2>
              <p className="text-xs text-stone-600">
                Program Opung Sari Basah Bang 5.0 • Periode Bulan Berjalan 2026
              </p>
            </div>

            {/* Meta data ringkas */}
            <div className="grid grid-cols-2 gap-4 text-xs font-medium border p-3 rounded-xl bg-stone-50">
              <div>
                <span className="text-stone-500 block">Unit Sekolah:</span>
                <span className="font-bold text-stone-900">SD Negeri Deli Serdang Percontohan</span>
              </div>
              <div>
                <span className="text-stone-500 block">Koordinator Pengesah:</span>
                <span className="font-bold text-stone-900">Bapak Suhendra, S.Pd (Koordinator Bank Sampah)</span>
              </div>
              <div>
                <span className="text-stone-500 block">Total Sampah Terkelola:</span>
                <span className="font-bold text-emerald-800">{totalKgAllClasses.toFixed(1)} Kg</span>
              </div>
              <div>
                <span className="text-stone-500 block">Total Kas Sirkular:</span>
                <span className="font-bold text-stone-900">Rp {totalBalanceAllClasses.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Tabel Cetak */}
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 font-bold text-stone-700 border-b">
                  <tr>
                    <th className="p-2">Kelas</th>
                    <th className="p-2">Wali Kelas</th>
                    <th className="p-2 text-right">Organik</th>
                    <th className="p-2 text-right">Plastik</th>
                    <th className="p-2 text-right">Kertas</th>
                    <th className="p-2 text-right">B3</th>
                    <th className="p-2 text-right font-black">Total (Kg)</th>
                    <th className="p-2 text-right font-black">Saldo Kas</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-medium">
                  {classes.map((cls) => (
                    <tr key={cls.id}>
                      <td className="p-2 font-bold">{cls.name}</td>
                      <td className="p-2">{cls.waliKelas}</td>
                      <td className="p-2 text-right">{(cls.organicKg || 0).toFixed(1)}</td>
                      <td className="p-2 text-right">{(cls.plasticKg || 0).toFixed(1)}</td>
                      <td className="p-2 text-right">{(cls.paperKg || 0).toFixed(1)}</td>
                      <td className="p-2 text-right">{(cls.b3Kg || 0).toFixed(1)}</td>
                      <td className="p-2 text-right font-bold">{(cls.totalKg || 0).toFixed(1)} kg</td>
                      <td className="p-2 text-right font-bold">
                        Rp {(cls.balanceRp ?? 0).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tanda Tangan */}
            <div className="grid grid-cols-2 gap-8 pt-4 text-xs text-center font-medium">
              <div>
                <p className="text-stone-500">Mengetahui,</p>
                <p className="font-bold text-stone-800">Kepala Sekolah</p>
                <div className="h-16 flex items-center justify-center text-stone-300 italic text-[10px]">
                  [Tanda Tangan & Cap Digital]
                </div>
                <p className="font-bold text-stone-900 underline">Hj. Nurhasanah, M.Pd</p>
                <p className="text-[10px] text-stone-500">NIP. 19780512 200212 2 003</p>
              </div>

              <div>
                <p className="text-stone-500">Deli Serdang, Bulan Berjalan</p>
                <p className="font-bold text-stone-800">Koordinator Bank Sampah</p>
                <div className="h-16 flex items-center justify-center text-emerald-700 font-bold text-[11px]">
                  ✓ Terverifikasi Digital
                </div>
                <p className="font-bold text-stone-900 underline">Suhendra, S.Pd</p>
                <p className="text-[10px] text-stone-500">NIP. 19850314 201001 1 012</p>
              </div>
            </div>

            {/* Action Buttons inside Modal */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-black shadow transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Printer size={15} />
                Cetak Dokumen Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
