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
  backgroundIcons: BackgroundIcon[];
};

export const securityTheme: ModuleTheme = {
  code: 'S',
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
