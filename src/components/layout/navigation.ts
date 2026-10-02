import React from "react";
import {
  Home,
  Trash2,
  Trophy,
  Wallet,
  Award,
  Scale,
  ClipboardCheck,
  BarChart3,
  Building2,
  Users,
  Settings,
} from "lucide-react";
import { UserRole } from "../../App";
import { TabKey } from "../../App";

export interface NavItem {
  key: TabKey;
  label: string;
  icon: React.ElementType;
  badge?: string;
  notifyDot?: boolean;
}

export const getNavItemsForRole = (
  role: UserRole,
  pendingRewardNotice?: boolean,
): NavItem[] => {
  if (role === "student") {
    return [
      { key: "beranda", label: "Beranda", icon: Home },
      { key: "bank_sampah", label: "Tabungan", icon: Wallet },
      { key: "iot_bin", label: "Setor Sampah", icon: Trash2 },
      {
        key: "misi",
        label: "Misi",
        icon: Award,
        notifyDot: pendingRewardNotice,
      },
      { key: "leaderboard", label: "Peringkat", icon: Trophy },
    ];
  }

  if (role === "coordinator") {
    return [
      { key: "coordinator_input", label: "Input Timbang", icon: Scale },
      {
        key: "coordinator_approvals",
        label: "Validasi Kas",
        icon: ClipboardCheck,
        notifyDot: pendingRewardNotice,
      },
      { key: "coordinator_reports", label: "Laporan", icon: BarChart3 },
    ];
  }

  // Admin (Dinas/Kabupaten) - Modul BANG
  return [
    { key: "admin_dashboard", label: "Modul BANG", icon: Building2 },
    { key: "admin_classes", label: "Kelola Kelas", icon: Users },
    { key: "admin_settings", label: "Pengaturan", icon: Settings },
  ];
};
