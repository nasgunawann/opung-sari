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
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="text-primary" aria-hidden="true" />
            Dasbor Kabupaten
          </h2>
          <p className="text-muted-foreground">Agregasi performa ekologis tingkat instansi/sekolah.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download size={16} aria-hidden="true" />
          Unduh Laporan Bulanan
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Sampah Tereduksi</CardDescription>
            <CardTitle className="text-3xl text-foreground flex items-center gap-2">
              {totalKg.toFixed(1)} <span className="text-lg text-muted-foreground font-normal">kg</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-primary font-medium mt-1">
              <TrendingUp size={14} aria-hidden="true" /> +12% dari bulan lalu
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Partisipasi Siswa</CardDescription>
            <CardTitle className="text-3xl text-foreground">
              {Math.round((activeStudents / totalStudents) * 100)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground mt-1">
              {activeStudents} dari {totalStudents} siswa aktif menyetor
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Kas Sekolah</CardDescription>
            <CardTitle className="text-3xl text-primary">
              Rp {(totalBalance / 1000).toFixed(0)}k
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground mt-1">
              Akumulasi dari {classes.length} kelas terdaftar
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rasio Pemilahan</CardDescription>
            <CardTitle className="text-3xl text-foreground flex items-center gap-2">
              <Leaf className="text-primary" aria-hidden="true" />
              {Math.round((organicKg / (totalKg || 1)) * 100)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground mt-1">
              Didominasi sampah organik
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Benchmarking */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 size={18} aria-hidden="true" />
            Tolok Ukur Performa Kelas
          </CardTitle>
          <CardDescription>Perbandingan aktivitas pengelolaan sampah antar kelas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted">
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
                  <tr key={cls.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-4 py-3 font-semibold text-foreground">{cls.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{cls.waliKelas}</td>
                    <td className="px-4 py-3 text-right font-mono font-medium">{cls.totalKg.toFixed(1)}</td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground">{cls.organicKg.toFixed(1)}</td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground">{cls.plasticKg.toFixed(1)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs text-muted-foreground">
                        {Math.round((cls.activeStudents / cls.totalStudents) * 100)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {cls.totalKg > 15 ? (
                        <Badge className="bg-primary text-primary-foreground hover:bg-primary-active border-0">Aktif</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0">Perlu Bimbingan</Badge>
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
