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
  Leaf,
  Medal,
  Check,
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
      <div className="bg-primary text-primary-foreground rounded-2xl p-4 sm:p-6 border border-primary shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-primary-foreground">
              Rekapitulasi & Laporan Bulanan
            </h2>
            <p className="text-xs sm:text-sm text-primary-foreground/90 max-w-xl">
              Kompilasi otomatis data reduksi sampah, perputaran kas kelas, dan transparansi buku
              besar untuk audit sekolah dan Dinas Lingkungan Hidup Deli Serdang.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="inline-flex items-center gap-1.5 min-h-10 px-3.5 py-2 rounded-xl bg-background text-primary hover:bg-secondary text-xs font-black shadow transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Printer size={15} aria-hidden="true" />
              <span>Cetak Rekap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Certification Status Alert (FR-REP-02) */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-card border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              isReportCertified
                ? 'bg-secondary text-primary'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            <ShieldCheck size={20} aria-hidden="true" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
              <span>Siklus Pelaporan Periode Bulan Ini</span>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  isReportCertified
                    ? 'bg-secondary text-primary'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isReportCertified ? 'Telah Disahkan' : 'Belum Disahkan'}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Kewajiban konfirmasi & publikasi laporan sebelum tanggal 5 tiap bulannya.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsReportCertified(!isReportCertified)}
          className={`min-h-10 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 self-start sm:self-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            isReportCertified
              ? 'border border-border text-foreground hover:bg-muted/50'
              : 'bg-primary hover:bg-primary-active text-primary-foreground'
          }`}
        >
          {isReportCertified ? 'Perbarui Pengesahan' : 'Sahkan Laporan Sekarang'}
        </button>
      </div>

      {/* 4 Summary KPI Cards (2x2 on mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-card rounded-2xl p-3.5 sm:p-4 border border-border shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground block">Total Sampah Terpilah</span>
          <div className="text-xl sm:text-2xl font-black text-primary mt-1">
            {totalKgAllClasses.toFixed(1)} <span className="text-xs font-bold text-muted-foreground">kg</span>
          </div>
          <span className="text-[10px] font-medium text-primary bg-secondary px-1.5 py-0.5 rounded inline-flex items-center gap-1 mt-1">
            <Leaf size={11} aria-hidden="true" /> Reduksi TPA
          </span>
        </div>

        <div className="bg-card rounded-2xl p-3.5 sm:p-4 border border-border shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground block">Saldo Kas Kelas Total</span>
          <div className="text-xl sm:text-2xl font-black text-foreground mt-1">
            Rp {totalBalanceAllClasses.toLocaleString('id-ID')}
          </div>
          <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded inline-block mt-1">
            {classes.length} Rekening Kelas
          </span>
        </div>

        <div className="bg-card rounded-2xl p-3.5 sm:p-4 border border-border shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground block">Pencairan Kas Sah</span>
          <div className="text-xl sm:text-2xl font-black text-foreground mt-1">
            Rp {totalApprovedWithdrawals.toLocaleString('id-ID')}
          </div>
          <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded inline-block mt-1">
            Alat/Kegiatan Kelas
          </span>
        </div>

        <div className="bg-card rounded-2xl p-3.5 sm:p-4 border border-border shadow-xs">
          <span className="text-[11px] font-bold text-muted-foreground block">Total Transaksi</span>
          <div className="text-xl sm:text-2xl font-black text-foreground mt-1">
            {transactions.length}{' '}
            <span className="text-xs font-bold text-muted-foreground">kali</span>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded inline-block mt-1">
            100% Tercatat
          </span>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          type="button"
          onClick={() => setActiveReportSubTab('classes')}
          className={`inline-flex items-center min-h-10 px-3.5 rounded-xl text-xs sm:text-sm font-black transition-all gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            activeReportSubTab === 'classes'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Building2 size={15} aria-hidden="true" />
          Rekapitulasi Per Kelas
        </button>

        <button
          type="button"
          onClick={() => setActiveReportSubTab('transactions')}
          className={`inline-flex items-center min-h-10 px-3.5 rounded-xl text-xs sm:text-sm font-black transition-all gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            activeReportSubTab === 'transactions'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <FileSpreadsheet size={15} aria-hidden="true" />
          Buku Besar Transaksi
        </button>
      </div>

      {/* Sub-tab 1: Rekap Per Kelas */}
      {activeReportSubTab === 'classes' && (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Tabel Akumulasi Pengelolaan Sampah Kelas
              </h2>
              <p className="text-xs text-muted-foreground">
                Rincian timbulan per kategori (organik, plastik, kertas, B3) dan saldo kas masing-masing.
              </p>
            </div>
            <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full self-start sm:self-auto">
              Urut berdasarkan Peringkat
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-muted text-muted-foreground font-bold border-b text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-3 sm:px-4">Pos</th>
                  <th className="py-3 px-3 sm:px-4">Kelas & Wali</th>
                  <th className="py-3 px-2 sm:px-3 text-right">Organik</th>
                  <th className="py-3 px-2 sm:px-3 text-right">Plastik</th>
                  <th className="py-3 px-2 sm:px-3 text-right">Kertas</th>
                  <th className="py-3 px-2 sm:px-3 text-right">B3</th>
                  <th className="py-3 px-3 sm:px-4 text-right font-black text-primary">Total (Kg)</th>
                  <th className="py-3 px-3 sm:px-4 text-right font-black text-foreground">Saldo Kas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-3 sm:px-4 font-black text-foreground">
                      {cls.rank <= 3 ? (
                        <Medal
                          size={16}
                          className={
                            cls.rank === 1
                              ? 'text-amber-400'
                              : cls.rank === 2
                              ? 'text-muted-foreground'
                              : 'text-amber-700'
                          }
                        />
                      ) : (
                        `#${cls.rank}`
                      )}
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      <div className="font-bold text-foreground">{cls.name}</div>
                      <div className="text-[11px] text-muted-foreground">{cls.waliKelas}</div>
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-right text-muted-foreground">
                      {(cls.organicKg || 0).toFixed(1)}
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-right text-muted-foreground">
                      {(cls.plasticKg || 0).toFixed(1)}
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-right text-muted-foreground">
                      {(cls.paperKg || 0).toFixed(1)}
                    </td>
                    <td className="py-3 px-2 sm:px-3 text-right text-muted-foreground">
                      {(cls.b3Kg || 0).toFixed(1)}
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right font-black text-primary">
                      {(cls.totalKg || 0).toFixed(1)} kg
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-right font-black text-foreground">
                      Rp {(cls.balanceRp ?? 0).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted font-black text-foreground border-t">
                <tr>
                  <td colSpan={2} className="py-3 px-3 sm:px-4 text-foreground tracking-wider text-xs">
                    Total Agregat Sekolah
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-right">{totalOrganicKg.toFixed(1)}</td>
                  <td className="py-3 px-2 sm:px-3 text-right">{totalPlasticKg.toFixed(1)}</td>
                  <td className="py-3 px-2 sm:px-3 text-right">{totalPaperKg.toFixed(1)}</td>
                  <td className="py-3 px-2 sm:px-3 text-right">{totalB3Kg.toFixed(1)}</td>
                  <td className="py-3 px-3 sm:px-4 text-right text-primary text-sm">
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
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden space-y-3 p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filter by class */}
            <div className="flex items-center gap-2">
              <label htmlFor="report-class-filter" className="text-xs font-semibold text-muted-foreground">Filter Kelas:</label>
              <select
                id="report-class-filter"
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-border text-xs font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            <div className="relative w-full min-w-0 sm:min-w-[220px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Cari transaksi"
                placeholder="Cari transaksi..."
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-border text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-muted text-muted-foreground font-bold border-b text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-3">Kode Ref / Waktu</th>
                  <th className="py-3 px-3">Kelas & Penyetor</th>
                  <th className="py-3 px-3">Jenis & Kategori</th>
                  <th className="py-3 px-3 text-right">Bobot</th>
                  <th className="py-3 px-3 text-right">Mutasi Kas</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {filteredTransactions.map((t) => {
                  const isDeposit = t.type === 'deposit';
                  return (
                    <tr key={t.id} className="hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-foreground">{t.referenceCode}</div>
                        <div className="text-[11px] text-muted-foreground">{t.timestamp}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-foreground">{t.className}</div>
                        <div className="text-[11px] text-muted-foreground">{t.studentName}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-foreground">
                          {isDeposit ? t.wasteItemName || 'Setor Sampah' : t.description}
                        </div>
                        {t.category && (
                          <span className="text-[10px] text-muted-foreground">{t.category}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right text-foreground">
                        {t.weightKg ? `${t.weightKg} kg` : '-'}
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-black ${
                          isDeposit ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {isDeposit ? '+' : '-'}Rp {t.amountRp.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            t.status === 'berhasil'
                              ? 'bg-secondary text-primary'
                              : t.status === 'diproses'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-destructive/10 text-destructive'
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
        <div className="fixed inset-0 z-50 bg-overlay/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-card rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Header Surat Resmi */}
            <div className="border-b-2 border-foreground pb-4 text-center space-y-1">
              <div className="text-xs font-bold tracking-widest text-muted-foreground">
                Pemerintah Kabupaten Deli Serdang • Dinas Lingkungan Hidup
              </div>
              <h2 className="text-lg sm:text-xl font-black text-foreground">
                Laporan Bulanan Bank Sampah Sekolah Adiwiyata
              </h2>
              <p className="text-xs text-muted-foreground">
                Program Opung Sari Basah Bang 5.0 • Periode Bulan Berjalan 2026
              </p>
            </div>

            {/* Meta data ringkas */}
            <div className="grid grid-cols-2 gap-4 text-xs font-medium border p-3 rounded-xl bg-muted">
              <div>
                <span className="text-muted-foreground block">Unit Madrasah:</span>
                <span className="font-bold text-foreground">MTs Negeri 2 Deli Serdang</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Koordinator Pengesah:</span>
                <span className="font-bold text-foreground">Bapak Suhendra, S.Pd (Koordinator Bank Sampah)</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Total Sampah Terkelola:</span>
                <span className="font-bold text-primary">{totalKgAllClasses.toFixed(1)} Kg</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Total Kas Sirkular:</span>
                <span className="font-bold text-foreground">Rp {totalBalanceAllClasses.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Tabel Cetak */}
            <div className="border rounded-xl overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted font-bold text-foreground border-b">
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
                <p className="text-muted-foreground">Mengetahui,</p>
                <p className="font-bold text-foreground">Kepala Sekolah</p>
                <div className="h-16 flex items-center justify-center text-muted-foreground/60 italic text-[10px]">
                  [Tanda Tangan & Cap Digital]
                </div>
                <p className="font-bold text-foreground underline">Hj. Nurhasanah, M.Pd</p>
                <p className="text-[10px] text-muted-foreground">NIP. 19780512 200212 2 003</p>
              </div>

              <div>
                <p className="text-muted-foreground">Deli Serdang, Bulan Berjalan</p>
                <p className="font-bold text-foreground">Koordinator Bank Sampah</p>
                <div className="h-16 flex items-center justify-center gap-1 text-primary font-bold text-[11px]">
                  <Check size={14} aria-hidden="true" /> Terverifikasi Digital
                </div>
                <p className="font-bold text-foreground underline">Suhendra, S.Pd</p>
                <p className="text-[10px] text-muted-foreground">NIP. 19850314 201001 1 012</p>
              </div>
            </div>

            {/* Action Buttons inside Modal */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="min-h-10 px-4 py-2 rounded-xl border border-border text-foreground text-xs font-bold hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="min-h-10 px-5 py-2 rounded-xl bg-primary hover:bg-primary-active text-primary-foreground text-xs font-black shadow transition-all active:scale-95 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Printer size={15} aria-hidden="true" />
                Cetak Dokumen Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
