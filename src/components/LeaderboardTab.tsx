import React, { useState } from 'react';
import { Trophy, Users } from 'lucide-react';
import { SchoolClass, Student } from '../types';

interface LeaderboardTabProps {
  classes: SchoolClass[];
  students: Student[];
  currentStudent: Student;
}

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({
  classes,
  students,
  currentStudent,
}) => {
  const [viewMode, setViewMode] = useState<'student' | 'class'>('student');

  const sortedClasses = [...classes].sort((a, b) => b.totalPoints - a.totalPoints);
  const sortedStudents = [...students].sort((a, b) => b.points - a.points);
  const topThreeClasses = sortedClasses.slice(0, 3);

  return (
    <div className="w-full space-y-4 pb-24 pt-2 md:px-4">
      {/* Switcher */}
      <div className="bg-muted p-1.5 rounded-2xl flex items-center gap-1 shadow-sm">
        <button
          onClick={() => setViewMode('student')}
          className={`flex-1 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
            viewMode === 'student'
              ? 'bg-background text-foreground font-bold shadow-sm'
              : 'text-muted-foreground hover:text-foreground font-semibold'
          }`}
        >
          <Trophy size={18} />
          <span>Siswa</span>
        </button>
        <button
          onClick={() => setViewMode('class')}
          className={`flex-1 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
            viewMode === 'class'
              ? 'bg-background text-foreground font-bold shadow-sm'
              : 'text-muted-foreground hover:text-foreground font-semibold'
          }`}
        >
          <Users size={18} />
          <span>Kelas</span>
        </button>
      </div>

      {viewMode === 'student' && (
        <div className="space-y-3">
          {sortedStudents.map((stu, idx) => {
            const isMe = stu.id === currentStudent.id;
            const rank = idx + 1;
            
            let rankBg = 'bg-muted text-muted-foreground';
            if (rank === 1) rankBg = 'bg-amber-100 text-amber-700 border-amber-200';
            else if (rank === 2) rankBg = 'bg-slate-200 text-slate-700 border-slate-300';
            else if (rank === 3) rankBg = 'bg-orange-100 text-orange-700 border-orange-200';

            return (
              <div
                key={stu.id}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${
                  isMe ? 'bg-primary/10 border-primary shadow-sm' : 'bg-card border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${rankBg}`}>
                    {rank}
                  </div>
                  <span className="text-2xl bg-muted rounded-full w-12 h-12 flex items-center justify-center">{stu.avatar}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-bold ${isMe ? 'text-primary' : 'text-foreground'}`}>
                        {stu.name}
                      </span>
                      {isMe && (
                        <span className="text-[10px] bg-primary text-primary-foreground font-bold px-2 py-0.5 rounded-full">
                          Kamu
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {stu.className}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${isMe ? 'text-primary' : 'text-foreground'}`}>
                    {stu.points}
                  </div>
                  <div className="text-xs text-muted-foreground font-bold">Poin</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'class' && (
        <div className="space-y-4">
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <h3 className="text-center font-bold text-amber-900 mb-4 uppercase tracking-wider text-sm">Podium Kelas</h3>
            <div className="flex items-end justify-center gap-3">
              <div className="flex-1 flex flex-col items-center">
                <span className="text-3xl mb-2 drop-shadow-md">🥈</span>
                <div className="text-sm font-bold text-foreground truncate w-full text-center">{topThreeClasses[1].name.split('-')[0]}</div>
                <div className="w-full bg-slate-200 border-2 border-slate-300 h-16 rounded-t-xl mt-2 flex flex-col items-center justify-center font-bold text-slate-700">
                  {topThreeClasses[1].totalPoints}
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <span className="text-4xl mb-2 drop-shadow-md">👑</span>
                <div className="text-sm font-bold text-foreground truncate w-full text-center">{topThreeClasses[0].name.split('-')[0]}</div>
                <div className="w-full bg-amber-300 border-2 border-amber-400 h-24 rounded-t-xl mt-2 flex flex-col items-center justify-center font-bold text-amber-900">
                  {topThreeClasses[0].totalPoints}
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <span className="text-3xl mb-2 drop-shadow-md">🥉</span>
                <div className="text-sm font-bold text-foreground truncate w-full text-center">{topThreeClasses[2].name.split('-')[0]}</div>
                <div className="w-full bg-orange-200 border-2 border-orange-300 h-12 rounded-t-xl mt-2 flex flex-col items-center justify-center font-bold text-orange-800">
                  {topThreeClasses[2].totalPoints}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {sortedClasses.map((cls, idx) => {
              const isMyClass = currentStudent.className.includes(cls.name.split(' - ')[0]);
              const rank = idx + 1;
              return (
                <div key={cls.id} className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${
                  isMyClass ? 'bg-primary/10 border-primary shadow-sm' : 'bg-card border-border'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                      isMyClass ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border'
                    }`}>
                      {rank}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-bold ${isMyClass ? 'text-primary' : 'text-foreground'}`}>
                          {cls.name}
                        </span>
                        {isMyClass && (
                          <span className="text-[10px] bg-primary text-primary-foreground font-bold px-2 py-0.5 rounded-full">
                            Kelasmu
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {cls.activeStudents} Siswa Aktif
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${isMyClass ? 'text-primary' : 'text-foreground'}`}>
                      {cls.totalPoints.toLocaleString('id-ID')}
                    </div>
                    <div className="text-xs text-muted-foreground font-bold">Poin</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};