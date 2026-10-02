import React from 'react';
import {
  Apple,
  Award,
  Banana,
  BatteryWarning,
  Brush,
  Coins,
  CupSoda,
  FileText,
  Leaf,
  Milk,
  Package,
  Pencil,
  Recycle,
  Sandwich,
  Sprout,
  Star,
  Trash2,
  TreePine,
  type LucideProps,
} from 'lucide-react';
import type { WasteCategory } from '../types';

type IconComponent = React.ComponentType<LucideProps>;

const CATEGORY_ICONS: Record<WasteCategory, IconComponent> = {
  organik: Leaf,
  plastik: Recycle,
  kertas: Package,
  logam_b3: BatteryWarning,
};

export const WasteCategoryIcon: React.FC<{ category: WasteCategory } & LucideProps> = ({
  category,
  ...props
}) => {
  const Icon = CATEGORY_ICONS[category] ?? Leaf;
  return <Icon {...props} />;
};

const ITEM_ICONS: Record<string, IconComponent> = {
  'botol-plastik-pet': Milk,
  'gelas-plastik': CupSoda,
  'kulit-pisang': Banana,
  'sisa-apel': Apple,
  'kardus-susu': Milk,
  'kertas-bekas': FileText,
  'kaleng-minuman': Trash2,
  'baterai-bekas': BatteryWarning,
};

export const WasteItemIcon: React.FC<{ itemId: string } & LucideProps> = ({ itemId, ...props }) => {
  const Icon = ITEM_ICONS[itemId] ?? Recycle;
  return <Icon {...props} />;
};

const DESTINATION_ICONS: Record<string, IconComponent> = {
  'kebersihan-kelas': Brush,
  'taman-adiwiyata': Sprout,
  'kantin-sehat': Sandwich,
  'koperasi-sekolah': Pencil,
};

export const DestinationIcon: React.FC<{ destinationId: string } & LucideProps> = ({
  destinationId,
  ...props
}) => {
  const Icon = DESTINATION_ICONS[destinationId] ?? Package;
  return <Icon {...props} />;
};

const BADGE_ICONS: Record<string, IconComponent> = {
  'b-first-sort': Sprout,
  'b-plastic-master': Recycle,
  'b-tree-saver': TreePine,
  'b-100-points': Star,
  'b-compost-hero': Apple,
  'b-super-saver': Coins,
};

export const BadgeIcon: React.FC<{ badgeId: string } & LucideProps> = ({ badgeId, ...props }) => {
  const Icon = BADGE_ICONS[badgeId] ?? Award;
  return <Icon {...props} />;
};

const AVATAR_BACKGROUNDS = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'];

export const studentAvatarUrl = (name: string, size = 96): string => {
  const seed = encodeURIComponent(name.trim() || 'siswa');
  const background = AVATAR_BACKGROUNDS.join(',');
  return `https://api.dicebear.com/9.x/open-peeps/svg?seed=${seed}&backgroundColor=${background}&size=${size}`;
};

export const StudentAvatar: React.FC<{
  name: string;
  size?: number;
  className?: string;
}> = ({ name, size = 36, className }) => (
  <img
    src={studentAvatarUrl(name, Math.max(size * 2, 96))}
    alt={name}
    width={size}
    height={size}
    loading="lazy"
    className={`rounded-full object-cover bg-muted ${className ?? ''}`}
    style={{ width: size, height: size }}
  />
);
