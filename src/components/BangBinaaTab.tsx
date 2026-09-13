import React, { useState } from 'react';
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
  Star,
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
    name: 'SMP Negeri 1 Lubuk Pakam',
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
    name: 'SDN 101957 Deli Tua',
    kecamatan: 'Deli Tua',
    adiwiyataStatus: 'Mandiri',
    totalKg: 391.2,
    totalKasRp: 1_420_000,
    partisipasiPersen: 89,
    jumlahKelas: 9,
    jumlahSiswa: 280,
    bulanLaporan: 'Agustus 2026',
    laporanPublished: true,
    binaan: ['sch-6'],
    koordinator: 'Ibu Marlina Tarigan, S.Pd.',
    trendKg: 11,
    organicPersen: 52,
    plasticPersen: 28,
    lisaFreq: 980,
  },
  {
    id: 'sch-3',
    name: 'SMA Negeri 1 Batang Kuis',
    kecamatan: 'Batang Kuis',
    adiwiyataStatus: 'Mandiri',
    totalKg: 318.8,
    totalKasRp: 1_210_000,
    partisipasiPersen: 85,
    jumlahKelas: 10,
    jumlahSiswa: 310,
    bulanLaporan: 'Agustus 2026',
    laporanPublished: true,
    binaan: ['sch-7'],
    koordinator: 'Bpk. Harun Sitompul, S.Pd.',
    trendKg: 8,
    organicPersen: 44,
    plasticPersen: 36,
    lisaFreq: 820,
  },
  {
    id: 'sch-4',
    name: 'MTsN 1 Percut Sei Tuan',
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
    koordinator: 'Ibu Sari Dewi Nasution',
    trendKg: 22,
    organicPersen: 56,
    plasticPersen: 24,
    lisaFreq: 590,
  },
  {
    id: 'sch-5',
    name: 'SDN 101785 Sunggal',
    kecamatan: 'Sunggal',
    adiwiyataStatus: 'Rintisan',
    totalKg: 143.1,
    totalKasRp: 540_000,
    partisipasiPersen: 63,
    jumlahKelas: 6,
    jumlahSiswa: 188,
    bulanLaporan: 'Agustus 2026',
    laporanPublished: false,
    binaan: [],
    koordinator: 'Bpk. Eko Prasetyo, S.Pd.',
    trendKg: 35,
    organicPersen: 60,
    plasticPersen: 20,
    lisaFreq: 340,
  },
  {
    id: 'sch-6',
    name: 'SMP PGRI 1 Beringin',
    kecamatan: 'Beringin',
    adiwiyataStatus: 'Rintisan',
    totalKg: 98.7,
    totalKasRp: 370_000,
    partisipasiPersen: 58,
    jumlahKelas: 5,
    jumlahSiswa: 152,
    bulanLaporan: 'Juli 2026',
    laporanPublished: false,
    binaan: [],
    koordinator: 'Ibu Fitri Anggraini, S.Pd.',
    trendKg: 28,
    organicPersen: 64,
    plasticPersen: 18,
    lisaFreq: 210,
  },
  {
    id: 'sch-7',
    name: 'SDN 104255 Tanjung Morawa',
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
    koordinator: 'Bpk. Rony Hasibuan, S.Pd.',
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
  Nasional: { color: 'text-emerald-800', bg: 'bg-emerald-100', border: 'border-emerald-300', dot: 'bg-emerald-500' },
  Mandiri: { color: 'text-teal-800', bg: 'bg-teal-100', border: 'border-teal-300', dot: 'bg-teal-500' },
  'Tingkat Provinsi': { color: 'text-blue-800', bg: 'bg-blue-100', border: 'border-blue-300', dot: 'bg-blue-500' },
  Rintisan: { color: 'text-amber-800', bg: 'bg-amber-100', border: 'border-amber-300', dot: 'bg-amber-400' },
};

const rankMedal = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

export const BangBinaaTab: React.FC<BangBinaaTabProps> = ({ classes, transactions }) => {
  const [subTab, setSubTab] = useState<'leaderboard' | 'laporan' | 'peta'>('leaderboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [filterAdiwiyata, setFilterAdiwiyata] = useState<string>('all');

  const sortedSchools = [...MOCK_SCHOOLS].sort((a, b) => b.totalKg - a.totalKg);

  const filteredSchools = sortedSchools.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.kecamatan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterAdiwiyata === 'all' || s.adiwiyataStatus === filterAdiwiyata;
    return matchSearch && matchFilter;
  });

  const filteredReports = MOCK_REPORTS.filter((r) =>
    r.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.kecamatan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalKgKabupaten = MOCK_SCHOOLS.reduce((s, c) => s + c.totalKg, 0);
  const totalKasKabupaten = MOCK_SCHOOLS.reduce((s, c) => s + c.totalKasRp, 0);
  const totalSiswa = MOCK_SCHOOLS.reduce((s, c) => s + c.jumlahSiswa, 0);
  const totalLaporanPublished = MOCK_SCHOOLS.filter((s) => s.laporanPublished).length;

  const SUB_TABS = [
    { key: 'leaderboard', label: 'Leaderboard Sekolah', icon: Trophy },
    { key: 'laporan', label: 'Repositori Laporan', icon: BookOpen },
    { key: 'peta', label: 'Peta Pembinaan', icon: Network },
  ] as const;

  return (
    <div className="w-full min-w-0 max-w-5xl mx-auto space-y-4 pb-24 pt-1 md:px-2">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-purple-900 text-white shadow-md p-4 sm:p-5 border border-purple-950">
        <div className="pointer-events-none absolute -right-6 -top-6 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 w-36 h-36 rounded-full bg-purple-400/10 blur-xl" />
        <div className="relative flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-2xl border border-white/20 shadow-inner shrink-0">
              🏫
            </div>
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-800 border border-purple-700 text-purple-200 text-[10px] font-bold mb-1">
                <Globe size={10} /> FR-LEAD-03 · FR-REP-03 · Pembinaan Berjenjang
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white truncate tracking-tight">
                Modul BANG — Pembinaan Berjenjang
              </h2>
              <p className="text-xs text-purple-100/80 font-medium">
                Transparansi &amp; benchmarking ekologis seluruh sekolah Kabupaten Deli Serdang
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-3 py-2 text-center border border-white/10">
              <div className="text-lg font-black text-white">{MOCK_SCHOOLS.length}</div>
              <div className="text-[10px] font-bold text-purple-200 uppercase tracking-wider">Sekolah</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-3 py-2 text-center border border-white/10">
              <div className="text-lg font-black text-white">{totalLaporanPublished}/{MOCK_SCHOOLS.length}</div>
              <div className="text-[10px] font-bold text-purple-200 uppercase tracking-wider">Laporan</div>
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
            <div key={label} className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <Icon size={14} className="text-purple-100" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-purple-200 leading-tight">{label}</div>
                <div className="text-xs font-black text-white">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sub-Tab Nav ── */}
      <div className="flex bg-stone-100 rounded-2xl p-1 gap-1">
        {SUB_TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setSubTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-black transition-all ${
              subTab === key
                ? 'bg-white text-purple-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <Icon size={13} />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* ── Search & Filter ── */}
      {(subTab === 'leaderboard' || subTab === 'laporan') && (
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Cari sekolah atau kecamatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
            />
          </div>
          {subTab === 'leaderboard' && (
            <select
              value={filterAdiwiyata}
              onChange={(e) => setFilterAdiwiyata(e.target.value)}
              className="px-3 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs text-stone-700 font-bold focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
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
          <div className="bg-white rounded-3xl border border-stone-200 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-amber-500" />
              <span className="text-sm font-black text-stone-900">Top 3 Sekolah se-Deli Serdang</span>
              <span className="text-[10px] font-bold text-stone-400 ml-auto">Berdasarkan total kg sampah terpilah</span>
            </div>
            <div className="grid grid-cols-3 gap-2 items-end">
              {[sortedSchools[1], sortedSchools[0], sortedSchools[2]].map((school, podiumIdx) => {
                const actualRank = sortedSchools.indexOf(school) + 1;
                const heights = ['h-24', 'h-32', 'h-20'];
                const bgColors = ['bg-stone-100', 'bg-amber-50', 'bg-orange-50'];
                const borderColors = ['border-stone-200', 'border-amber-300', 'border-orange-200'];
                return (
                  <div key={school.id} className="flex flex-col items-center gap-1">
                    <div className="text-xl">{rankMedal(actualRank)}</div>
                    <div className="text-[10px] font-black text-stone-800 text-center leading-tight line-clamp-2 px-1">
                      {school.name.replace('Negeri', '').replace('SMP', 'SMP').trim()}
                    </div>
                    <div className="text-[10px] font-bold text-stone-500">{school.totalKg.toFixed(0)} kg</div>
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
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-100 flex items-center gap-2">
              <BarChart3 size={14} className="text-purple-600" />
              <span className="text-sm font-black text-stone-900">Peringkat Lengkap</span>
              <span className="ml-auto text-[10px] font-bold text-stone-400">{filteredSchools.length} sekolah</span>
            </div>
            <div className="divide-y divide-stone-100">
              {filteredSchools.map((school, idx) => {
                const rank = sortedSchools.indexOf(school) + 1;
                const cfg = adiwiyataConfig[school.adiwiyataStatus];
                return (
                  <div key={school.id} className="p-3 sm:p-4 hover:bg-stone-50/60 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-sm font-black text-stone-700 shrink-0">
                        {rank <= 3 ? rankMedal(rank) : `#${rank}`}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <div className="text-sm font-black text-stone-900 leading-tight">{school.name}</div>
                            <div className="text-xs text-stone-500 font-medium">Kec. {school.kecamatan} · {school.koordinator}</div>
                          </div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border} shrink-0`}>
                            {school.adiwiyataStatus}
                          </span>
                        </div>

                        {/* Metric Pills */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-xl px-2 py-0.5">
                            <Leaf size={10} className="text-emerald-600" />
                            <span className="text-[10px] font-black text-emerald-800">{school.totalKg.toFixed(1)} kg</span>
                          </div>
                          <div className="flex items-center gap-1 bg-stone-100 border border-stone-200 rounded-xl px-2 py-0.5">
                            <Users size={10} className="text-stone-500" />
                            <span className="text-[10px] font-bold text-stone-700">{school.partisipasiPersen}% aktif</span>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-xl px-2 py-0.5">
                            <TrendingUp size={10} className="text-amber-600" />
                            <span className="text-[10px] font-bold text-amber-800">+{school.trendKg}% MoM</span>
                          </div>
                          {school.laporanPublished ? (
                            <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-xl px-2 py-0.5">
                              <CheckCircle2 size={10} className="text-blue-600" />
                              <span className="text-[10px] font-bold text-blue-800">Laporan Terbit</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-xl px-2 py-0.5">
                              <Clock size={10} className="text-red-400" />
                              <span className="text-[10px] font-bold text-red-700">Belum Laporan</span>
                            </div>
                          )}
                        </div>

                        {/* Progress bar: kg */}
                        <div className="mt-2">
                          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-500 rounded-full transition-all"
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
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-xs text-blue-900">
            <Globe size={15} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold">Repositori Terbuka (FR-REP-03): </span>
              Setiap sekolah dan Dinas dapat mengakses, membaca, dan mengunduh laporan bulanan sekolah lain sebagai referensi praktik terbaik pengelolaan sampah se-Deli Serdang.
            </div>
          </div>

          {/* Published Reports */}
          <div className="space-y-2">
            {filteredReports.length === 0 && (
              <div className="text-center py-10 text-stone-400 text-sm">Tidak ada laporan yang sesuai pencarian.</div>
            )}
            {filteredReports.map((report) => {
              const isExpanded = expandedReport === report.id;
              const school = MOCK_SCHOOLS.find((s) => s.id === report.schoolId)!;
              const cfg = adiwiyataConfig[school.adiwiyataStatus];
              return (
                <div key={report.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                    className="w-full p-4 text-left flex items-start gap-3 hover:bg-stone-50/60 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center shrink-0">
                      <FileText size={18} className="text-purple-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <div className="text-sm font-black text-stone-900">{report.schoolName}</div>
                          <div className="text-xs text-stone-500 font-medium">Kec. {report.kecamatan} · Periode {report.periode}</div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                            {report.adiwiyata}
                          </span>
                          {isExpanded ? <ChevronUp size={14} className="text-stone-400" /> : <ChevronDown size={14} className="text-stone-400" />}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-[10px] font-bold text-stone-500 flex items-center gap-0.5">
                          <Leaf size={9} className="text-emerald-500" /> {report.totalKg.toFixed(1)} kg
                        </span>
                        <span className="text-[10px] font-bold text-stone-500 flex items-center gap-0.5">
                          <Users size={9} /> {report.partisipasi}% partisipasi
                        </span>
                        <span className="text-[10px] font-bold text-stone-500 flex items-center gap-0.5">
                          <CheckCircle2 size={9} className="text-blue-500" /> Diterbitkan {report.publishedAt}
                        </span>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-stone-100 pt-3">
                      <p className="text-xs text-stone-700 leading-relaxed">{report.summary}</p>

                      {/* Detail Metrics */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Organik', value: `${school.organicPersen}%`, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
                          { label: 'Plastik', value: `${school.plasticPersen}%`, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
                          { label: 'LISA Freq.', value: `${school.lisaFreq}x`, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
                        ].map(({ label, value, color, bg, border }) => (
                          <div key={label} className={`${bg} ${border} border rounded-xl p-2 text-center`}>
                            <div className={`text-sm font-black ${color}`}>{value}</div>
                            <div className="text-[10px] font-bold text-stone-500">{label}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-black transition-all active:scale-95">
                          <Download size={13} /> Unduh PDF Laporan
                        </button>
                        <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all active:scale-95">
                          <ArrowUpRight size={13} /> Detail
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
              <Clock size={15} className="text-amber-600" />
              Sekolah Belum Menerbitkan Laporan ({MOCK_SCHOOLS.filter((s) => !s.laporanPublished).length})
            </div>
            <div className="space-y-1.5">
              {MOCK_SCHOOLS.filter((s) => !s.laporanPublished).map((school) => (
                <div key={school.id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-amber-200">
                  <div>
                    <div className="text-xs font-black text-stone-900">{school.name}</div>
                    <div className="text-[10px] text-stone-500">Laporan terakhir: {school.bulanLaporan}</div>
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
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl flex items-start gap-2.5 text-xs text-purple-900">
            <Handshake size={15} className="text-purple-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold">Pembinaan Berjenjang (BANG): </span>
              Sekolah yang telah mencapai kategori Adiwiyata Nasional / Mandiri memiliki tanggung jawab moral dan fungsional untuk membina sekolah rintisan, menciptakan efek multiplikatif kesadaran lingkungan di Deli Serdang.
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 p-3 bg-white rounded-2xl border border-stone-200">
            {(Object.entries(adiwiyataConfig) as [MockSchool['adiwiyataStatus'], typeof adiwiyataConfig[keyof typeof adiwiyataConfig]][]).map(([status, cfg]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                <span className="text-[10px] font-bold text-stone-600">{status}</span>
              </div>
            ))}
          </div>

          {/* Mentor-Binaan Cards */}
          {MOCK_SCHOOLS.filter((s) => s.binaan.length > 0).map((mentor) => {
            const cfgMentor = adiwiyataConfig[mentor.adiwiyataStatus];
            return (
              <div key={mentor.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                {/* Mentor Header */}
                <div className="p-4 flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${cfgMentor.bg} border ${cfgMentor.border}`}>
                    <Star size={18} className={cfgMentor.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <div className="text-sm font-black text-stone-900">{mentor.name}</div>
                        <div className="text-xs text-stone-500 font-medium">Kec. {mentor.kecamatan} · {mentor.koordinator}</div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${cfgMentor.bg} ${cfgMentor.color} ${cfgMentor.border} shrink-0`}>
                        {mentor.adiwiyataStatus}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-xl px-2 py-0.5">
                        <Leaf size={10} className="text-emerald-600" />
                        <span className="text-[10px] font-black text-emerald-800">{mentor.totalKg.toFixed(1)} kg</span>
                      </div>
                      <div className="flex items-center gap-1 bg-purple-50 border border-purple-200 rounded-xl px-2 py-0.5">
                        <Handshake size={10} className="text-purple-600" />
                        <span className="text-[10px] font-bold text-purple-800">Membina {mentor.binaan.length} sekolah</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector Line visual */}
                <div className="px-4 pb-1">
                  <div className="ml-5 border-l-2 border-dashed border-stone-200 space-y-2 pl-4">
                    {mentor.binaan.map((binaanId) => {
                      const binaanSchool = MOCK_SCHOOLS.find((s) => s.id === binaanId)!;
                      const cfgBinaan = adiwiyataConfig[binaanSchool.adiwiyataStatus];
                      return (
                        <div key={binaanId} className="relative">
                          <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-4 border-t-2 border-dashed border-stone-300" />
                          <div className={`rounded-2xl border ${cfgBinaan.border} ${cfgBinaan.bg} p-3 flex items-center gap-3`}>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-white border ${cfgBinaan.border}`}>
                              <Building2 size={14} className={cfgBinaan.color} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`text-xs font-black ${cfgBinaan.color} leading-tight`}>{binaanSchool.name}</div>
                              <div className="text-[10px] text-stone-500 font-medium">Kec. {binaanSchool.kecamatan}</div>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="text-[10px] font-bold text-stone-500">{binaanSchool.totalKg.toFixed(1)} kg</span>
                                <span className="text-[10px] text-stone-400">·</span>
                                <span className="text-[10px] font-bold text-stone-500">{binaanSchool.partisipasiPersen}% aktif</span>
                                <span className="text-[10px] text-stone-400">·</span>
                                <span className={`text-[10px] font-bold ${binaanSchool.laporanPublished ? 'text-emerald-700' : 'text-amber-700'}`}>
                                  {binaanSchool.laporanPublished ? 'Laporan Terbit' : 'Belum Laporan'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-amber-700 shrink-0">
                              <TrendingUp size={12} />
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
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-black text-stone-600 flex items-center gap-1.5">
                <Clock size={13} className="text-stone-400" />
                Sekolah Rintisan — Menunggu Penugasan Pembina
              </div>
              {MOCK_SCHOOLS.filter(
                (s) => s.adiwiyataStatus === 'Rintisan' && !MOCK_SCHOOLS.some((m) => m.binaan.includes(s.id))
              ).map((school) => (
                <div key={school.id} className="bg-white rounded-xl border border-stone-200 px-3 py-2 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-stone-800">{school.name}</div>
                    <div className="text-[10px] text-stone-500">Kec. {school.kecamatan}</div>
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
