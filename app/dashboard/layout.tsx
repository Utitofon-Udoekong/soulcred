"use client";

import DashboardSidebar from '../components/DashboardSidebar';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar />
      <main className="flex-1 min-h-screen bg-white overflow-x-auto px-4 sm:px-8 py-8 ml-72">
        <Breadcrumbs />
        {children}
      </main>
    </div>
  );
} 