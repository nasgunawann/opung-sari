import React, { useState, useEffect } from 'react';
import {
  INITIAL_CLASSES,
  INITIAL_IOT_BIN,
  INITIAL_STUDENTS,
  INITIAL_TRANSACTIONS,
} from './data/initialData';
import {
  BankTransaction,
  SchoolClass,
  SmartBinIoTState,
  Student,
  WasteItem,
} from './types';
import { Header } from './components/Header';
import { HomeEducationTab } from './components/HomeEducationTab';
import { SmartBinIoTTab } from './components/SmartBinIoTTab';
import { LeaderboardTab } from './components/LeaderboardTab';
import { WasteBankRewardTab } from './components/WasteBankRewardTab';
import { BadgesMissionsTab } from './components/BadgesMissionsTab';
import { CoordinatorTab } from './components/CoordinatorTab';
import { AdminTab } from './components/AdminTab';
import { WithdrawalModal } from './components/WithdrawalModal';
import { ReceiptModal } from './components/ReceiptModal';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

export type UserRole = 'student' | 'coordinator' | 'admin';
export type TabKey = 'beranda' | 'iot_bin' | 'leaderboard' | 'bank_sampah' | 'misi' | 'coordinator_input' | 'coordinator_history' | 'admin_dashboard' | 'admin_classes' | 'admin_settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('beranda');
  const [userRole, setUserRole] = useState<UserRole>('student');

  // App data states (stored in React state, initialized from initialData or localStorage)
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('ecokids_students');
      if (!saved) return INITIAL_STUDENTS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    return localStorage.getItem('ecokids_current_student') || INITIAL_STUDENTS[0].id;
  });

  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    try {
      const saved = localStorage.getItem('ecokids_classes');
      if (!saved) return INITIAL_CLASSES;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CLASSES;
    } catch {
      return INITIAL_CLASSES;
    }
  });

  const [iotBin, setIotBin] = useState<SmartBinIoTState>(() => {
    try {
      const saved = localStorage.getItem('ecokids_iotbin');
      if (!saved) return INITIAL_IOT_BIN;
      const parsed = JSON.parse(saved);
      return parsed && parsed.compartments ? parsed : INITIAL_IOT_BIN;
    } catch {
      return INITIAL_IOT_BIN;
    }
  });

  const [transactions, setTransactions] = useState<BankTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('ecokids_transactions');
      if (!saved) return INITIAL_TRANSACTIONS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);
  const [receiptTrx, setReceiptTrx] = useState<BankTransaction | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ecokids_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('ecokids_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('ecokids_iotbin', JSON.stringify(iotBin));
  }, [iotBin]);

  useEffect(() => {
    localStorage.setItem('ecokids_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ecokids_current_student', currentStudentId);
  }, [currentStudentId]);

  const currentStudent =
    students.find((s) => s.id === currentStudentId) || students[0] || INITIAL_STUDENTS[0];

  // Handler when waste is disposed in the IoT Smart Bin
  const handleWasteDisposed = (
    item: WasteItem,
    weightKg: number,
    earnedRp: number,
    earnedPoints: number
  ) => {
    // 1. Update Student
    setStudents((prev) =>
      prev.map((stu) => {
        if (stu.id === currentStudent.id) {
          const newTotalPoints = stu.points + earnedPoints;
          const newLevel = Math.min(5, Math.floor(newTotalPoints / 100) + 1);
          const levelTitles = [
            'Tunas Hijau',
            'Ksatria Tunas',
            'Pendekar Hijau',
            'Panglima Eco-Ranger',
            'Duta Adiwiyata',
          ];

          return {
            ...stu,
            points: newTotalPoints,
            balanceRp: stu.balanceRp + earnedRp,
            totalKg: Number((stu.totalKg + weightKg).toFixed(2)),
            sortCount: stu.sortCount + 1,
            level: newLevel,
            levelTitle: levelTitles[newLevel - 1] || 'Duta Adiwiyata',
          };
        }
        return stu;
      })
    );

    // 2. Update Student's Class in Leaderboard
    setClasses((prev) => {
      const updated = prev.map((cls) => {
        if (cls.id === currentStudent.classId) {
          const newTotalKg = Number((cls.totalKg + weightKg).toFixed(2));
          const newTotalPoints = cls.totalPoints + earnedPoints;

          const categoryKey =
            item.category === 'organik'
              ? 'organicKg'
              : item.category === 'plastik'
              ? 'plasticKg'
              : item.category === 'kertas'
              ? 'paperKg'
              : 'b3Kg';

          return {
            ...cls,
            totalKg: newTotalKg,
            totalPoints: newTotalPoints,
            [categoryKey]: Number(((cls[categoryKey] as number) + weightKg).toFixed(2)),
          };
        }
        return cls;
      });

      // Recalculate ranks based on total points
      const sorted = [...updated].sort((a, b) => b.totalPoints - a.totalPoints);
      return updated.map((cls) => {
        const rank = sorted.findIndex((s) => s.id === cls.id) + 1;
        return {
          ...cls,
          rank,
          weeklyChampionBadge: rank === 1,
        };
      });
    });

    // 3. Create Deposit Transaction Record
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

    const newTrx: BankTransaction = {
      id: `trx-${Date.now()}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      type: 'deposit',
      amountRp: earnedRp,
      pointsEarned: earnedPoints,
      wasteItemName: `${item.name}`,
      weightKg: weightKg,
      category: item.category,
      description: `Setor pilah ke IoT EcoBin Hall`,
      timestamp: `Hari ini, ${timeStr}`,
      referenceCode: `DEP-${Date.now().toString().slice(-6)}`,
      status: 'berhasil',
    };

    setTransactions((prev) => [newTrx, ...prev]);
  };

  const handleManualDeposit = (studentId: string, categoryId: string, weightKg: number) => {
    // Find category info
    const catData = Object.values(require('./data/initialData').WASTE_CATEGORIES).find((c: any) => c.id === categoryId) as any;
    if (!catData) return;

    const earnedRp = catData.pricePerKg * weightKg;
    const earnedPoints = Math.floor(weightKg * 15); // mock formula: 15 pts per kg

    // Update Student
    setStudents((prev) =>
      prev.map((stu) => {
        if (stu.id === studentId) {
          const newTotalPoints = stu.points + earnedPoints;
          const newLevel = Math.min(5, Math.floor(newTotalPoints / 100) + 1);
          const levelTitles = [
            'Tunas Hijau',
            'Ksatria Tunas',
            'Pendekar Hijau',
            'Panglima Eco-Ranger',
            'Duta Adiwiyata',
          ];

          return {
            ...stu,
            points: newTotalPoints,
            balanceRp: stu.balanceRp + earnedRp,
            totalKg: Number((stu.totalKg + weightKg).toFixed(2)),
            sortCount: stu.sortCount + 1,
            level: newLevel,
            levelTitle: levelTitles[newLevel - 1] || 'Duta Adiwiyata',
          };
        }
        return stu;
      })
    );

    // Get student's class ID
    const targetStudent = students.find(s => s.id === studentId);
    if (!targetStudent) return;

    // Update Class Leaderboard
    setClasses((prev) => {
      const updated = prev.map((cls) => {
        if (cls.id === targetStudent.classId) {
          const newTotalKg = Number((cls.totalKg + weightKg).toFixed(2));
          const newTotalPoints = cls.totalPoints + earnedPoints;

          const categoryKey =
            categoryId === 'organik'
              ? 'organicKg'
              : categoryId === 'plastik'
              ? 'plasticKg'
              : categoryId === 'kertas'
              ? 'paperKg'
              : 'b3Kg';

          return {
            ...cls,
            totalKg: newTotalKg,
            totalPoints: newTotalPoints,
            [categoryKey]: Number(((cls[categoryKey] as number) + weightKg).toFixed(2)),
          };
        }
        return cls;
      });

      const sorted = [...updated].sort((a, b) => b.totalPoints - a.totalPoints);
      return updated.map((cls) => {
        const rank = sorted.findIndex((s) => s.id === cls.id) + 1;
        return {
          ...cls,
          rank,
          weeklyChampionBadge: rank === 1,
        };
      });
    });

    // Create Transaction
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

    const newTrx: BankTransaction = {
      id: `trx-${Date.now()}`,
      studentId: targetStudent.id,
      studentName: targetStudent.name,
      type: 'deposit',
      amountRp: earnedRp,
      pointsEarned: earnedPoints,
      wasteItemName: `${catData.name} (Manual)`,
      weightKg: weightKg,
      category: categoryId as any,
      description: `Setoran manual ke Koordinator`,
      timestamp: `Hari ini, ${timeStr}`,
      referenceCode: `DEP-M-${Date.now().toString().slice(-6)}`,
      status: 'berhasil',
    };

    setTransactions((prev) => [newTrx, ...prev]);
  };

  // Handler for adding points directly (e.g. from quiz or daily challenges)
  const handleAddPoints = (pts: number) => {
    setStudents((prev) =>
      prev.map((stu) => {
        if (stu.id === currentStudent.id) {
          const newTotalPoints = stu.points + pts;
          const newLevel = Math.min(5, Math.floor(newTotalPoints / 100) + 1);
          return {
            ...stu,
            points: newTotalPoints,
            level: newLevel,
          };
        }
        return stu;
      })
    );

    setClasses((prev) =>
      prev.map((cls) => {
        if (cls.id === currentStudent.classId) {
          return {
            ...cls,
            totalPoints: cls.totalPoints + pts,
          };
        }
        return cls;
      })
    );
  };

  // Handler when user confirms withdrawal from Waste Bank
  const handleConfirmWithdrawal = (newTrx: BankTransaction) => {
    // Deduct student balance
    setStudents((prev) =>
      prev.map((stu) => {
        if (stu.id === currentStudent.id) {
          return {
            ...stu,
            balanceRp: Math.max(0, stu.balanceRp - newTrx.amountRp),
          };
        }
        return stu;
      })
    );

    setTransactions((prev) => [newTrx, ...prev]);
    setReceiptTrx(newTrx);
  };

  // Update active tab when user role changes to default tab for that role
  useEffect(() => {
    if (userRole === 'student' && !['beranda', 'iot_bin', 'leaderboard', 'bank_sampah', 'misi'].includes(activeTab)) {
      setActiveTab('beranda');
    } else if (userRole === 'coordinator' && !['coordinator_input', 'coordinator_history'].includes(activeTab)) {
      setActiveTab('coordinator_input');
    } else if (userRole === 'admin' && !['admin_dashboard', 'admin_classes', 'admin_settings'].includes(activeTab)) {
      setActiveTab('admin_dashboard');
    }
  }, [userRole, activeTab]);

  return (
    <div className={`min-h-screen bg-stone-100 flex selection:bg-emerald-100 selection:text-emerald-900`}>
      {/* Universal Desktop Sidebar (md+) */}
      <Sidebar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        userRole={userRole}
        pendingRewardNotice={userRole === 'student' ? currentStudent.balanceRp >= 10000 : false}
      />

      {/* Main Container */}
      <div className={`flex-1 w-full bg-stone-50/60 min-h-screen relative flex flex-col transition-all duration-300`}>
        {/* Sticky Header */}
        <Header
          currentStudent={currentStudent}
          studentsList={students}
          onSelectStudent={(stu) => setCurrentStudentId(stu.id)}
          onOpenWithdrawal={() => setIsWithdrawModalOpen(true)}
          userRole={userRole}
          setUserRole={setUserRole}
        />

        {/* Main Tab Content View */}
        <main className="flex-1 px-4 pt-3 overflow-y-auto">
          {userRole === 'student' && (
            <>
              {activeTab === 'beranda' && (
                <HomeEducationTab
                  onGoToIoTBin={() => setActiveTab('iot_bin')}
                  onAddPoints={handleAddPoints}
                  userPoints={currentStudent.points}
                />
              )}

              {activeTab === 'iot_bin' && (
                <SmartBinIoTTab
                  currentStudent={currentStudent}
                  iotBin={iotBin}
                  onUpdateBin={setIotBin}
                  onWasteDisposed={handleWasteDisposed}
                />
              )}

              {activeTab === 'leaderboard' && (
                <LeaderboardTab
                  classes={classes}
                  students={students}
                  currentStudent={currentStudent}
                />
              )}

              {activeTab === 'bank_sampah' && (
                <WasteBankRewardTab
                  currentStudent={currentStudent}
                  transactions={transactions}
                  onOpenWithdrawModal={() => setIsWithdrawModalOpen(true)}
                  onViewReceipt={(trx) => setReceiptTrx(trx)}
                />
              )}

              {activeTab === 'misi' && (
                <BadgesMissionsTab currentStudent={currentStudent} />
              )}
            </>
          )}

          {userRole === 'coordinator' && (
            <>
              {activeTab === 'coordinator_input' && (
                <CoordinatorTab
                  students={students}
                  onManualDeposit={handleManualDeposit}
                />
              )}
              {activeTab === 'coordinator_history' && (
                <div className="py-12 text-center text-stone-500">
                  <h3 className="font-medium text-stone-900 mb-2">Riwayat Transaksi</h3>
                  <p className="text-sm">Fitur dalam pengembangan.</p>
                </div>
              )}
            </>
          )}

          {userRole === 'admin' && (
            <>
              {activeTab === 'admin_dashboard' && (
                <AdminTab classes={classes} transactions={transactions} />
              )}
              {activeTab === 'admin_classes' && (
                 <div className="py-12 text-center text-stone-500">
                  <h3 className="font-medium text-stone-900 mb-2">Kelola Kelas</h3>
                  <p className="text-sm">Fitur dalam pengembangan.</p>
                </div>
              )}
              {activeTab === 'admin_settings' && (
                 <div className="py-12 text-center text-stone-500">
                  <h3 className="font-medium text-stone-900 mb-2">Pengaturan</h3>
                  <p className="text-sm">Fitur dalam pengembangan.</p>
                </div>
              )}
            </>
          )}
        </main>

        {/* Mobile Navigation (All Roles) */}
        <MobileNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          userRole={userRole}
          pendingRewardNotice={userRole === 'student' ? currentStudent.balanceRp >= 10000 : false}
        />

        {/* Modals */}
        <WithdrawalModal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          currentStudent={currentStudent}
          onConfirmWithdrawal={handleConfirmWithdrawal}
        />

        <ReceiptModal
          transaction={receiptTrx}
          onClose={() => setReceiptTrx(null)}
        />
      </div>
    </div>
  );
}
