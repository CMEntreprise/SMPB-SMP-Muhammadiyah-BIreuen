import React, { useState } from 'react';
import { SCHOOL_INFO } from '../data/initialData';
import { StaffUser } from '../types/ppdb';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Search, 
  UserCheck, 
  FileText, 
  ShieldCheck, 
  ChevronDown, 
  Sparkles 
} from 'lucide-react';

interface NavbarProps {
  currentUser: StaffUser;
  staffAccounts: StaffUser[];
  onSelectUser: (user: StaffUser) => void;
  onOpenRegister: () => void;
  onOpenCheckStatus: () => void;
  onNavigateTab: (tab: 'landing' | 'dashboard') => void;
  currentTab: 'landing' | 'dashboard';
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  staffAccounts,
  onSelectUser,
  onOpenRegister,
  onOpenCheckStatus,
  onNavigateTab,
  currentTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Banner Announcement */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-emerald-950 uppercase tracking-wider animate-pulse">
              Gelombang 1 Dibuka
            </span>
            <span>PPDB T.A. {SCHOOL_INFO.academicYear} &bull; Biaya Pendaftaran Rp 150.000 &bull; Diskon Seragam Gelombang Pertama!</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-emerald-200 text-xs">
            <span>📞 Sekretariat: {SCHOOL_INFO.whatsapp}</span>
            <span>📍 Kota Juang, Bireuen</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & School Identity */}
          <div 
            onClick={() => onNavigateTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-amber-300 shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
              {/* Muhammadiyah Sunburst Crest Icon */}
              <div className="relative flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-amber-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-emerald-950 tracking-tight leading-tight">
                  SMP MUHAMMADIYAH BIREUEN
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                  AKREDITASI {SCHOOL_INFO.accreditation.split(' ')[0]}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Portal Penerimaan Peserta Didik Baru (PPDB) Online
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <button
              onClick={() => onNavigateTab('landing')}
              className={`transition-colors hover:text-emerald-700 ${
                currentTab === 'landing' ? 'text-emerald-700 border-b-2 border-emerald-600 pb-1' : ''
              }`}
            >
              Beranda
            </button>
            <a href="#profil" className="hover:text-emerald-700 transition-colors">
              Profil & Visi
            </a>
            <a href="#jalur" className="hover:text-emerald-700 transition-colors">
              Jalur & Biaya
            </a>
            <a href="#alur" className="hover:text-emerald-700 transition-colors">
              Alur PPDB
            </a>
            
            <button
              onClick={onOpenCheckStatus}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors text-xs font-bold"
            >
              <Search className="w-3.5 h-3.5 text-emerald-700" />
              Cek Status Pendaftar
            </button>

            <button
              onClick={() => onNavigateTab('dashboard')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold ${
                currentTab === 'dashboard'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Portal Staf & Analitik
            </button>
          </nav>

          {/* Right Area: Role Switcher & CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {/* RBAC Role Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white text-xs font-medium text-slate-700 transition-all shadow-2xs"
                title="Ganti Peran Pengguna untuk Pengujian Akses (RBAC)"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">
                  {currentUser.role === 'super_admin' ? 'SA' : currentUser.role === 'verifikator' ? 'VF' : currentUser.role === 'bendahara' ? 'BD' : 'WM'}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Peran Aktif</div>
                  <div className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{currentUser.roleTitle}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">Manajemen Peran Pengguna</p>
                    <p className="text-[11px] text-slate-500">Pilih akun staf untuk menguji kontrol akses (RBAC)</p>
                  </div>
                  <div className="mt-1 space-y-1">
                    {staffAccounts.map((account) => (
                      <button
                        key={account.id}
                        onClick={() => {
                          onSelectUser(account);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                          currentUser.id === account.id
                            ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          account.role === 'super_admin' ? 'bg-purple-600 text-white' :
                          account.role === 'verifikator' ? 'bg-blue-600 text-white' :
                          account.role === 'bendahara' ? 'bg-emerald-600 text-white' : 'bg-slate-600 text-white'
                        }`}>
                          {account.role === 'super_admin' ? 'SA' : account.role === 'verifikator' ? 'VF' : account.role === 'bendahara' ? 'BD' : 'WM'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-semibold text-slate-800">{account.name}</p>
                          <p className="text-[10px] text-slate-500">{account.roleTitle}</p>
                        </div>
                        {currentUser.id === account.id && (
                          <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <button
              onClick={onOpenRegister}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Daftar Sekarang</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenRegister}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs"
            >
              Daftar
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col gap-2 font-medium text-slate-700 text-sm">
            <button
              onClick={() => {
                onNavigateTab('landing');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 text-emerald-800 font-bold"
            >
              Beranda Portal PPDB
            </button>
            <a
              href="#profil"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Profil Sekolah & Visi Misi
            </a>
            <a
              href="#jalur"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Jalur Pendaftaran & Biaya (Rp 150rb)
            </a>
            <a
              href="#alur"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Alur Pendaftaran Online
            </a>
            <button
              onClick={() => {
                onOpenCheckStatus();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 py-2 px-3 rounded-lg bg-emerald-50 text-emerald-800 font-bold"
            >
              <Search className="w-4 h-4" />
              Cek Status Pendaftar Mandiri
            </button>
            <button
              onClick={() => {
                onNavigateTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 py-2 px-3 rounded-lg bg-slate-100 text-slate-800 font-bold"
            >
              <ShieldCheck className="w-4 h-4" />
              Dashboard Panitia & Analitik Staf
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-500 mb-2">Ganti Akun Staf (RBAC):</p>
            <div className="grid grid-cols-2 gap-2">
              {staffAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => {
                    onSelectUser(account);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded-lg text-left text-xs ${
                    currentUser.id === account.id
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  <p className="font-semibold truncate">{account.roleTitle.split('/')[0]}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
