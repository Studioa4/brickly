type LayoutPreference = 'sidebar' | 'topbar';

export const getLayoutPreference = async (): Promise<LayoutPreference> => {
  const local = localStorage.getItem('layout_preference');
  if (local === 'sidebar' || local === 'topbar') return local;
  return 'sidebar';
};

export const setLayoutPreference = async (layout: LayoutPreference): Promise<void> => {
  localStorage.setItem('layout_preference', layout);
};
