import React from 'react';
import { SchoolClass, BankTransaction } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart3, TrendingUp, Users, Download, Leaf, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface AdminTabProps {
  classes: SchoolClass[];
  transactions: BankTransaction[];
}

export const AdminTab: React.FC<AdminTabProps> = ({ classes, transactions }) => {
  const totalKg = classes.reduce((acc, c) => acc + c.totalKg, 0);
  const totalStudents = classes.reduce((acc, c) => acc + c.totalStudents, 0);
  const activeStudents = classes.reduce((acc, c) => acc + c.activeStudents, 0);
  
  const totalBalance = transactions
    .filter(t => t.type === 'deposit')
    .reduce((acc, t) => acc + t.amountRp, 0) - 
    transactions
    .filter(t => t.type === 'withdrawal')
    .reduce((acc, t) => acc + t.amountRp, 0);

  const organicKg = classes.reduce((acc, c) => acc + c.organicKg, 0);
  const plasticKg = classes.reduce((acc, c) => acc + c.plasticKg, 0);

  return (
      <div className="w-full py-6 px-4 md:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <Building2 className="text-purple-600" />
            Dashboard Kabupaten
          </h2>
          <p className="text-stone-500">Agregasi performa ekologis tingkat instansi/sekolah.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download size={16} />
          Unduh Laporan Bulanan
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Sampah Tereduksi</CardDescription>
            <CardTitle className="text-3xl text-stone-900 flex items-center gap-2">
              {totalKg.toFixed(1)} <span className="text-lg text-stone-500 font-normal">kg</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
              <TrendingUp size={14} /> +12% dari bulan lalu
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Partisipasi Siswa</CardDescription>
            <CardTitle className="text-3xl text-stone-900">
              {Math.round((activeStudents / totalStudents) * 100)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-stone-500 mt-1">
              {activeStudents} dari {totalStudents} siswa aktif menyetor
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Kas Sekolah</CardDescription>
            <CardTitle className="text-3xl text-emerald-700">
              Rp {(totalBalance / 1000).toFixed(0)}k
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-stone-500 mt-1">
              Akumulasi dari {classes.length} kelas terdaftar
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rasio Pemilahan</CardDescription>
            <CardTitle className="text-3xl text-stone-900 flex items-center gap-2">
              <Leaf className="text-emerald-500" />
              {Math.round((organicKg / (totalKg || 1)) * 100)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-stone-500 mt-1">
              Didominasi sampah organik
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Benchmarking */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 size={18} />
            Benchmarking Performa Kelas
          </CardTitle>
          <CardDescription>Perbandingan aktivitas pengelolaan sampah antar kelas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-stone-500 uppercase bg-stone-50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Kelas</th>
                  <th className="px-4 py-3">Wali Kelas</th>
                  <th className="px-4 py-3 text-right">Total (Kg)</th>
                  <th className="px-4 py-3 text-right">Organik (Kg)</th>
                  <th className="px-4 py-3 text-right">Plastik (Kg)</th>
                  <th className="px-4 py-3 text-right">Partisipasi</th>
                  <th className="px-4 py-3 rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {[...classes].sort((a,b) => b.totalKg - a.totalKg).map((cls) => (
                  <tr key={cls.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/50">
                    <td className="px-4 py-3 font-semibold text-stone-900">{cls.name}</td>
                    <td className="px-4 py-3 text-stone-600">{cls.waliKelas}</td>
                    <td className="px-4 py-3 text-right font-mono font-medium">{cls.totalKg.toFixed(1)}</td>
                    <td className="px-4 py-3 text-right font-mono text-stone-500">{cls.organicKg.toFixed(1)}</td>
                    <td className="px-4 py-3 text-right font-mono text-stone-500">{cls.plasticKg.toFixed(1)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs text-stone-600">
                        {Math.round((cls.activeStudents / cls.totalStudents) * 100)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {cls.totalKg > 15 ? (
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-0">Aktif</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0">Perlu Binbingan</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
