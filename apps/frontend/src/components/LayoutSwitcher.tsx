import { useEffect, useState } from 'react';
import SidebarLayout from './SidebarLayout';
import TopbarLayout from './TopbarLayout';
import { getLayoutPreference } from '../utils/layoutPreference';

type LayoutPreference = 'sidebar' | 'topbar';

export default function LayoutSwitcher({ children }: { children: React.ReactNode }) {
  const [layout, setLayout] = useState<LayoutPreference | null>(null);

  useEffect(() => {
    getLayoutPreference().then(setLayout);
  }, []);

  if (!layout) return null;

  return layout === 'sidebar' ? <SidebarLayout>{children}</SidebarLayout> : <TopbarLayout>{children}</TopbarLayout>;
}
