'use client';

import Link from 'next/link';
import { BookOpenText, Church, Clock3, House } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { useLanguage } from '@/components/ThemeProvider';

export function BottomNav() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const items = [
    { href: '/', label: language === 'es' ? 'Hoy' : 'Today', icon: House, active: pathname === '/' },
    {
      href: '/#prayer-for-now',
      label: language === 'es' ? 'Horas' : 'Hours',
      icon: Clock3,
      active: pathname === '/morning-prayer',
    },
    {
      href: '/mass-guide',
      label: language === 'es' ? 'Misa' : 'Mass',
      icon: Church,
      active: pathname === '/mass-guide' || pathname === '/readings',
    },
    {
      href: '/prayers',
      label: language === 'es' ? 'Oraciones' : 'Prayers',
      icon: BookOpenText,
      active: pathname.startsWith('/prayers') || pathname === '/rosary',
    },
  ];

  return (
    <nav className="bottom-nav no-print" aria-label={language === 'es' ? 'Navegación principal' : 'Main navigation'}>
      <div className="bottom-nav-inner">
        {items.map(({ href, label, icon: Icon, active }) => (
          <Link key={href} href={href} className={active ? 'bottom-nav-item is-active' : 'bottom-nav-item'}>
            <Icon aria-hidden="true" size={20} strokeWidth={active ? 2.25 : 1.75} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
