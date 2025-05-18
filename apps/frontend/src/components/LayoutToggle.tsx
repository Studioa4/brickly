import { useState } from 'react';
import { setLayoutPreference } from '../utils/layoutPreference';

type LayoutPreference = 'sidebar' | 'topbar';

export default function LayoutToggle() {
  const [layout, setLayout] = useState<LayoutPreference>(() =>
    (localStorage.getItem('layout_preference') as LayoutPreference) ?? 'sidebar'
  );

  const toggle = async () => {
    const newLayout = layout === 'sidebar' ? 'topbar' : 'sidebar';
    setLayout(newLayout);
    await setLayoutPreference(newLayout);
    window.location.reload(); // ricarica per applicare il nuovo layout
  };

  return (
    <button onClick={toggle} className="text-sm underline text-blue-500">
      Passa a {layout === 'sidebar' ? 'Topbar' : 'Sidebar'}
    </button>
  );
}
