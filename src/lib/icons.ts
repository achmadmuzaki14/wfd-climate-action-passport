import {
  Presentation,
  BookOpen,
  Glasses,
  TreePine,
  Camera,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Presentation,
  BookOpen,
  Glasses,
  TreePine,
  Camera,
};

export function getStationIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Presentation;
}
