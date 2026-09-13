import React from 'react';
import { BarChart3, Bell, BookOpen, Building2, ChevronDown, FileText, GraduationCap, LogOut, Megaphone, Settings, Users, Wallet } from 'lucide-react';
import { Student, Bill, News, Announcement, PCSBRegistration, PortalSettings, Room, UserSession } from '../types';

type AdminTab = 'overview' | 'news_ann' | 'ppdb' | 'students' | 'kamar' | 'alumni' | 'bills' | 'rekening' | 'settings' | 'whatsapp' | 'input_mandiri' | 'reports' | 'outbox_log' | 'kelas_sekolah' | 'pengurus';
interface Props {
  students: Student[]; setStudents: React.Dispatch<React.SetStateAction<Student[]>>; rooms?: Room[]; setRooms?: React.Dispatch<React.SetStateAction<Room[]>>;
  bills: Bill[]; setBills: React.Dispatch<React.SetStateAction<Bill[]>>; news: News[]; setNews: React.Dispatch<React.SetStateAction<News[]>>;
  announcements: Announcement[]; setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>; ppdbList: PCSBRegistration[]; setPpdbList: React.Dispatch<React.SetStateAction<PCSBRegistration[]>>;
  settings: PortalSettings; setSettings: (settings: PortalSettings) => void; onLogout?: () => void; activeTab?: AdminTab; setActiveTab?: (tab: AdminTab) => void; session?: UserSession;
  availableFormalClasses?: string[]; setAvailableFormalClasses?: React.Dispatch<React.SetStateAction<string[]>>; availableMadrasahClasses?: string[]; setAvailableMadrasahClasses?: React.Dispatch<React.SetStateAction<string[]>>;
}

const menuGroups = [
  { id: 'overview' as AdminTab, label: 'Ringkasan', icon: BarChart3, children: [] },
  { id: 'students' as AdminTab, label: 'Data Santri', icon: Users, children: [{ id: 'students' as AdminTab, label: 'Daftar Santri' }, { id: 'input_mandiri' as AdminTab, label: 'Input Mandiri' }, { id: 'alumni' as AdminTab, label: 'Alumni' }] },
  { id: 'kamar' as AdminTab, label: 'Asrama', icon: Building2, children: [{ id: 'kamar' as AdminTab, label: 'Data Kamar' }, { id: 'pengurus' as AdminTab, label: 'Pengurus' }] },
  { id: 'news_ann' as AdminTab, label: 'Publikasi', icon: Megaphone, children: [{ id: 'news_ann' as AdminTab, label: 'Berita & Pengumuman' }, { id: 'whatsapp' as AdminTab, label: 'Pesan WhatsApp' }] },
  { id: 'ppdb' as AdminTab, label: 'PCSB / PPDB', icon: GraduationCap, children: [{ id: 'ppdb' as AdminTab, label: 'Pendaftar' }, { id: 'kelas_sekolah' as AdminTab, label: 'Kelas & Sekolah' }] },
  { id: 'bills' as AdminTab, label: 'Keuangan', icon: Wallet, children: [{ id: 'bills' as AdminTab, label: 'Tagihan Santri' }, { id: 'rekening' as AdminTab, label: 'Rekening' }, { id: 'reports' as AdminTab, label: 'Laporan' }] },
  { id: 'settings' as AdminTab, label: 'Pengaturan', icon: Settings, children: [{ id: 'settings' as AdminTab, label: 'Pengaturan Portal' }, { id: 'outbox_log' as AdminTab, label: 'Log Aktivitas' }] },
];

export default function AdminDashboard({ students, rooms = [], bills, news, announcements, ppdbList, settings, onLogout, activeTab: controlledTab, setActiveTab: controlledSetTab }: Props) {
  const [localTab, setLocalTab] = React.useState<AdminTab>(controlledTab || 'overview');
  const activeTab = controlledTab || localTab;
  const setActiveTab = controlledSetTab || setLocalTab;
  const activeGroup = menuGroups.find((group) => group.id === activeTab || group.children.some((child) => child.id === activeTab)) || menuGroups[0];
  const setTab = (tab: AdminTab) => setActiveTab(tab);
  const title = activeGroup.children.find((child) => child.id === activeTab)?.label || activeGroup.label;
  const counts = { students: students.length, rooms: rooms.length, bills: bills.length, news: news.length + announcements.length, ppdb: ppdbList.length };

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <header className="flex items-center justify-between border-b bg-white px-5 py-4 shadow-sm">
      <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Al-Asy&apos;ariyah</p><h1 className="text-xl font-bold">Dashboard Admin</h1></div>
      <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"><LogOut size={16} /> Keluar</button>
    </header>
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-5 lg:flex-row">
      <aside className="w-full shrink-0 rounded-2xl border bg-white p-3 shadow-sm lg:w-64">
        <p className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Menu Utama</p>
        <nav className="space-y-1">{menuGroups.map((group) => { const Icon = group.icon; const open = activeGroup.id === group.id; return <div key={group.id}>
          <button onClick={() => setTab(group.children[0]?.id || group.id)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${open ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}><span className="flex items-center gap-3"><Icon size={17} />{group.label}</span>{group.children.length > 0 && <ChevronDown size={15} className={open ? 'rotate-180' : ''} />}</button>
          {open && group.children.length > 0 && <div className="ml-7 space-y-1 border-l pl-3">{group.children.map((child) => <button key={child.id} onClick={() => setTab(child.id)} className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${activeTab === child.id ? 'bg-emerald-700 font-semibold text-white' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-800'}`}>{child.label}</button>)}</div>}
        </div>; })}</nav>
      </aside>
      <section className="min-w-0 flex-1"><div className="mb-5"><p className="text-sm text-slate-500">Admin / {activeGroup.label}</p><h2 className="text-2xl font-bold">{title}</h2></div>
        {activeTab === 'overview' ? <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{[['students','Santri',Users],['rooms','Kamar',Building2],['bills','Tagihan',Wallet],['news','Publikasi',Megaphone],['ppdb','Pendaftar',GraduationCap]].map(([key, label, Icon]) => <div key={key as string} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="mb-3 flex items-center justify-between text-emerald-700"><span className="text-sm font-medium text-slate-500">{label as string}</span>{React.createElement(Icon as React.ElementType, { size: 20 })}</div><p className="text-3xl font-bold">{counts[key as keyof typeof counts]}</p></div>)}</div><div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm"><h3 className="font-bold">Selamat datang di Dashboard Admin</h3><p className="mt-2 text-sm text-slate-500">Pilih menu di sebelah kiri untuk membuka submenu dan mengelola data pesantren.</p></div></> : <div className="rounded-2xl border bg-white p-8 shadow-sm"><div className="mb-4 flex items-center gap-3 text-emerald-700"><FileText size={22} /><h3 className="text-lg font-bold">{title}</h3></div><p className="text-sm text-slate-500">Submenu <strong>{title}</strong> dipilih. Konten pengelolaan data siap digunakan.</p></div>}
      </section>
    </div>
  </main>;
}
