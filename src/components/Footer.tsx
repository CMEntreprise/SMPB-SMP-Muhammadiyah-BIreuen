import React from 'react';
import { SCHOOL_INFO } from '../data/initialData';
import { storageService } from '../services/storageService';
import { Sparkles, MapPin, Phone, Mail, Globe, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenRegister: () => void;
  onOpenCheckStatus: () => void;
  onNavigateTab: (tab: 'landing' | 'dashboard') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenRegister,
  onOpenCheckStatus,
  onNavigateTab,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-300 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-amber-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-base">
                  SMP MUHAMMADIYAH BIREUEN
                </h4>
                <p className="text-[11px] text-emerald-400">Akreditasi {SCHOOL_INFO.accreditation}</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Mendidik generasi Qur'ani, berakhlak mulia, unggul dalam sains teknologi, dan berdaya saing global di Kabupaten Bireuen, Aceh.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>NPSN: {SCHOOL_INFO.npsn}</span>
            </div>
          </div>

          {/* Col 2: Alamat & Kontak */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-sm uppercase tracking-wider">
              Sekretariat PPDB
            </h5>
            <div className="flex items-start gap-2.5 text-slate-400">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{SCHOOL_INFO.address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{SCHOOL_INFO.phone} / WA: {SCHOOL_INFO.whatsapp}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{SCHOOL_INFO.email}</span>
            </div>
          </div>

          {/* Col 3: Jalur & Program */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-sm uppercase tracking-wider">
              Program Unggulan
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>&bull; Program Tahfidz Al-Qur'an (Target 3 - 5 Juz)</li>
              <li>&bull; Kelas Bilingual (Bahasa Arab & Inggris)</li>
              <li>&bull; Laboratorium Komputer & Robotika Coding</li>
              <li>&bull; Tapak Suci Putera Muhammadiyah</li>
              <li>&bull; Pandu Hizbul Wathan (HW)</li>
              <li>&bull; Beasiswa Afirmasi Lazismu Bireuen</li>
            </ul>
          </div>

          {/* Col 4: Tautan Cepat & PPDB */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-sm uppercase tracking-wider">
              Layanan Cepat
            </h5>
            <div className="flex flex-col gap-2">
              <button
                onClick={onOpenRegister}
                className="text-left hover:text-amber-300 transition-colors"
              >
                &rarr; Pendaftaran Siswa Baru Online (Rp 150rb)
              </button>
              <button
                onClick={onOpenCheckStatus}
                className="text-left hover:text-amber-300 transition-colors"
              >
                &rarr; Cek Status Pendaftaran & Unduh Kartu
              </button>
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="text-left hover:text-amber-300 transition-colors"
              >
                &rarr; Portal Staf Panitia & Rekap Data
              </button>
              <a
                href={storageService.generateWhatsAppDetails({
                  parentWhatsapp: SCHOOL_INFO.whatsapp,
                  fullName: 'Calon Wali Murid',
                  registrationNumber: 'KONSULTASI',
                  previousSchool: '-',
                  track: 'tahfidz',
                  payment: { amount: 150000, method: 'qris', paymentCode: '', status: 'paid' },
                  documentStatus: 'verified',
                  documentScore: 100,
                  overallStatus: 'submitted',
                  id: '',
                  wave: 1,
                  createdAt: '',
                  updatedAt: '',
                  nisn: '',
                  nik: '',
                  gender: 'L',
                  birthPlace: '',
                  birthDate: '',
                  address: '',
                  fatherName: '',
                  fatherJob: '',
                  motherName: '',
                  motherJob: '',
                  parentEmail: '',
                  documents: {},
                } as any).waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-left text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                &rarr; Konsultasi Langsung via WhatsApp Panitia
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            &copy; {new Date().getFullYear()} SMP Muhammadiyah Bireuen. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <p className="text-slate-400">
            Sistem PPDB Digital Terpadu &bull; Payment Gateway &bull; Notifikasi WhatsApp & Email
          </p>
        </div>
      </div>
    </footer>
  );
};
