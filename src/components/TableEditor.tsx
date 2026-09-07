import React from 'react';
import { Check, Loader2, Plus, Trash2, Wifi, WifiOff } from 'lucide-react';

export type EditorColumn<T extends { id: string }> = {
  key: keyof T;
  label: string;
  type?: 'text' | 'number' | 'date' | 'select';
  options?: string[];
  editable?: boolean;
};

type TableEditorProps<T extends { id: string }> = {
  title: string;
  data: T[];
  columns: EditorColumn<T>[];
  onUpdate: (row: T) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  onAdd: () => T;
  isLoading?: boolean;
  isRealtimeConnected?: boolean;
};

export default function TableEditor<T extends { id: string }>({
  title,
  data,
  columns,
  onUpdate,
  onDelete,
  onAdd,
  isLoading = false,
  isRealtimeConnected = false,
}: TableEditorProps<T>) {
  const [drafts, setDrafts] = React.useState<Record<string, T>>({});
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState('');

  const getDraft = (row: T) => drafts[row.id] ?? row;
  const updateDraft = (row: T, key: keyof T, value: string) => {
    setDrafts((current) => ({ ...current, [row.id]: { ...getDraft(row), [key]: value } }));
  };

  const save = async (row: T) => {
    const draft = getDraft(row);
    setSavingId(row.id);
    setError('');
    try {
      await onUpdate(draft);
      setDrafts((current) => { const next = { ...current }; delete next[row.id]; return next; });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal menyimpan perubahan.');
    } finally {
      setSavingId(null);
    }
  };

  const add = async () => {
    const row = onAdd();
    await save(row);
  };

  const remove = async (id: string) => {
    if (!window.confirm('Hapus data ini?')) return;
    setDeletingId(id);
    setError('');
    try { await onDelete(id); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Gagal menghapus data.'); }
    finally { setDeletingId(null); }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <div><h2 className="font-semibold text-foreground">{title}</h2><p className="text-xs text-muted-foreground">{data.length} data tersimpan di Supabase</p></div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">{isRealtimeConnected ? <Wifi className="h-3.5 w-3.5 text-emerald-600" /> : <WifiOff className="h-3.5 w-3.5" />}{isRealtimeConnected ? 'Realtime aktif' : 'Offline'}</span>
          <button type="button" onClick={add} disabled={isLoading || savingId !== null} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 font-medium text-primary-foreground disabled:opacity-50"><Plus className="h-4 w-4" />Tambah</button>
        </div>
      </header>
      {error && <p role="alert" className="border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground"><tr>{columns.map((column) => <th key={String(column.key)} className="px-4 py-3">{column.label}</th>)}<th className="px-4 py-3">Aksi</th></tr></thead>
          <tbody className="divide-y divide-border">{isLoading ? <tr><td colSpan={columns.length + 1} className="p-8 text-center text-muted-foreground"><Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />Memuat data...</td></tr> : data.length === 0 ? <tr><td colSpan={columns.length + 1} className="p-8 text-center text-muted-foreground">Belum ada data.</td></tr> : data.map((row) => { const draft = getDraft(row); const dirty = drafts[row.id]; return <tr key={row.id} className={dirty ? 'bg-primary/5' : ''}>{columns.map((column) => <td key={String(column.key)} className="px-4 py-3 align-top">{column.editable === false ? <span>{String(draft[column.key] ?? '-')}</span> : column.type === 'select' ? <select value={String(draft[column.key] ?? '')} onChange={(event) => updateDraft(row, column.key, event.target.value)} className="w-full rounded-md border border-input bg-background px-2 py-1.5" aria-label={column.label}>{column.options?.map((option) => <option key={option}>{option}</option>)}</select> : <input type={column.type ?? 'text'} value={String(draft[column.key] ?? '')} onChange={(event) => updateDraft(row, column.key, event.target.value)} className="w-full min-w-28 rounded-md border border-input bg-background px-2 py-1.5" aria-label={column.label} />}</td>)}<td className="px-4 py-3"><div className="flex items-center gap-1"><button type="button" onClick={() => save(row)} disabled={!dirty || savingId === row.id} className="rounded-md p-2 text-primary hover:bg-primary/10 disabled:opacity-30" aria-label="Simpan">{savingId === row.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}</button><button type="button" onClick={() => remove(row.id)} disabled={deletingId === row.id} className="rounded-md p-2 text-destructive hover:bg-destructive/10" aria-label="Hapus">{deletingId === row.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</button></div></td></tr>; })}</tbody>
        </table>
      </div>
    </section>
  );
}

export type { TableEditorProps };
