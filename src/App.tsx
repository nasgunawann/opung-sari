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
import { BottomNav, TabKey } from './components/BottomNav';
import { HomeEducationTab } from './components/HomeEducationTab';
import { SmartBinIoTTab } from './components/SmartBinIoTTab';
import { LeaderboardTab } from './components/LeaderboardTab';
import { WasteBankRewardTab } from './components/WasteBankRewardTab';
import { BadgesMissionsTab } from './components/BadgesMissionsTab';
import { WithdrawalModal } from './components/WithdrawalModal';
import { ReceiptModal } from './components/ReceiptModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('beranda');

  // App data states (stored in React state, initialized from initialData or localStorage)
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('ecokids_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    return localStorage.getItem('ecokids_current_student') || INITIAL_STUDENTS[0].id;
  });

  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    const saved = localStorage.getItem('ecokids_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [iotBin, setIotBin] = useState<SmartBinIoTState>(() => {
    const saved = localStorage.getItem('ecokids_iotbin');
    return saved ? JSON.parse(saved) : INITIAL_IOT_BIN;
  });

  const [transactions, setTransactions] = useState<BankTransaction[]>(() => {
    const saved = localStorage.getItem('ecokids_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
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
    students.find((s) => s.id === currentStudentId) || students[0];

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

  return (
    <div className="min-h-screen bg-stone-100 flex justify-center selection:bg-emerald-100 selection:text-emerald-900">
      {/* Mobile-first clean flat container */}
      <div className="w-full max-w-md bg-stone-50/60 min-h-screen relative flex flex-col border-x border-stone-200">
        {/* Sticky Mobile Header */}
        <Header
          currentStudent={currentStudent}
          studentsList={students}
          onSelectStudent={(stu) => setCurrentStudentId(stu.id)}
          onOpenWithdrawal={() => setIsWithdrawModalOpen(true)}
        />

        {/* Main Tab Content View */}
        <main className="flex-1 px-4 pt-3 overflow-y-auto">
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
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          pendingRewardNotice={currentStudent.balanceRp >= 10000}
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
