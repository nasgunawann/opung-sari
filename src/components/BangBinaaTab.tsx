import React, { useState, useMemo } from 'react';
import {
  Trophy,
  BookOpen,
  Network,
  TrendingUp,
  CheckCircle2,
  Clock,
  Download,
  Search,
  Leaf,
  Award,
  School,
  Users,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Building2,
  FileText,
  Globe,
  Handshake,
  ArrowUpRight,
} from 'lucide-react';
import { SchoolClass, BankTransaction } from '../types';

interface BangBinaaTabProps {
  classes: SchoolClass[];
  transactions: BankTransaction[];
  currentSchoolId?: string;
}

interface MockSchool {
  id: string;
  name: string;
  kecamatan: string;
  adiwiyataStatus: 'Nasional' | 'Mandiri' | 'Tingkat Provinsi' | 'Rintisan';
  totalKg: number;
  totalKasRp: number;
  partisipasiPersen: number;
  jumlahKelas: number;
  jumlahSiswa: number;
  bulanLaporan: string;
  laporanPublished: boolean;
  binaan: string[];
  koordinator: string;
  trendKg: number;
  organicPersen: number;
  plasticPersen: number;
  lisaFreq: number;
}

interface MockReport {
  id: string;
  schoolId: string;
  schoolName: string;
  kecamatan: string;
  periode: string;
  totalKg: number;
  totalKasRp: number;
  partisipasi: number;
  adiwiyata: string;
  publishedAt: string;
  summary: string;
}

const MOCK_SCHOOLS: MockSchool[] = [
  {
    id: 'sch-1',
    name: 'MTs Negeri 2 Deli Serdang',
    kecamatan: 'Lubuk Pakam',
    adiwiyataStatus: 'Nasional',
    totalKg: 482.5,
    totalKasRp: 1_850_000,
    partisipasiPersen: 94,
    jumlahKelas: 12,
    jumlahSiswa: 384,
    bulanLaporan: 'Agustus 2026',
    laporanPublished: true,
    binaan: ['sch-4', 'sch-5'],
    koordinator: 'Drs. Rudi Sinaga, M.Pd.',
    trendKg: 18,
    organicPersen: 48,
    plasticPersen: 32,
    lisaFreq: 1240,
  },
  {
    id: 'sch-2',
    name: 'MTs Negeri 1 Deli Serdang',
    kecamatan: 'Tanjung Morawa',
    adiwiyataStatus: 'Mandiri',
    totalKg: 391.2,
    totalKasRp: 1_420_000,
    partisipasiPersen: 89,
    jumlahKelas: 9,
    jumlahSiswa: 280,
    bulanLaporan: 'Agustus 2026',
    laporanPublished: true,
    binaan: ['sch-6'],
    koordinator: 'Ibu Marlina Tarigan, S.Pd.I.',
    trendKg: 11,
    organicPersen: 52,
    plasticPersen: 28,
    lisaFreq: 980,
  },
  {
    id: 'sch-3',
    name: 'MTs Negeri 3 Deli Serdang',
    kecamatan: 'Hamparan Perak',
    adiwiyataStatus: 'Mandiri',
    totalKg: 318.8,
    totalKasRp: 1_210_000,
    partisipasiPersen: 85,
    jumlahKelas: 10,
    jumlahSiswa: 310,
    bulanLaporan: 'Agustus 2026',
    laporanPublished: true,
    binaan: ['sch-7'],
    koordinator: 'Bpk. Harun Sitompul, S.Pd.I.',
    trendKg: 8,
    organicPersen: 44,
    plasticPersen: 36,
    lisaFreq: 820,
  },
  {
    id: 'sch-4',
    name: 'MTsS Al-Ittihadiyah Percut',
    kecamatan: 'Percut Sei Tuan',
    adiwiyataStatus: 'Tingkat Provinsi',
    totalKg: 228.4,
    totalKasRp: 870_000,
    partisipasiPersen: 78,
    jumlahKelas: 8,
    jumlahSiswa: 245,
    bulanLaporan: 'Agustus 2026',
    laporanPublished: true,
    binaan: [],
    koordinator: 'Ibu Sari Dewi Nasution, S.Pd.',
    trendKg: 22,
    organicPersen: 56,
    plasticPersen: 24,
    lisaFreq: 590,
  },
  {
    id: 'sch-5',
    name: 'MTsS Al Washliyah Lubuk Pakam',
    kecamatan: 'Lubuk Pakam',
    adiwiyataStatus: 'Rintisan',
    totalKg: 143.1,
    totalKasRp: 540_000,
    partisipasiPersen: 63,
    jumlahKelas: 6,
    jumlahSiswa: 188,
    bulanLaporan: 'Agustus 2026',
    laporanPublished: false,
    binaan: [],
    koordinator: 'Bpk. Eko Prasetyo, S.Pd.I.',
    trendKg: 35,
    organicPersen: 60,
    plasticPersen: 20,
    lisaFreq: 340,
  },
  {
    id: 'sch-6',
    name: 'MTsS Al Washliyah Tanjung Morawa',
    kecamatan: 'Tanjung Morawa',
    adiwiyataStatus: 'Rintisan',
    totalKg: 98.7,
    totalKasRp: 370_000,
    partisipasiPersen: 58,
    jumlahKelas: 5,
    jumlahSiswa: 152,
    bulanLaporan: 'Juli 2026',
    laporanPublished: false,
    binaan: [],
    koordinator: 'Ibu Fitri Anggraini, S.Pd.I.',
    trendKg: 28,
    organicPersen: 64,
    plasticPersen: 18,
    lisaFreq: 210,
  },
  {
    id: 'sch-7',
    name: 'MTsS Hidayatullah Tanjung Morawa',
    kecamatan: 'Tanjung Morawa',
    adiwiyataStatus: 'Rintisan',
    totalKg: 76.3,
    totalKasRp: 280_000,
    partisipasiPersen: 51,
    jumlahKelas: 5,
    jumlahSiswa: 160,
    bulanLaporan: 'Juli 2026',
    laporanPublished: false,
    binaan: [],
    koordinator: 'Bpk. Rony Hasibuan, S.Pd.I.',
    trendKg: 42,
    organicPersen: 58,
    plasticPersen: 22,
    lisaFreq: 160,
  },
];

const MOCK_REPORTS: MockReport[] = MOCK_SCHOOLS.filter((s) => s.laporanPublished).map((s) => ({
  id: `rep-${s.id}`,
  schoolId: s.id,
  schoolName: s.name,
  kecamatan: s.kecamatan,
  periode: s.bulanLaporan,
  totalKg: s.totalKg,
  totalKasRp: s.totalKasRp,
  partisipasi: s.partisipasiPersen,
  adiwiyata: s.adiwiyataStatus,
  publishedAt: '3 Sep 2026',
  summary: `${s.name} berhasil mereduksi ${s.totalKg.toFixed(1)} kg sampah terpilah pada periode ${s.bulanLaporan} dengan tingkat partisipasi kelas ${s.partisipasiPersen}%. Program habituasi LISA berjalan aktif dengan ${s.lisaFreq} log pembuangan terdaftar di sistem IoT.`,
}));

const adiwiyataConfig: Record<MockSchool['adiwiyataStatus'], { color: string; bg: string; border: string; dot: string }> = {
  Nasional: { color: 'text-primary', bg: 'bg-secondary', border: 'border-border', dot: 'bg-primary' },
  Mandiri: { color: 'text-primary', bg: 'bg-accent', border: 'border-border', dot: 'bg-primary' },
  'Tingkat Provinsi': { color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border', dot: 'bg-muted-foreground' },
  Rintisan: { color: 'text-amber-800', bg: 'bg-amber-100', border: 'border-amber-300', dot: 'bg-amber-400' },
};

const rankMedal = (rank: number) => `#${rank}`;

export const BangBinaaTab: React.FC<BangBinaaTabProps> = ({ classes, transactions, currentSchoolId = 'sch-1' }) => {
  const [subTab, setSubTab] = useState<'leaderboard' | 'laporan' | 'peta'>('leaderboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [filterAdiwiyata, setFilterAdiwiyata] = useState<string>('all');

  const sortedSchools = useMemo(
    () => [...MOCK_SCHOOLS].sort((a, b) => b.totalKg - a.totalKg),
    [],
  );

  const filteredSchools = useMemo(
    () =>
      sortedSchools.filter((s) => {
        const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.kecamatan.toLowerCase().includes(searchQuery.toLowerCase());
        const matchFilter = filterAdiwiyata === 'all' || s.adiwiyataStatus === filterAdiwiyata;
        return matchSearch && matchFilter;
      }),
    [sortedSchools, searchQuery, filterAdiwiyata],
  );

  const filteredReports = MOCK_REPORTS.filter((r) =>
    r.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.kecamatan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalKgKabupaten = MOCK_SCHOOLS.reduce((s, c) => s + c.totalKg, 0);
  const totalKasKabupaten = MOCK_SCHOOLS.reduce((s, c) => s + c.totalKasRp, 0);
  const totalSiswa = MOCK_SCHOOLS.reduce((s, c) => s + c.jumlahSiswa, 0);
  const totalLaporanPublished = MOCK_SCHOOLS.filter((s) => s.laporanPublished).length;

  const SUB_TABS = [
    { key: 'leaderboard', label: 'Peringkat Sekolah', icon: Trophy },
    { key: 'laporan', label: 'Repositori Laporan', icon: BookOpen },
    { key: 'peta', label: 'Peta Pembinaan', icon: Network },
  ] as const;

  return (
    <div className="w-full min-w-0 max-w-5xl mx-auto space-y-4 pb-24 pt-1 md:px-2">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-md p-4 sm:p-5 border border-border">
        <div className="relative flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-primary-foreground/15 flex items-center justify-center border border-primary-foreground/20 shadow-inner shrink-0">
              <School size={22} className="text-primary-foreground" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-extrabold text-primary-foreground truncate tracking-tight">
                Modul BANG (Pembinaan Berjenjang)
              </h2>
              <p className="text-xs text-primary-foreground/80 font-medium">
                Transparansi &amp; tolok ukur ekologis seluruh sekolah Kabupaten Deli Serdang
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 shrink-0">
            <div className="bg-primary-foreground/10 rounded-2xl px-3 py-2 text-center border border-primary-foreground/10">
              <div className="text-lg font-black text-primary-foreground">{MOCK_SCHOOLS.length}</div>
              <div className="text-[10px] font-bold text-primary-foreground/70">Sekolah</div>
            </div>
            <div className="bg-primary-foreground/10 rounded-2xl px-3 py-2 text-center border border-primary-foreground/10">
              <div className="text-lg font-black text-primary-foreground">{totalLaporanPublished}/{MOCK_SCHOOLS.length}</div>
              <div className="text-[10px] font-bold text-primary-foreground/70">Laporan</div>
            </div>
          </div>
        </div>

        {/* 4 KPI Pills */}
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          {[
            { label: 'Total Reduksi Sampah', value: `${totalKgKabupaten.toFixed(0)} kg`, icon: Leaf },
            { label: 'Kas Sirkular Kabupaten', value: `Rp ${(totalKasKabupaten / 1_000_000).toFixed(2)}jt`, icon: TrendingUp },
            { label: 'Total Siswa Terdaftar', value: `${totalSiswa}`, icon: Users },
            { label: 'Sekolah Adiwiyata', value: `${MOCK_SCHOOLS.filter((s) => s.adiwiyataStatus !== 'Rintisan').length} Aktif`, icon: Award },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-primary-foreground/10 rounded-2xl p-2.5 border border-primary-foreground/10 flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-primary-foreground/15 flex items-center justify-center shrink-0">
                <Icon size={14} className="text-primary-foreground" aria-hidden="true" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-primary-foreground/70 leading-tight">{label}</div>
                <div className="text-xs font-black text-primary-foreground">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sub-Tab Nav ── */}
      <div className="flex bg-muted rounded-2xl p-1 gap-1">
        {SUB_TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setSubTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 h-10 px-2 rounded-xl text-xs font-black transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              subTab === key
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon size={13} aria-hidden="true" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* ── Search & Filter ── */}
      {(subTab === 'leaderboard' || subTab === 'laporan') && (
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="text"
              aria-label="Cari sekolah atau kecamatan"
              placeholder="Cari sekolah atau kecamatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 rounded-2xl border border-border bg-card text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
            />
          </div>
          {subTab === 'leaderboard' && (
            <select
              aria-label="Filter status Adiwiyata"
              value={filterAdiwiyata}
              onChange={(e) => setFilterAdiwiyata(e.target.value)}
              className="px-3 py-2.5 rounded-2xl border border-border bg-card text-xs text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
            >
              <option value="all">Semua Status</option>
              <option value="Nasional">Adiwiyata Nasional</option>
              <option value="Mandiri">Adiwiyata Mandiri</option>
              <option value="Tingkat Provinsi">Tingkat Provinsi</option>
              <option value="Rintisan">Rintisan</option>
            </select>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════
          SUB-TAB 1: LEADERBOARD ANTAR-SEKOLAH
      ══════════════════════════════════════════════ */}
      {subTab === 'leaderboard' && (
        <div className="space-y-3">
          {/* Top-3 Podium */}
          <div className="bg-card rounded-3xl border border-border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-amber-500" aria-hidden="true" />
              <span className="text-sm font-black text-foreground">3 Sekolah Teratas se-Deli Serdang</span>
              <span className="text-[10px] font-bold text-muted-foreground ml-auto">Berdasarkan total kg sampah terpilah</span>
            </div>
            <div className="grid grid-cols-3 gap-2 items-end">
              {[sortedSchools[1], sortedSchools[0], sortedSchools[2]].map((school, podiumIdx) => {
                const actualRank = sortedSchools.indexOf(school) + 1;
                const heights = ['h-24', 'h-32', 'h-20'];
                const bgColors = ['bg-muted', 'bg-amber-50', 'bg-amber-100'];
                const borderColors = ['border-border', 'border-amber-300', 'border-amber-200'];
                return (
                  <div key={school.id} className="flex flex-col items-center gap-1">
                    <div className="text-xl">{rankMedal(actualRank)}</div>
                    <div className="text-[10px] font-black text-foreground text-center leading-tight line-clamp-2 px-1">
                      {school.name.replace('Negeri', '').replace('SMP', 'SMP').trim()}
                    </div>
                    {school.id === currentSchoolId && (
                      <span className="bg-secondary text-primary text-[8px] font-black px-1 py-0.5 rounded mb-0.5">Sekolah Anda</span>
                    )}
                    <div className="text-[10px] font-bold text-muted-foreground">{school.totalKg.toFixed(0)} kg</div>
                    <div
                      className={`w-full rounded-t-2xl border-t-2 border-x-2 ${heights[podiumIdx]} ${bgColors[podiumIdx]} ${borderColors[podiumIdx]} flex items-end justify-center pb-2`}
                    >
                      <span className={`text-xs font-black ${adiwiyataConfig[school.adiwiyataStatus].color}`}>
                        {school.adiwiyataStatus}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full Ranked List */}
          <div className="bg-card rounded-3xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <BarChart3 size={14} className="text-primary" aria-hidden="true" />
              <span className="text-sm font-black text-foreground">Peringkat Lengkap</span>
              <span className="ml-auto text-[10px] font-bold text-muted-foreground">{filteredSchools.length} sekolah</span>
            </div>
            <div className="divide-y divide-border">
              {filteredSchools.map((school, idx) => {
                const rank = sortedSchools.indexOf(school) + 1;
                const cfg = adiwiyataConfig[school.adiwiyataStatus];
                return (
                  <div key={school.id} className={`p-3 sm:p-4 transition-colors ${school.id === currentSchoolId ? 'bg-secondary/50' : 'hover:bg-muted/60'}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center text-sm font-black text-foreground shrink-0">
                        {rankMedal(rank)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-black text-foreground leading-tight">{school.name}</div>
                              {school.id === currentSchoolId && (
                                <span className="bg-secondary text-primary text-[9px] font-black px-1.5 py-0.5 rounded">Sekolah Anda</span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground font-medium mt-0.5">Kec. {school.kecamatan} · {school.koordinator}</div>
                          </div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border} shrink-0`}>
                            {school.adiwiyataStatus}
                          </span>
                        </div>

                        {/* Metric Pills */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <div className="flex items-center gap-1 bg-secondary border border-border rounded-xl px-2 py-0.5">
                            <Leaf size={10} className="text-primary" aria-hidden="true" />
                            <span className="text-[10px] font-black text-primary">{school.totalKg.toFixed(1)} kg</span>
                          </div>
                          <div className="flex items-center gap-1 bg-muted border border-border rounded-xl px-2 py-0.5">
                            <Users size={10} className="text-muted-foreground" aria-hidden="true" />
                            <span className="text-[10px] font-bold text-foreground">{school.partisipasiPersen}% aktif</span>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-xl px-2 py-0.5">
                            <TrendingUp size={10} className="text-amber-600" aria-hidden="true" />
                            <span className="text-[10px] font-bold text-amber-800">+{school.trendKg}% dari bulan lalu</span>
                          </div>
                          {school.laporanPublished ? (
                            <div className="flex items-center gap-1 bg-secondary border border-border rounded-xl px-2 py-0.5">
                              <CheckCircle2 size={10} className="text-primary" aria-hidden="true" />
                              <span className="text-[10px] font-bold text-primary">Laporan Terbit</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 bg-destructive/10 border border-destructive/30 rounded-xl px-2 py-0.5">
                              <Clock size={10} className="text-destructive" aria-hidden="true" />
                              <span className="text-[10px] font-bold text-destructive">Belum Laporan</span>
                            </div>
                          )}
                        </div>

                        {/* Progress bar: kg */}
                        <div className="mt-2">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-[width]"
                              style={{ width: `${Math.min(100, (school.totalKg / sortedSchools[0].totalKg) * 100).toFixed(1)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          SUB-TAB 2: REPOSITORI LAPORAN TERBUKA
      ══════════════════════════════════════════════ */}
      {subTab === 'laporan' && (
        <div className="space-y-3">
          {/* Info Strip */}
          <div className="p-3 bg-secondary border border-border rounded-2xl flex items-start gap-2.5 text-xs text-foreground">
            <Globe size={15} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-extrabold">Repositori Terbuka (FR-REP-03): </span>
              Setiap sekolah dan Dinas dapat mengakses, membaca, dan mengunduh laporan bulanan sekolah lain sebagai referensi praktik terbaik pengelolaan sampah se-Deli Serdang.
            </div>
          </div>

          {/* Published Reports */}
          <div className="space-y-2">
            {filteredReports.length === 0 && (
              <div className="text-center py-10 text-muted-foreground text-sm">Tidak ada laporan yang sesuai pencarian.</div>
            )}
            {filteredReports.map((report) => {
              const isExpanded = expandedReport === report.id;
              const school = MOCK_SCHOOLS.find((s) => s.id === report.schoolId)!;
              const cfg = adiwiyataConfig[school.adiwiyataStatus];
              return (
                <div key={report.id} className={`rounded-2xl border overflow-hidden ${report.schoolId === currentSchoolId ? 'bg-secondary/30 border-border' : 'bg-card border-border'}`}>
                  <button
                    type="button"
                    onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring ${report.schoolId === currentSchoolId ? 'hover:bg-secondary' : 'hover:bg-muted/60'}`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-secondary border border-border flex items-center justify-center shrink-0">
                      <FileText size={18} className="text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-black text-foreground">{report.schoolName}</div>
                            {report.schoolId === currentSchoolId && (
                                <span className="bg-secondary text-primary text-[9px] font-black px-1.5 py-0.5 rounded">Sekolah Anda</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground font-medium mt-0.5">Kec. {report.kecamatan} · Periode {report.periode}</div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                            {report.adiwiyata}
                          </span>
                          {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" aria-hidden="true" /> : <ChevronDown size={14} className="text-muted-foreground" aria-hidden="true" />}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-0.5">
                          <Leaf size={9} className="text-primary" aria-hidden="true" /> {report.totalKg.toFixed(1)} kg
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-0.5">
                          <Users size={9} aria-hidden="true" /> {report.partisipasi}% partisipasi
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-0.5">
                          <CheckCircle2 size={9} className="text-primary" aria-hidden="true" /> Diterbitkan {report.publishedAt}
                        </span>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                      <p className="text-xs text-foreground leading-relaxed">{report.summary}</p>

                      {/* Detail Metrics */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Organik', value: `${school.organicPersen}%`, color: 'text-primary', bg: 'bg-secondary', border: 'border-border' },
                          { label: 'Plastik', value: `${school.plasticPersen}%`, color: 'text-foreground', bg: 'bg-muted', border: 'border-border' },
                          { label: 'Frekuensi LISA', value: `${school.lisaFreq}x`, color: 'text-foreground', bg: 'bg-muted', border: 'border-border' },
                        ].map(({ label, value, color, bg, border }) => (
                          <div key={label} className={`${bg} ${border} border rounded-xl p-2 text-center`}>
                            <div className={`text-sm font-black ${color}`}>{value}</div>
                            <div className="text-[10px] font-bold text-muted-foreground">{label}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="flex-1 flex items-center justify-center gap-1.5 min-h-10 py-2 rounded-xl bg-primary hover:bg-primary-active text-primary-foreground text-xs font-black transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Download size={13} aria-hidden="true" /> Unduh PDF Laporan
                        </button>
                        <button
                          type="button"
                          className="flex items-center justify-center gap-1.5 px-3 min-h-10 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-bold transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <ArrowUpRight size={13} aria-hidden="true" /> Detail
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Belum Laporan Section */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-black text-amber-900">
              <Clock size={15} className="text-amber-600" aria-hidden="true" />
              Sekolah Belum Menerbitkan Laporan ({MOCK_SCHOOLS.filter((s) => !s.laporanPublished).length})
            </div>
            <div className="space-y-1.5">
              {MOCK_SCHOOLS.filter((s) => !s.laporanPublished).map((school) => (
                <div key={school.id} className={`flex items-center justify-between rounded-xl px-3 py-2 border ${school.id === currentSchoolId ? 'bg-secondary border-border' : 'bg-card border-amber-200'}`}>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <div className="text-xs font-black text-foreground">{school.name}</div>
                      {school.id === currentSchoolId && (
                        <span className="bg-secondary text-primary text-[8px] font-black px-1 py-0.5 rounded">Sekolah Anda</span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Laporan terakhir: {school.bulanLaporan}</div>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${adiwiyataConfig[school.adiwiyataStatus].bg} ${adiwiyataConfig[school.adiwiyataStatus].color} ${adiwiyataConfig[school.adiwiyataStatus].border}`}>
                    {school.adiwiyataStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          SUB-TAB 3: PETA PEMBINAAN BERJENJANG
      ══════════════════════════════════════════════ */}
      {subTab === 'peta' && (
        <div className="space-y-3">
          {/* Info */}
          <div className="p-3 bg-secondary border border-border rounded-2xl flex items-start gap-2.5 text-xs text-foreground">
            <Handshake size={15} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-extrabold">Pembinaan Berjenjang (BANG): </span>
              Sekolah yang telah mencapai kategori Adiwiyata Nasional / Mandiri memiliki tanggung jawab moral dan fungsional untuk membina sekolah rintisan, menciptakan efek multiplikatif kesadaran lingkungan di Deli Serdang.
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 p-3 bg-card rounded-2xl border border-border">
            {(Object.entries(adiwiyataConfig) as [MockSchool['adiwiyataStatus'], typeof adiwiyataConfig[keyof typeof adiwiyataConfig]][]).map(([status, cfg]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                <span className="text-[10px] font-bold text-muted-foreground">{status}</span>
              </div>
            ))}
          </div>

          {/* Mentor-Binaan Cards */}
          {MOCK_SCHOOLS.filter((s) => s.binaan.length > 0).map((mentor) => {
            const cfgMentor = adiwiyataConfig[mentor.adiwiyataStatus];
            return (
              <div key={mentor.id} className={`rounded-2xl border overflow-hidden ${mentor.id === currentSchoolId ? 'bg-secondary/30 border-border' : 'bg-card border-border'}`}>
                {/* Mentor Header */}
                <div className="p-4 flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${cfgMentor.bg} border ${cfgMentor.border}`}>
                    <Award size={18} className={cfgMentor.color} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-black text-foreground">{mentor.name}</div>
                          {mentor.id === currentSchoolId && (
                            <span className="bg-secondary text-primary text-[9px] font-black px-1.5 py-0.5 rounded">Sekolah Anda</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium mt-0.5">Kec. {mentor.kecamatan} · {mentor.koordinator}</div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${cfgMentor.bg} ${cfgMentor.color} ${cfgMentor.border} shrink-0`}>
                        {mentor.adiwiyataStatus}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <div className="flex items-center gap-1 bg-secondary border border-border rounded-xl px-2 py-0.5">
                        <Leaf size={10} className="text-primary" aria-hidden="true" />
                        <span className="text-[10px] font-black text-primary">{mentor.totalKg.toFixed(1)} kg</span>
                      </div>
                      <div className="flex items-center gap-1 bg-secondary border border-border rounded-xl px-2 py-0.5">
                        <Handshake size={10} className="text-primary" aria-hidden="true" />
                        <span className="text-[10px] font-bold text-primary">Membina {mentor.binaan.length} sekolah</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector Line visual */}
                <div className="px-4 pb-1">
                  <div className="ml-5 border-l-2 border-dashed border-border space-y-2 pl-4">
                    {mentor.binaan.map((binaanId) => {
                      const binaanSchool = MOCK_SCHOOLS.find((s) => s.id === binaanId)!;
                      const cfgBinaan = adiwiyataConfig[binaanSchool.adiwiyataStatus];
                      return (
                        <div key={binaanId} className="relative">
                          <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-4 border-t-2 border-dashed border-border" />
                          <div className={`rounded-2xl border ${cfgBinaan.border} ${binaanSchool.id === currentSchoolId ? 'bg-secondary border-border' : cfgBinaan.bg} p-3 flex items-center gap-3`}>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-card border ${cfgBinaan.border}`}>
                              <Building2 size={14} className={cfgBinaan.color} aria-hidden="true" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <div className={`text-xs font-black ${cfgBinaan.color} leading-tight`}>{binaanSchool.name}</div>
                                {binaanSchool.id === currentSchoolId && (
                                  <span className="bg-secondary text-primary text-[8px] font-black px-1 py-0.5 rounded">Sekolah Anda</span>
                                )}
                              </div>
                              <div className="text-[10px] text-muted-foreground font-medium mt-0.5">Kec. {binaanSchool.kecamatan}</div>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="text-[10px] font-bold text-muted-foreground">{binaanSchool.totalKg.toFixed(1)} kg</span>
                                <span className="text-[10px] text-muted-foreground">·</span>
                                <span className="text-[10px] font-bold text-muted-foreground">{binaanSchool.partisipasiPersen}% aktif</span>
                                <span className="text-[10px] text-muted-foreground">·</span>
                                <span className={`text-[10px] font-bold ${binaanSchool.laporanPublished ? 'text-primary' : 'text-amber-700'}`}>
                                  {binaanSchool.laporanPublished ? 'Laporan Terbit' : 'Belum Laporan'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-amber-700 shrink-0">
                              <TrendingUp size={12} aria-hidden="true" />
                              <span className="text-[10px] font-black">+{binaanSchool.trendKg}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="h-4" />
              </div>
            );
          })}

          {/* Sekolah Rintisan tanpa pembina */}
          {MOCK_SCHOOLS.filter((s) => s.adiwiyataStatus === 'Rintisan' && !MOCK_SCHOOLS.some((m) => m.binaan.includes(s.id))).length > 0 && (
            <div className="bg-muted border border-border rounded-2xl p-4 space-y-2">
              <div className="text-xs font-black text-muted-foreground flex items-center gap-1.5">
                <Clock size={13} className="text-muted-foreground" aria-hidden="true" />
                Sekolah Rintisan — Menunggu Penugasan Pembina
              </div>
              {MOCK_SCHOOLS.filter(
                (s) => s.adiwiyataStatus === 'Rintisan' && !MOCK_SCHOOLS.some((m) => m.binaan.includes(s.id))
              ).map((school) => (
                <div key={school.id} className={`rounded-xl border ${school.id === currentSchoolId ? 'bg-secondary border-border' : 'bg-card border-border'} px-3 py-2 flex items-center justify-between`}>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <div className="text-xs font-black text-foreground">{school.name}</div>
                      {school.id === currentSchoolId && (
                        <span className="bg-secondary text-primary text-[8px] font-black px-1 py-0.5 rounded">Sekolah Anda</span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Kec. {school.kecamatan}</div>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${adiwiyataConfig[school.adiwiyataStatus].bg} ${adiwiyataConfig[school.adiwiyataStatus].color} ${adiwiyataConfig[school.adiwiyataStatus].border}`}>
                    Rintisan
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
