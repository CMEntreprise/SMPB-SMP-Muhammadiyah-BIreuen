import React from 'react';
import { SCHOOL_INFO } from '../data/initialData';
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  MessageSquare, 
  FileCheck, 
  Users, 
  Calendar,
  BookOpen,
  Award
} from 'lucide-react';

interface HeroProps {
  onOpenRegister: () => void;
  onOpenCheckStatus: () => void;
  totalApplicants: number;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenRegister,
  onOpenCheckStatus,
  totalApplicants,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Decorative Islamic Geometric subtle background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
      
      {/* Glow orb decorations */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-emerald-200 text-xs sm:text-sm font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>PPDB Online SMP Muhammadiyah Bireuen T.A. {SCHOOL_INFO.academicYear}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Membentuk Generasi <span className="text-amber-400 underline decoration-emerald-500 underline-offset-8">Qur’ani</span> & Berkeunggulan Global
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Pendaftaran Peserta Didik Baru (PPDB) SMP Muhammadiyah Bireuen kini serba digital, mudah, dan transparan. Dilengkapi sistem validasi berkas instan, verifikasi pembayaran digital, serta notifikasi resmi via WhatsApp & Email.
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm font-medium text-emerald-100">
              <div className="flex items-center gap-2 bg-emerald-800/40 p-2.5 rounded-xl border border-emerald-700/50">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Akreditasi A Unggul</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-800/40 p-2.5 rounded-xl border border-emerald-700/50">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Tahfidz & Bilingual</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-800/40 p-2.5 rounded-xl border border-emerald-700/50 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Robotika & Tapak Suci</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onOpenRegister}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-base shadow-xl shadow-amber-400/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Daftar Siswa Baru Sekarang</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onOpenCheckStatus}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800 text-white font-bold text-sm border border-emerald-600/50 backdrop-blur-md transition-all hover:border-emerald-400"
              >
                <span>Cek Status / Unduh Kartu</span>
              </button>
            </div>

            <p className="text-xs text-emerald-300/80 pt-1">
              * Biaya pendaftaran resmi: <span className="font-bold text-amber-300">Rp 150.000</span> (Sudah termasuk formulir, verifikasi berkas digital, dan tes pemetaan).
            </p>
          </div>

          {/* Right Column: Interactive Quick Information Box */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-6">
                <div>
                  <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">Status Gelombang</span>
                  <h3 className="text-xl font-bold text-white">Gelombang I (Reguler & Prestasi)</h3>
                </div>
                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full text-xs font-bold">
                  Dibuka
                </div>
              </div>

              {/* Live Metric Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-emerald-950/60 rounded-2xl p-4 border border-emerald-700/40">
                  <span className="text-xs text-emerald-300 block mb-1">Total Pendaftar Terdata</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">{totalApplicants}</span>
                    <span className="text-xs text-emerald-300">/ {SCHOOL_INFO.totalQuota} Kuota</span>
                  </div>
                  <div className="w-full bg-emerald-900/80 h-2 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (totalApplicants / SCHOOL_INFO.totalQuota) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-emerald-950/60 rounded-2xl p-4 border border-emerald-700/40">
                  <span className="text-xs text-emerald-300 block mb-1">Biaya Pendaftaran</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                    Rp 150.000
                  </div>
                  <span className="text-[11px] text-emerald-300 block mt-1">Verifikasi Instan via QRIS / VA</span>
                </div>
              </div>

              {/* Digital Features Checklist */}
              <div className="space-y-3 text-xs sm:text-sm text-emerald-100">
                <div className="flex items-start gap-3">
                  <FileCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Auto-Validation Berkas:</strong> Sistem otomatis mendeteksi kelengkapan & kualitas file KK, Akta & Rapor.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CreditCard className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Payment Gateway Instan:</strong> Bayar Rp 150rb via QRIS, Bank Aceh Syariah, BSI, BCA tanpa konfirmasi manual.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Notifikasi Otomatis:</strong> Konfirmasi pendaftaran & kuitansi langsung terkirim ke WhatsApp & Email wali.
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200">
                <span>📍 Lokasi: Geulanggang Baro, Bireuen</span>
                <span className="font-semibold text-amber-300">NPSN: {SCHOOL_INFO.npsn}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
