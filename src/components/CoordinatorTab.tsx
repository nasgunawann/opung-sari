import React, { useState } from 'react';
import { Scale, Search, UserCheck, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { Student, WasteCategoryInfo } from '../types';
import { WASTE_CATEGORIES } from '../data/initialData';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';

interface CoordinatorTabProps {
  students: Student[];
  onManualDeposit: (studentId: string, categoryId: string, weightKg: number) => void;
}

export const CoordinatorTab: React.FC<CoordinatorTabProps> = ({ students, onManualDeposit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<WasteCategoryInfo | null>(null);
  const [weightKg, setWeightKg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.nis.includes(searchQuery) ||
    s.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedCategory || !weightKg) return;

    onManualDeposit(selectedStudentId, selectedCategory.id, parseFloat(weightKg));
    setIsSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setIsSuccess(false);
      setWeightKg('');
      setSelectedCategory(null);
      setSelectedStudentId(null);
      setSearchQuery('');
    }, 2000);
  };

  return (
      <div className="w-full py-6 px-4 md:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
          <Scale className="text-blue-600" />
          Input Timbangan Manual
        </h2>
        <p className="text-stone-500">Catat setoran sampah fisik dari perwakilan kelas atau siswa.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Col: Search Student */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Pilih Penyetor</CardTitle>
            <CardDescription>Cari nama siswa, NIS, atau kelas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              <Input
                placeholder="Cari siswa..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {filteredStudents.map(student => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 ${
                    selectedStudentId === student.id 
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                      : 'border-stone-200 hover:border-blue-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="text-2xl">{student.avatar}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-stone-900">{student.name}</div>
                    <div className="text-xs text-stone-500">{student.className} • NIS: {student.nis}</div>
                  </div>
                  {selectedStudentId === student.id && (
                    <UserCheck className="text-blue-600" size={18} />
                  )}
                </button>
              ))}
              {filteredStudents.length === 0 && (
                <div className="text-center py-6 text-stone-500 text-sm">
                  Siswa tidak ditemukan.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Col: Input Form */}
        <Card className={!selectedStudentId ? 'opacity-50 pointer-events-none' : ''}>
          <CardHeader>
            <CardTitle className="text-lg">2. Detail Setoran</CardTitle>
            <CardDescription>
              {selectedStudentId 
                ? `Menyetor untuk ${students.find(s => s.id === selectedStudentId)?.name}` 
                : 'Pilih siswa terlebih dahulu'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDeposit} className="space-y-5">
              <div className="space-y-3">
                <Label>Kategori Sampah</Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(WASTE_CATEGORIES).map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`p-3 rounded-lg border text-left transition-all flex flex-col gap-1 ${
                        selectedCategory?.id === cat.id
                          ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                          : 'border-stone-200 hover:border-blue-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xl">{cat.icon}</span>
                        <span className="text-[10px] font-mono text-stone-500">
                          Rp{cat.pricePerKg}/kg
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-stone-900">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Berat Timbangan (Kg)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="pl-4 pr-12 text-lg font-mono"
                    placeholder="0.0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 font-medium">
                    Kg
                  </span>
                </div>
              </div>

              {selectedCategory && weightKg && (
                <div className="p-3 bg-stone-100 rounded-lg border border-stone-200 flex justify-between items-center">
                  <span className="text-sm text-stone-600">Estimasi Saldo:</span>
                  <span className="text-lg font-bold text-emerald-700 font-mono">
                    +Rp {(selectedCategory.pricePerKg * parseFloat(weightKg)).toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              {isSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 size={16} /> Setoran berhasil dicatat!
                </div>
              )}

              <Button 
                type="submit" 
                disabled={!selectedCategory || !weightKg || isSuccess}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium gap-2"
              >
                <PlusCircle size={16} />
                Simpan Setoran
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
