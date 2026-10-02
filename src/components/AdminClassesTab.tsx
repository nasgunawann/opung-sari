import React, { useState } from 'react';
import { SchoolClass } from '../types';
import { Users, Plus, Edit2, Trash2, Search, UserCheck } from 'lucide-react';

interface AdminClassesTabProps {
  classes: SchoolClass[];
}

export const AdminClassesTab: React.FC<AdminClassesTabProps> = ({ classes }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClasses = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.waliKelas && c.waliKelas.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full min-w-0 max-w-5xl mx-auto space-y-4 pb-24 pt-4 px-4 sm:px-6 md:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Users className="text-primary" aria-hidden="true" />
            Manajemen Kelas & Wali Kelas
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Hak akses Admin Sekolah (Kepala Sekolah) untuk mengelola data kelas, wali kelas, dan siswa terdaftar.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-active text-primary-foreground text-sm font-bold shadow-md transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus size={16} aria-hidden="true" /> Tambah Kelas Baru
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="text"
          aria-label="Cari nama kelas atau wali kelas"
          placeholder="Cari nama kelas atau wali kelas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all text-sm"
        />
      </div>

      {/* Data Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-muted/80 border-b border-border">
              <tr>
                <th className="px-5 py-4 font-bold">Nama Kelas</th>
                <th className="px-5 py-4 font-bold">Wali Kelas</th>
                <th className="px-5 py-4 text-center font-bold">Total Siswa</th>
                <th className="px-5 py-4 text-center font-bold">Status Keaktifan</th>
                <th className="px-5 py-4 text-right font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground font-medium">
                    Tidak ada data kelas yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredClasses.map((cls) => {
                  const participationRate = Math.round((cls.activeStudents / cls.totalStudents) * 100);
                  
                  return (
                    <tr key={cls.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-black text-foreground">{cls.name}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-[10px]">
                            {cls.waliKelas ? cls.waliKelas.charAt(0) : '?'}
                          </div>
                          <span className="font-semibold text-foreground">{cls.waliKelas || 'Belum diatur'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="font-bold text-foreground">{cls.totalStudents}</span>
                        <span className="text-muted-foreground text-xs ml-1">siswa</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col items-center gap-1.5 w-full max-w-[120px] mx-auto">
                          <div className="flex items-center justify-between w-full text-[10px] font-bold">
                            <span className="text-muted-foreground">Partisipasi</span>
                            <span className={participationRate > 70 ? 'text-primary' : 'text-amber-600'}>{participationRate}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-[width] ${participationRate > 70 ? 'bg-primary' : 'bg-amber-400'}`}
                              style={{ width: `${participationRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            type="button"
                            aria-label="Edit Data Kelas"
                            title="Edit Data Kelas"
                            className="inline-flex items-center justify-center size-10 text-muted-foreground hover:text-primary hover:bg-secondary rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            type="button"
                            aria-label="Hapus Kelas"
                            title="Hapus Kelas"
                            className="inline-flex items-center justify-center size-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
