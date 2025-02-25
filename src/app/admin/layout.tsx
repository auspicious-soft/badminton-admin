import React from 'react';
import Headers from './components/headers/headers';


export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <Headers/>
      <main className="mt-4 px-4 md:px-8 max-w-full">
        {children}
      </main>
    </div>
  );
}