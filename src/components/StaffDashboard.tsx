import React, { useState, useMemo } from 'react';
import { Applicant, StaffUser, RegistrationTrack, PaymentStatus, DocumentStatus, OverallStatus } from '../types/ppdb';
import { SCHOOL_INFO } from '../data/initialData';
import { storageService } from '../services/storageService';
import { 
  Users, 
  DollarSign, 
  FileCheck, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Eye, 
  Check, 
  X, 
  Send, 
  Mail, 
  ShieldAlert, 
  Database, 
  Sparkles, 
  Trash2, 
  ChevronRight,
  TrendingUp,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface StaffDashboardProps {
  currentUser: StaffUser;
  applicants: Applicant[];
  onRefreshData: () => void;
  onOpenRegister: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  currentUser,
  applicants,
  onRefreshData,
  onOpenRegister,
}) => {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrack, setFilterTrack] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [filterDocStatus, setFilterDocStatus] = useState<string>('all');

  // Detail Modal / Verifier Drawer
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [verificationNoteInput, setVerificationNoteInput] = useState('');
  const [emailPreviewApplicant, setEmailPreviewApplicant] = useState<Applicant | null>(null);

  // Role permissions check
  const isSuperAdmin = currentUser.role === 'super_admin';
  const isVerifikator = currentUser.role === 'verifikator' || isSuperAdmin;
  const isBendahara = currentUser.role === 'bendahara' || isSuperAdmin;

  // Filtered applicants
  const filteredApplicants = useMemo(() => {
    return applicants.filter((item) => {
      const matchSearch =
        item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nisn.includes(searchQuery) ||
        item.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.previousSchool.toLowerCase().includes(searchQuery.toLowerCase());

      const matchTrack = filterTrack === 'all' || item.track === filterTrack;
      const matchPayment = filterPayment === 'all' || item.payment.status === filterPayment;
      const matchDoc = filterDocStatus === 'all' || item.documentStatus === filterDocStatus;

      return matchSearch && matchTrack && matchPayment && matchDoc;
    });
  }, [applicants, searchQuery, filterTrack, filterPayment, filterDocStatus]);

  // Analytics Metrics
  const totalCount = applicants.length;
  const paidCount = applicants.filter(a => a.payment.status === 'paid').length;
  const unpaidCount = applicants.filter(a => a.payment.status !== 'paid').length;
  const verifiedDocCount = applicants.filter(a => a.documentStatus === 'verified').length;
  const acceptedCount = applicants.filter(a => a.overallStatus === 'accepted').length;
  const totalIncome = paidCount * SCHOOL_INFO.registrationFee;

  // Track breakdown
  const trackCounts = {
    tahfidz: applicants.filter(a => a.track === 'tahfidz').length,
    reguler: applicants.filter(a => a.track === 'reguler').length,
    prestasi: applicants.filter(a => a.track === 'prestasi').length,
    afirmasi: applicants.filter(a => a.track === 'afirmasi').length,
  };

  // Top feeder schools in Bireuen
  const schoolCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    applicants.forEach(a => {
      counts[a.previousSchool] = (counts[a.previousSchool] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [applicants]);

  // Update applicant document verification status
  const handleUpdateDocumentStatus = (status: DocumentStatus) => {
    if (!selectedApplicant) return;
    const updated = storageService.updateApplicant(selectedApplicant.id, {
      documentStatus: status,
      verificationNotes: verificationNoteInput || selectedApplicant.verificationNotes,
      overallStatus: status === 'verified' ? 'document_verified' : status === 'revision' ? 'submitted' : 'rejected',
    });
    if (updated) {
      setSelectedApplicant(updated);
      onRefreshData();
    }
  };

  // Update applicant payment status (Bendahara / Super Admin)
  const handleTogglePaymentStatus = (applicant: Applicant) => {
    const newStatus: PaymentStatus = applicant.payment.status === 'paid' ? 'unpaid' : 'paid';
    const updated = storageService.updateApplicant(applicant.id, {
      payment: {
        ...applicant.payment,
        status: newStatus,
        paidAt: newStatus === 'paid' ? new Date().toISOString() : undefined,
        receiptNumber: newStatus === 'paid' ? `KWT-${Date.now().toString().slice(-4)}` : undefined,
      },
    });
    if (updated) {
      onRefreshData();
      if (selectedApplicant?.id === applicant.id) {
        setSelectedApplicant(updated);
      }
    }
  };

  // Update Overall Status (Accepted / Rejected / Reserve)
  const handleUpdateOverallStatus = (status: OverallStatus) => {
    if (!selectedApplicant) return;
    const updated = storageService.updateApplicant(selectedApplicant.id, {
      overallStatus: status,
    });
    if (updated) {
      setSelectedApplicant(updated);
      onRefreshData();
    }
  };

  // Delete applicant (Super admin only)
  const handleDeleteApplicant = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data pendaftar ini? Tindakan ini tidak dapat dibatalkan.')) {
      storageService.deleteApplicant(id);
      setSelectedApplicant(null);
      onRefreshData();
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Banner: RBAC Context & Database Cloud Sync Status */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-emerald-950">
              {currentUser.roleTitle}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-200 border border-emerald-700">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cloud DB Terenkripsi & Sinkron Real-Time</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard Rekapitulasi & Analitik PPDB
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1">
            SMP Muhammadiyah Bireuen &bull; Tahun Ajaran {SCHOOL_INFO.academicYear} &bull; Pengguna: <strong className="text-white">{currentUser.name}</strong> ({currentUser.email})
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => storageService.exportToExcel(applicants)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-all shadow-md"
            title="Download Spreadsheet Excel (.CSV/XLSX)"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Ekspor Excel</span>
          </button>

          <button
            onClick={() => storageService.printOfficialReport(applicants)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs border border-emerald-600 transition-all shadow-md"
            title="Cetak Laporan PDF Resmi Berkop Sekolah"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Cetak PDF Resmi</span>
          </button>

          <button
            onClick={onRefreshData}
            className="p-2.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 border border-emerald-700 transition-all"
            title="Muat Ulang Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RBAC Notice if Wali Murid is viewing */}
      {!isSuperAdmin && !isVerifikator && !isBendahara && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <strong>Mode Akses Terbatas (Calon Wali Murid):</strong> Anda sedang melihat dasbor dengan izin tamu. Untuk memverifikasi berkas atau mencatat pembayaran, silakan ganti akun staf pada pojok kanan atas navbar ke <em>Panitia Verifikator</em>, <em>Bendahara</em>, atau <em>Super Admin</em>.
          </div>
        </div>
      )}

      {/* 5 Real-Time KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Pendaftar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Pendaftar</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Dari target {SCHOOL_INFO.totalQuota} kuota ({Math.round((totalCount / SCHOOL_INFO.totalQuota) * 100)}%)
          </div>
        </div>

        {/* Total Dana Masuk PPDB (Rp 150rb) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Kas PPDB</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 truncate">
            Rp {totalIncome.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-emerald-800 font-medium mt-1">
            {paidCount} siswa telah lunas (Rp 150rb)
          </div>
        </div>

        {/* Berkas Terverifikasi */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Berkas Valid</span>
            <FileCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{verifiedDocCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {totalCount - verifiedDocCount} perlu review
          </div>
        </div>

        {/* Belum Bayar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Menunggu Bayar</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">{unpaidCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Siap diingatkan via WhatsApp
          </div>
        </div>

        {/* Lolos Seleksi Diterima */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Lolos Diterima</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-700">{acceptedCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Telah memenuhi kriteria
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Distribution of Tracks & Feeder Schools */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Jalur Pendaftaran Bar Visual */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              <span>Distribusi Pilihan Jalur Pendaftaran</span>
            </h4>
            <span className="text-xs font-semibold text-slate-400">Total: {totalCount} Siswa</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Tahfidz Qur\'an (3-5 Juz)', count: trackCounts.tahfidz, color: 'bg-emerald-600', text: 'text-emerald-700' },
              { label: 'Reguler Plus (Bilingual)', count: trackCounts.reguler, color: 'bg-blue-600', text: 'text-blue-700' },
              { label: 'Prestasi Juara (Bebas Tes)', count: trackCounts.prestasi, color: 'bg-amber-500', text: 'text-amber-700' },
              { label: 'Afirmasi / Beasiswa Lazismu', count: trackCounts.afirmasi, color: 'bg-purple-600', text: 'text-purple-700' },
            ].map((item, idx) => {
              const pct = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.label}</span>
                    <span className={`font-bold ${item.text}`}>{item.count} siswa ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Asal Sekolah SD/MI Terbanyak */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>Top Asal Sekolah SD / MI di Kab. Bireuen</span>
            </h4>
            <span className="text-xs text-slate-500">Sebaran Daerah</span>
          </div>

          <div className="space-y-2.5">
            {schoolCounts.map(([school, count], idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{school}</span>
                </div>
                <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded shadow-2xs">
                  {count} Siswa
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table: Rekapitulasi Real-Time Data Pendaftar */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Search & Filter Toolbar */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Tabel Rekapitulasi Pendaftar PPDB ({filteredApplicants.length} Data)
              </h3>
              <p className="text-xs text-slate-500">
                Klik pendaftar untuk melihat berkas digital, verifikasi dokumen, atau kelola status.
              </p>
            </div>

            <button
              onClick={onOpenRegister}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all shrink-0"
            >
              <span>+ Tambah Pendaftar Manual</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Nama, NISN, No Registrasi..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Filter Track */}
            <select
              value={filterTrack}
              onChange={(e) => setFilterTrack(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            >
              <option value="all">Semua Jalur Pendaftaran</option>
              <option value="tahfidz">Jalur Tahfidz</option>
              <option value="reguler">Jalur Reguler</option>
              <option value="prestasi">Jalur Prestasi</option>
              <option value="afirmasi">Jalur Afirmasi</option>
            </select>

            {/* Filter Payment */}
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            >
              <option value="all">Semua Status Bayar (Rp 150rb)</option>
              <option value="paid">Lunas (Rp 150.000)</option>
              <option value="unpaid">Belum Lunas / Pending</option>
            </select>

            {/* Filter Doc Status */}
            <select
              value={filterDocStatus}
              onChange={(e) => setFilterDocStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            >
              <option value="all">Semua Status Berkas</option>
              <option value="verified">Berkas Terverifikasi</option>
              <option value="pending">Menunggu Verifikasi</option>
              <option value="revision">Perlu Revisi</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">No. Registrasi & Siswa</th>
                <th className="py-3 px-4">NISN / Asal Sekolah</th>
                <th className="py-3 px-4">Jalur</th>
                <th className="py-3 px-4">Biaya (Rp 150rb)</th>
                <th className="py-3 px-4">Validasi Berkas</th>
                <th className="py-3 px-4">Status Seleksi</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredApplicants.length > 0 ? (
                filteredApplicants.map((app) => {
                  const isPaid = app.payment.status === 'paid';
                  return (
                    <tr
                      key={app.id}
                      onClick={() => setSelectedApplicant(app)}
                      className="hover:bg-emerald-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-emerald-800">
                          {app.registrationNumber}
                        </div>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">
                          {app.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Wali: {app.fatherName || app.motherName} ({app.parentWhatsapp})
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono text-slate-700">{app.nisn}</div>
                        <div className="text-slate-500 truncate max-w-[180px] mt-0.5">
                          {app.previousSchool}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {app.track}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isPaid ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {isPaid ? 'LUNAS (Rp 150rb)' : 'PENDING'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`capitalize px-2 py-0.5 rounded text-[10px] font-bold ${
                              app.documentStatus === 'verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.documentStatus === 'revision'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {app.documentStatus}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({app.documentScore}%)
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 capitalize bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {app.overallStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedApplicant(app)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                            title="Buka Berkas & Verifikasi"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <a
                            href={storageService.generateWhatsAppDetails(app).waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100"
                            title="Kirim Notifikasi WhatsApp"
                          >
                            <Send className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => setEmailPreviewApplicant(app)}
                            className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-100"
                            title="Pratinjau Kuitansi Email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>

                          {isSuperAdmin && (
                            <button
                              onClick={() => handleDeleteApplicant(app.id)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100"
                              title="Hapus Data (Super Admin)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    Tidak ada pendaftar yang cocok dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL / VERIFICATION DRAWER MODAL */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 my-6 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-emerald-900 text-white p-6 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-emerald-800/80 px-2 py-0.5 rounded">
                  Detail & Verifikasi Berkas Digital
                </span>
                <h3 className="text-xl font-bold mt-1">{selectedApplicant.fullName}</h3>
                <p className="text-xs text-emerald-200 font-mono">
                  No. Registrasi: {selectedApplicant.registrationNumber} &bull; NISN: {selectedApplicant.nisn}
                </p>
              </div>

              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Payment Section (Bendahara / Super Admin Controls) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <strong className="text-slate-900 text-sm">Status Pembayaran Formulir (Rp 150.000)</strong>
                  <span
                    className={`px-3 py-1 rounded-full font-bold ${
                      selectedApplicant.payment.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedApplicant.payment.status === 'paid' ? 'LUNAS' : 'PENDING'}
                  </span>
                </div>
                <p className="text-slate-500">
                  Metode: {selectedApplicant.payment.method.toUpperCase()} | No. Kwitansi: {selectedApplicant.payment.receiptNumber || 'Belum Terbit'}
                </p>

                {isBendahara && (
                  <div className="mt-3 pt-3 border-t border-slate-200 flex gap-2">
                    <button
                      onClick={() => handleTogglePaymentStatus(selectedApplicant)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                    >
                      {selectedApplicant.payment.status === 'paid'
                        ? 'Tandai Belum Lunas'
                        : 'Verifikasi Pembayaran Rp 150.000'}
                    </button>
                  </div>
                )}
              </div>

              {/* Digital Documents List */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Berkas Digital Calon Siswa:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Kartu Keluarga (KK)', doc: selectedApplicant.documents.kartuKeluarga },
                    { label: 'Akta Kelahiran', doc: selectedApplicant.documents.aktaKelahiran },
                    { label: 'Pas Foto 3x4', doc: selectedApplicant.documents.pasFoto },
                    { label: 'Rapor / SKL Sementara', doc: selectedApplicant.documents.raporOrSkl },
                    { label: 'Sertifikat Prestasi', doc: selectedApplicant.documents.sertifikatPrestasi },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white">
                      <div className="font-semibold text-slate-800">{item.label}</div>
                      {item.doc ? (
                        <div className="mt-1 flex items-center justify-between text-slate-500">
                          <span className="truncate max-w-[150px]">{item.doc.name}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Valid
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Tidak dilampirkan</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Verifikator Controls */}
              {isVerifikator && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                  <h4 className="font-bold text-emerald-950 text-sm">
                    Panel Verifikasi Berkas (Panitia PPDB)
                  </h4>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Catatan Verifikator untuk Pendaftar:
                    </label>
                    <textarea
                      rows={2}
                      defaultValue={selectedApplicant.verificationNotes || ''}
                      onChange={(e) => setVerificationNoteInput(e.target.value)}
                      placeholder="Contoh: Berkas telah lengkap & sah, siap mengikuti tes tahfidz."
                      className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white text-xs"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleUpdateDocumentStatus('verified')}
                      className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800"
                    >
                      Terima & Verifikasi Berkas
                    </button>
                    <button
                      onClick={() => handleUpdateDocumentStatus('revision')}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-emerald-950 font-bold hover:bg-amber-600"
                    >
                      Minta Perbaikan / Revisi
                    </button>
                    <button
                      onClick={() => handleUpdateDocumentStatus('rejected')}
                      className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700"
                    >
                      Tolak Berkas
                    </button>
                  </div>
                </div>
              )}

              {/* Status Akhir Seleksi (Kepala Sekolah / Super Admin) */}
              {isSuperAdmin && (
                <div className="p-4 bg-slate-100 rounded-2xl space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">
                    Keputusan Kelulusan Akhir (Kepala Sekolah)
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateOverallStatus('accepted')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold"
                    >
                      Lolos / Diterima
                    </button>
                    <button
                      onClick={() => handleUpdateOverallStatus('reserve')}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold"
                    >
                      Cadangan
                    </button>
                    <button
                      onClick={() => handleUpdateOverallStatus('rejected')}
                      className="px-3 py-1.5 rounded-lg bg-rose-700 text-white font-bold"
                    >
                      Tidak Lolos
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                onClick={() => storageService.printOfficialReport([selectedApplicant])}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900"
              >
                Cetak Kartu Siswa (PDF)
              </button>

              <button
                onClick={() => setSelectedApplicant(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMAIL PREVIEW MODAL */}
      {emailPreviewApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 my-6 flex flex-col max-h-[90vh]">
            <div className="bg-emerald-900 text-white p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">Pratinjau Kuitansi & Email Resmi Notifikasi</h4>
                <p className="text-[11px] text-emerald-200">
                  Dikirimkan ke: {emailPreviewApplicant.parentEmail}
                </p>
              </div>
              <button
                onClick={() => setEmailPreviewApplicant(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-slate-100">
              <iframe
                title="Email Preview"
                srcDoc={storageService.generateEmailHtml(emailPreviewApplicant)}
                className="w-full h-96 bg-white rounded-xl border border-slate-200"
              />
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setEmailPreviewApplicant(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
