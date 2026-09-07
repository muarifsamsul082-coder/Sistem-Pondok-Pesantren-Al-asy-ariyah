import React from 'react';

/**
 * Temporary resilient admin surface kept intentionally dependency-free so a malformed
 * generated dashboard cannot prevent the rest of the portal from loading.
 */
export default function AdminDashboard(_props: Record<string, unknown>) {
  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <section className="mx-auto max-w-4xl rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Dashboard Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Panel admin siap digunakan kembali.
        </p>
      </section>
    </main>
  );
}
