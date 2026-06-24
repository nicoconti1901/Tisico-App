import type { IconType } from 'react-icons';
import {
  FaCalendarDays,
  FaChartLine,
  FaClipboardCheck,
  FaHelmetSafety,
  FaScrewdriverWrench,
  FaTriangleExclamation,
} from 'react-icons/fa6';
import { MdHealthAndSafety, MdReportProblem } from 'react-icons/md';
import { PiClipboardTextFill, PiFactory } from 'react-icons/pi';

export type BackgroundIcon = {
  Icon: IconType;
  className: string;
};

export type ModuleTheme = {
  code: string;
  /** Nombre corto para CTAs y badges */
  moduleName: string;
  accent: {
    badge: string;
    icon: string;
    iconBorder: string;
    topBar: string;
    glow: string;
    tagline: string;
    feature: string;
    featureBorder: string;
    dot: string;
    cta: string;
    ctaHover: string;
    ring: string;
  };
  backgroundIcons: BackgroundIcon[];
};

export const securityTheme: ModuleTheme = {
  code: 'S',
  moduleName: 'Seguridad',
  accent: {
    badge: 'border-amber-400/35 bg-amber-500/15 text-amber-200',
    icon: 'border-amber-400/30 bg-amber-500/15 text-amber-300',
    iconBorder: 'border-amber-400/25',
    topBar: 'from-amber-400 via-orange-500 to-amber-700',
    glow: 'bg-amber-500/15 group-hover:bg-amber-400/25',
    tagline: 'text-amber-400',
    feature: 'border-amber-500/25 bg-amber-500/10 text-amber-100/90',
    featureBorder: 'border-amber-500/20',
    dot: 'bg-amber-400',
    cta: 'border-amber-400/30 bg-amber-500/20 text-amber-50',
    ctaHover: 'group-hover:border-amber-400 group-hover:bg-amber-500 group-hover:text-white',
    ring: 'focus-visible:ring-amber-500',
  },
  backgroundIcons: [
    {
      Icon: FaHelmetSafety,
      className:
        'right-[-1rem] top-6 size-28 rotate-12 text-sky-300 opacity-[0.09] md:size-32',
    },
    {
      Icon: MdHealthAndSafety,
      className:
        'left-4 top-1/3 size-20 -rotate-6 text-blue-400 opacity-[0.07] md:size-24',
    },
    {
      Icon: FaTriangleExclamation,
      className:
        'bottom-24 left-1/4 size-16 rotate-6 text-amber-300/80 opacity-[0.08]',
    },
    {
      Icon: MdReportProblem,
      className:
        'right-1/4 bottom-16 size-14 -rotate-12 text-sky-200 opacity-[0.06]',
    },
    {
      Icon: FaHelmetSafety,
      className:
        'bottom-4 right-8 size-12 rotate-45 text-sky-400 opacity-[0.05]',
    },
  ],
};

export const qualityTheme: ModuleTheme = {
  code: 'Q',
  moduleName: 'Calidad',
  accent: {
    badge: 'border-sky-400/35 bg-sky-500/15 text-sky-200',
    icon: 'border-sky-400/30 bg-sky-500/15 text-sky-300',
    iconBorder: 'border-sky-400/25',
    topBar: 'from-sky-400 via-blue-500 to-blue-800',
    glow: 'bg-sky-500/15 group-hover:bg-sky-400/25',
    tagline: 'text-sky-400',
    feature: 'border-sky-500/20 bg-sky-500/10 text-sky-100/90',
    featureBorder: 'border-sky-500/20',
    dot: 'bg-sky-400',
    cta: 'border-sky-400/30 bg-sky-500/20 text-sky-50',
    ctaHover: 'group-hover:border-sky-400 group-hover:bg-sky-500 group-hover:text-white',
    ring: 'focus-visible:ring-sky-500',
  },
  backgroundIcons: [
    {
      Icon: FaClipboardCheck,
      className:
        'right-2 top-8 size-28 -rotate-6 text-sky-300 opacity-[0.09] md:size-32',
    },
    {
      Icon: FaCalendarDays,
      className:
        'left-6 top-1/4 size-20 rotate-3 text-blue-400 opacity-[0.07] md:size-24',
    },
    {
      Icon: FaScrewdriverWrench,
      className:
        'bottom-28 right-1/3 size-16 -rotate-12 text-sky-200 opacity-[0.08]',
    },
    {
      Icon: FaChartLine,
      className:
        'left-1/4 bottom-12 size-14 rotate-6 text-sky-300 opacity-[0.06]',
    },
    {
      Icon: PiFactory,
      className:
        'bottom-6 right-10 size-12 -rotate-3 text-blue-300 opacity-[0.05]',
    },
  ],
};

export const moduleThemes = {
  security: securityTheme,
  quality: qualityTheme,
} as const;

/** Icono pequeño junto al título del módulo */
export const moduleAccentIcons = {
  security: MdHealthAndSafety,
  quality: PiClipboardTextFill,
} satisfies Record<keyof typeof moduleThemes, IconType>;
