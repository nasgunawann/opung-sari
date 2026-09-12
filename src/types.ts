export type WasteCategory = 'organik' | 'plastik' | 'kertas' | 'logam_b3';

export interface WasteCategoryInfo {
  id: WasteCategory;
  name: string;
  label: string;
  colorName: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: string;
  description: string;
  pricePerKg: number;
  examples: string[];
}

export interface WasteItem {
  id: string;
  name: string;
  icon: string;
  category: WasteCategory;
  defaultWeightKg: number;
  points: number;
  description: string;
  funFact: string;
  decompositionTime: string;
}

export interface Student {
  id: string;
  name: string;
  nickname: string;
  nis: string;
  classId: string;
  className: string;
  avatar: string;
  points: number;
  balanceRp: number;
  totalKg: number;
  sortCount: number;
  level: number;
  levelTitle: string;
  badges: string[];
  rfidCode: string;
}

export interface SchoolClass {
  id: string;
  name: string;
  grade: number;
  waliKelas: string;
  totalStudents: number;
  activeStudents: number;
  totalKg: number;
  totalPoints: number;
  balanceRp: number;
  organicKg: number;
  plasticKg: number;
  paperKg: number;
  b3Kg: number;
  rank: number;
  weeklyChampionBadge?: boolean;
}

export interface BinCompartment {
  category: WasteCategory;
  name: string;
  color: string;
  lightBg: string;
  fillPercent: number;
  currentKg: number;
  maxKg: number;
  isOpen: boolean;
  status: 'normal' | 'hampir_penuh' | 'penuh';
}

export interface SmartBinIoTState {
  binId: string;
  binName: string;
  location: string;
  isOnline: boolean;
  batteryLevel: number;
  temperatureC: number;
  lastSyncTime: string;
  currentLidStatus: 'closed' | 'opening' | 'opened' | 'sorting';
  compartments: Record<WasteCategory, BinCompartment>;
}

export interface BankTransaction {
  id: string;
  studentId: string;
  studentName: string;
  classId?: string;
  className?: string;
  type: 'deposit' | 'withdrawal';
  amountRp: number;
  pointsEarned?: number;
  wasteItemName?: string;
  weightKg?: number;
  category?: WasteCategory;
  description: string;
  timestamp: string;
  method?: string;
  targetAccount?: string;
  referenceCode: string;
  status: 'berhasil' | 'diproses';
}

export interface WithdrawalDestination {
  id: string;
  name: string;
  category: 'kantin' | 'koperasi' | 'tabungan' | 'ewallet';
  icon: string;
  description: string;
  minAmount: number;
  fee: number;
  badge: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  itemImage?: string;
  options: {
    text: string;
    category: WasteCategory;
    isCorrect: boolean;
  }[];
  explanation: string;
  points: number;
}

export interface BadgeAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredMetric: string;
  targetValue: number;
  currentValue: number;
  unlocked: boolean;
  unlockedDate?: string;
}

