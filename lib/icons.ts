import {
  Armchair,
  Award,
  BadgeCheck,
  Box,
  Building,
  Building2,
  Calculator,
  CircleHelp,
  ClipboardCheck,
  Clock,
  Compass,
  DraftingCompass,
  Droplets,
  Factory,
  FileCheck,
  Fan,
  Gauge,
  Hammer,
  HardHat,
  Handshake,
  Home,
  Landmark,
  Layers,
  Leaf,
  Lightbulb,
  MapPin,
  PencilRuler,
  Plug,
  Ruler,
  Scale,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Trees,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Icons that can be used by name in content/site.json (the "icon" fields).
 * Only these are bundled, which keeps the site small. To add one, import it from
 * lucide-react (https://lucide.dev/icons) and add it to this map.
 */
export const iconMap = {
  Armchair,
  Award,
  BadgeCheck,
  Box,
  Building,
  Building2,
  Calculator,
  ClipboardCheck,
  Clock,
  Compass,
  DraftingCompass,
  Droplets,
  Factory,
  FileCheck,
  Fan,
  Gauge,
  Hammer,
  HardHat,
  Handshake,
  Home,
  Landmark,
  Layers,
  Leaf,
  Lightbulb,
  MapPin,
  PencilRuler,
  Plug,
  Ruler,
  Scale,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Trees,
  Users,
  Wrench,
  Zap,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;

export const iconNames = Object.keys(iconMap) as IconName[];

/** Unknown or missing names fall back to a neutral icon instead of breaking the page. */
export function getIcon(name?: string): LucideIcon {
  return (name && iconMap[name as IconName]) || CircleHelp;
}
