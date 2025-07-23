"use client";

import AdminContainer from "@/components/layouts/container/AdminContainer";

export default function AdminTemplate() {
  return (
    <AdminContainer>
      <main className="flex-1 flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-slate-400">Dashboard</h2>
          <p className="text-sm text-slate-300 mt-1">
            Belum ada fitur yang tersedia saat ini.
          </p>
        </div>
      </main>
    </AdminContainer>
  );
}
