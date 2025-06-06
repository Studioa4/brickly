// components/ui/card.tsx
import React from 'react';

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white shadow-md rounded p-4">{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
