export type ThemeColor =
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'green'
  | 'amber'
  | 'blue';

interface ColorShades {
  bg: string;
  bgLight: string;
  bgDark: string;
  text: string;
  textDark: string;
  border: string;
  gradient: string;
  gradientSolid: string;
  ring: string;
  shadow: string;
  dot: string;
}

export const COLOR_MAP: Record<ThemeColor, ColorShades> = {
  emerald: {
    bg: 'bg-emerald-500',
    bgLight: 'bg-emerald-50',
    bgDark: 'bg-emerald-600',
    text: 'text-emerald-700',
    textDark: 'text-emerald-900',
    border: 'border-emerald-200',
    gradient: 'from-emerald-400 to-teal-600',
    gradientSolid: 'from-emerald-500 to-teal-600',
    ring: 'ring-emerald-300',
    shadow: 'shadow-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  teal: {
    bg: 'bg-teal-500',
    bgLight: 'bg-teal-50',
    bgDark: 'bg-teal-600',
    text: 'text-teal-700',
    textDark: 'text-teal-900',
    border: 'border-teal-200',
    gradient: 'from-teal-400 to-cyan-600',
    gradientSolid: 'from-teal-500 to-cyan-600',
    ring: 'ring-teal-300',
    shadow: 'shadow-teal-500/30',
    dot: 'bg-teal-500',
  },
  cyan: {
    bg: 'bg-cyan-500',
    bgLight: 'bg-cyan-50',
    bgDark: 'bg-cyan-600',
    text: 'text-cyan-700',
    textDark: 'text-cyan-900',
    border: 'border-cyan-200',
    gradient: 'from-cyan-400 to-blue-600',
    gradientSolid: 'from-cyan-500 to-blue-600',
    ring: 'ring-cyan-300',
    shadow: 'shadow-cyan-500/30',
    dot: 'bg-cyan-500',
  },
  green: {
    bg: 'bg-green-500',
    bgLight: 'bg-green-50',
    bgDark: 'bg-green-600',
    text: 'text-green-700',
    textDark: 'text-green-900',
    border: 'border-green-200',
    gradient: 'from-green-400 to-emerald-600',
    gradientSolid: 'from-green-500 to-emerald-600',
    ring: 'ring-green-300',
    shadow: 'shadow-green-500/30',
    dot: 'bg-green-500',
  },
  amber: {
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-50',
    bgDark: 'bg-amber-600',
    text: 'text-amber-700',
    textDark: 'text-amber-900',
    border: 'border-amber-200',
    gradient: 'from-amber-400 to-orange-600',
    gradientSolid: 'from-amber-500 to-orange-600',
    ring: 'ring-amber-300',
    shadow: 'shadow-amber-500/30',
    dot: 'bg-amber-500',
  },
  blue: {
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-50',
    bgDark: 'bg-blue-600',
    text: 'text-blue-700',
    textDark: 'text-blue-900',
    border: 'border-blue-200',
    gradient: 'from-blue-400 to-indigo-600',
    gradientSolid: 'from-blue-500 to-indigo-600',
    ring: 'ring-blue-300',
    shadow: 'shadow-blue-500/30',
    dot: 'bg-blue-500',
  },
};

export function getColor(name: string): ColorShades {
  return COLOR_MAP[name as ThemeColor] ?? COLOR_MAP.emerald;
}
