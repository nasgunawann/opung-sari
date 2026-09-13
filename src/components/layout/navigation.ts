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
  History,
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
  accent: string;
  badge?: string;
  notifyDot?: boolean;
}

export const getNavItemsForRole = (
  role: UserRole,
  pendingRewardNotice?: boolean,
): NavItem[] => {
  if (role === "student") {
    return [
      {
        key: "beranda",
        label: "Beranda",
        icon: Home,
        accent: "text-emerald-600",
      },
      {
        key: "bank_sampah",
        label: "Tabungan",
        icon: Wallet,
        accent: "text-emerald-600",
      },
      {
        key: "iot_bin",
        label: "Setor Sampah",
        icon: Trash2,
        accent: "text-emerald-600",
      },
      {
        key: "misi",
        label: "Misi",
        icon: Award,
        accent: "text-emerald-600",
        notifyDot: pendingRewardNotice,
      },
      {
        key: "leaderboard",
        label: "Peringkat",
        icon: Trophy,
        accent: "text-amber-500",
      },
    ];
  }

  if (role === "coordinator") {
    return [
      {
        key: "coordinator_input",
        label: "Input Timbang",
        icon: Scale,
        accent: "text-emerald-700",
      },
      {
        key: "coordinator_approvals",
        label: "Validasi Kas",
        icon: ClipboardCheck,
        accent: "text-amber-600",
        notifyDot: pendingRewardNotice,
      },
      {
        key: "coordinator_reports",
        label: "Laporan",
        icon: BarChart3,
        accent: "text-blue-600",
      },
    ];
  }

  // Admin (Dinas/Kabupaten) - Modul BANG
  return [
    {
      key: "admin_dashboard",
      label: "Modul BANG",
      icon: Building2,
      accent: "text-purple-600",
    },
    {
      key: "admin_classes",
      label: "Kelola Kelas",
      icon: Users,
      accent: "text-stone-600",
    },
    {
      key: "admin_settings",
      label: "Pengaturan",
      icon: Settings,
      accent: "text-stone-600",
    },
  ];
};
