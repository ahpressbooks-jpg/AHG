import {
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingBag,
  ShoppingCart,
  X,
  type LucideIcon,
} from 'lucide-react';

/** Lucide substitution for the brand's unspecified icon set (see design system readme). */
export const ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  'shopping-cart': ShoppingCart,
  'shopping-bag': ShoppingBag,
  'share-2': Share2,
  x: X,
  plus: Plus,
  minus: Minus,
};
