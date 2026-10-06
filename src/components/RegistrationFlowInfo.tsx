import React, { useState } from 'react';
import { SCHOOL_INFO } from '../data/initialData';
import { 
  FileEdit, 
  UploadCloud, 
  CreditCard, 
  MessageSquare, 
  GraduationCap, 
  HelpCircle, 
  ChevronDown, 
  CheckCircle,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface RegistrationFlowInfoProps {
  onOpenRegister: () => void;
}

export const RegistrationFlowInfo: React.FC<RegistrationFlowInfoProps> = ({ onOpenRegister }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const steps = [
    {
      step: '01',
      title: 'Isi Formulir Online',
      desc: 'Lengkapi biodata calon siswa (NISN, NIK), data orang tua/wali, serta pilih jalur pendaftaran (Reguler, Tahfidz, Prestasi).',
      icon: <FileEdit className="w-6 h-6 text-emerald-600" />,
    },
    {
      step: '02',
      title: 'Unggah Berkas Digital',
      desc: 'Unggah foto/scan KK, Akta Kelahiran, Pas Foto 3x4, dan Rapor. Sistem otomatis memvalidasi format, ukuran, dan skor kelayakan berkas.',
      icon: <UploadCloud className="w-6 h-6 text-emerald-600" />,
    },
    {
      step: '03',
      title: 'Bayar Biaya Rp 150.000',
      desc: 'Lakukan pembayaran biaya pendaftaran via Payment Gateway (QRIS instan, Virtual Account Bank Aceh Syariah, BSI, BCA).',
      icon: <CreditCard className="w-6 h-6 text-emerald-600" />,
    },
    {
      step: '04',
      title: 'Konfirmasi WA & Email',
      desc: 'Dapatkan bukti pendaftaran resmi dan kuitansi pembayaran instan yang dikirim langsung ke WhatsApp dan Email wali murid.',
      icon: <MessageSquare className="w-6 h-6 text-emerald-600" />,
    },
    {
      step: '05',
      title: 'Tes Pemetaan & Pengumuman',
      desc: 'Ikuti tes pemetaan potensi akademik dan baca Al-Qur\'an. Cek status hasil seleksi secara online kapan saja melalui portal.',
      icon: <GraduationCap className="w-6 h-6 text-emerald-600" />,
    },
  ];

  const faqs = [
    {
      q: 'Berapa biaya pendaftaran siswa baru dan bagaimana cara membayarnya?',
      a: 'Biaya pendaftaran resmi adalah sebesar Rp 150.000,- (seratus lima puluh ribu rupiah). Pembayaran dilakukan secara instan melalui Payment Gateway terintegrasi menggunakan QRIS (semua e-wallet/mobile banking) atau Virtual Account (Bank Aceh Syariah, BSI, BCA, Mandiri). Verifikasi berlangsung seketika tanpa perlu kirim bukti struk fisik.',
    },
    {
      q: 'Bagaimana sistem validasi otomatis berkas digital bekerja?',
      a: 'Sistem kami dilengkapi algoritma verifikasi digital yang otomatis mengecek format file (.jpg, .png, .pdf), memastikan ukuran file tidak melebihi batas (maksimal 5MB), dan menghitung skor kelayakan dokumen. Jika berkas buram atau tidak sesuai, panitia akan memberikan catatan revisi pada akun pendaftar.',
    },
    {
      q: 'Apakah saya akan menerima bukti pembayaran dan pendaftaran?',
      a: 'Ya, segera setelah pembayaran Rp 150.000 terverifikasi lunas, sistem akan otomatis mengirimkan notifikasi WhatsApp konfirmasi serta Email resmi berisi kuitansi ber-QR Code dan tautan untuk mengunduh Kartu Peserta PPDB.',
    },
    {
      q: 'Bagaimana jika belum memiliki NISN atau ijazah belum keluar?',
      a: 'Bagi siswa kelas 6 SD/MI yang ijazahnya belum terbit, dapat menggunakan Surat Keterangan Lulus (SKL) sementara atau nilai rapor semester 1–5 yang dilegalisir kepala sekolah asal. NISN dapat dicek pada rapor SD atau kartu NISN dari sekolah asal.',
    },
    {
      q: 'Apakah ada kuota beasiswa bagi anak yatim atau keluarga prasejahtera?',
      a: 'Tersedia Jalur Afirmasi bekerjasama dengan Lazismu Bireuen untuk anak yatim/piatu serta keluarga prasejahtera dengan subsidi biaya pendidikan. Silakan pilih jalur "Afirmasi" saat mendaftar.',
    },
  ];

  return (
    <div id="alur" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Panduan Pendaftaran
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Alur Pendaftaran Mudah & Transparan
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Proses 5 langkah cepat dari rumah tanpa perlu antre di sekolah.
          </p>
        </div>

        {/* 5-Step Cards */}
        <div className="grid md:grid-cols-5 gap-4 relative mb-20">
          {steps.map((item, index) => (
            <div
              key={index}
              className="bg-slate-50 hover:bg-emerald-50/50 rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between group relative"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black text-emerald-700/80 group-hover:text-emerald-700">
                  {item.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-base mb-2 group-hover:text-emerald-900">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Gelombang & Biaya Callout */}
        <div className="grid lg:grid-cols-3 gap-6 mb-20">
          <div className="bg-emerald-900 text-white rounded-3xl p-8 lg:col-span-1 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Investasi Pendaftaran
              </span>
              <h3 className="text-2xl font-bold mt-2">Biaya Pendaftaran Resmi</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-amber-400">Rp 150.000</span>
                <span className="text-emerald-200 text-xs">/ calon siswa</span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-3 leading-relaxed">
                Biaya ini mencakup formulir digital, verifikasi berkas, administrasi seleksi, tes pemetaan minat bakat, dan kartu ujian resmi.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-emerald-800">
              <button
                onClick={onOpenRegister}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-sm transition-all shadow-md text-center"
              >
                Mulai Pendaftaran Sekarang
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 lg:col-span-2">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>Jadwal Gelombang Pendaftaran T.A. {SCHOOL_INFO.academicYear}</span>
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border-2 border-emerald-500 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      SEDANG DIBUKA
                    </span>
                    <strong className="text-slate-900 text-base">Gelombang I (Early Bird)</strong>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Periode: 1 Oktober 2026 - 31 Desember 2026 &bull; Kuota: 80 Siswa
                  </p>
                  <p className="text-xs text-emerald-700 font-semibold mt-1">
                    🎁 Bonus: Subsidi 20% Paket Seragam Sekolah Lengkap
                  </p>
                </div>
                <button
                  onClick={onOpenRegister}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shrink-0"
                >
                  Daftar Gelombang 1
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                      MENDATANG
                    </span>
                    <strong className="text-slate-800 text-base">Gelombang II</strong>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Periode: 2 Januari 2027 - 31 Maret 2027 &bull; Kuota: 60 Siswa
                  </p>
                </div>
                <span className="text-xs text-slate-500 font-medium">Buka Jan 2027</span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-75">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                      MENDATANG
                    </span>
                    <strong className="text-slate-800 text-base">Gelombang III</strong>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Periode: 1 April 2027 - 15 Juni 2027 &bull; Kuota sisa (jika belum penuh)
                  </p>
                </div>
                <span className="text-xs text-slate-500 font-medium">Buka Apr 2027</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Tanya Jawab
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full text-left p-5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between gap-4 transition-colors"
                  >
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-emerald-700' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-5 bg-white text-slate-600 text-sm leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
