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
          <h2 className="text-2xl font-black text-stone-900 flex items-center gap-2">
            <Users className="text-purple-600" />
            Manajemen Kelas & Wali Kelas
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Hak akses Admin Sekolah (Kepala Sekolah) untuk mengelola data kelas, wali kelas, dan siswa terdaftar.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-md transition-all active:scale-95">
          <Plus size={16} /> Tambah Kelas Baru
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Cari nama kelas atau wali kelas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all text-sm"
        />
      </div>

      {/* Data Table */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-stone-500 uppercase bg-stone-50/80 border-b border-stone-100">
              <tr>
                <th className="px-5 py-4 font-bold">Nama Kelas</th>
                <th className="px-5 py-4 font-bold">Wali Kelas</th>
                <th className="px-5 py-4 text-center font-bold">Total Siswa</th>
                <th className="px-5 py-4 text-center font-bold">Status Keaktifan</th>
                <th className="px-5 py-4 text-right font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-stone-400 font-medium">
                    Tidak ada data kelas yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredClasses.map((cls) => {
                  const participationRate = Math.round((cls.activeStudents / cls.totalStudents) * 100);
                  
                  return (
                    <tr key={cls.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-black text-stone-900">{cls.name}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px]">
                            {cls.waliKelas ? cls.waliKelas.charAt(0) : '?'}
                          </div>
                          <span className="font-semibold text-stone-700">{cls.waliKelas || 'Belum diatur'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="font-bold text-stone-700">{cls.totalStudents}</span>
                        <span className="text-stone-400 text-xs ml-1">siswa</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col items-center gap-1.5 w-full max-w-[120px] mx-auto">
                          <div className="flex items-center justify-between w-full text-[10px] font-bold">
                            <span className="text-stone-500">Partisipasi</span>
                            <span className={participationRate > 70 ? 'text-emerald-600' : 'text-amber-600'}>{participationRate}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${participationRate > 70 ? 'bg-emerald-500' : 'bg-amber-400'}`}
                              style={{ width: `${participationRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            className="p-1.5 text-stone-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                            title="Edit Data Kelas"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Hapus Kelas"
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
