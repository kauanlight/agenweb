import {Pathnames} from 'next-intl/navigation';

export const locales = ['pt-BR', 'en-US'] as const;

export const pathnames = {
  '/': '/',
  '/dashboard': '/dashboard',
} satisfies Pathnames<typeof locales>;

export const localePrefix = 'always';

export type AppPathnames = keyof typeof pathnames;
