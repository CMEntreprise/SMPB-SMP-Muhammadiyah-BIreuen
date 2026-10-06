import React from 'react';
import { 
  BookOpen, 
  Award, 
  HeartHandshake, 
  Sparkles, 
  CheckCircle, 
  Compass, 
  Laptop, 
  Shield, 
  Music, 
  Building2,
  Check
} from 'lucide-react';

interface SchoolProfileProps {
  onOpenRegister: () => void;
}

export const SchoolProfile: React.FC<SchoolProfileProps> = ({ onOpenRegister }) => {
  return (
    <div id="profil" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Mengenal Sekolah Kami
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Pilihan Terbaik Pendidikan Menengah Pertama di Bireuen
          </h2>
          <p className="text-slate-600 mt-4 text-base leading-relaxed">
            SMP Muhammadiyah Bireuen memadukan kurikulum nasional, penguatan karakter Islami berlandaskan Al-Qur'an dan Sunnah, serta kecakapan teknologi digital abad ke-21.
          </p>
        </div>

        {/* Visi & Misi Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mb-6 shadow-md shadow-emerald-700/20">
              <Compass className="w-6 h-6 text-amber-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Visi Sekolah</h3>
            <blockquote className="text-emerald-900 font-semibold text-lg italic border-l-4 border-amber-400 pl-4 py-1 bg-emerald-50/50 rounded-r-xl">
              "Terwujudnya Lulusan yang Berakhlak Mulia, Unggul dalam Prestasi Akademik, Berwawasan Teknologi, dan Berdaya Saing Global Berlandaskan Nilai-Nilai Islam."
            </blockquote>
            <p className="text-sm text-slate-600 mt-4 leading-relaxed">
              Kami mendidik setiap siswa untuk tidak hanya pandai dalam sains dan teknologi, namun memiliki pondasi tauhid yang kokoh, adab yang santun, serta jiwa kepemimpinan berkemajuan.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mb-6 shadow-md shadow-emerald-700/20">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Misi Unggulan</h3>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Menyelenggarakan pembelajaran berbasis Al-Qur'an dengan program tahsin dan tahfidz intensif.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Mengembangkan literasi digital, sains, matematika, dan teknologi robotika aplikatif.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Membiasakan pergaulan islami, shalat berjamaah, dan kepanduan Hizbul Wathan serta Tapak Suci.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Membekali keterampilan komunikasi dwi-bahasa (Bahasa Arab dan Bahasa Inggris).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4 Jalur Pendaftaran */}
        <div id="jalur" className="pt-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Jalur Pendaftaran
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
              Pilihan Jalur Pendaftaran Siswa Baru
            </h3>
            <p className="text-slate-600 text-sm mt-2">
              Pilih jalur yang paling sesuai dengan minat, bakat, dan potensi ananda tercinta.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Jalur 1: Reguler Plus */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Jalur Reguler Plus</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Kurikulum Merdeka Nasional yang diperkaya kajian Al-Islam, Kemuhammadiyahan, Bahasa Arab, dan pembelajaran aktif berbasis proyek.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tes Pemetaan Dasar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kelas Dwi-Bahasa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Biaya Formulir Rp 150rb</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onOpenRegister}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 text-xs font-bold transition-all text-center"
              >
                Pilih Jalur Ini
              </button>
            </div>

            {/* Jalur 2: Tahfidz Qur'an */}
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-600 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Terfavorit
              </div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Jalur Tahfidz Qur'an</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Program khusus akselerasi hafalan Al-Qur'an target minimal 3 - 5 Juz mutqin dengan bimbingan asatidz bersanad qira'ah.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Halaqah Tahfidz Harian</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Wisuda Tahfidz Berkala</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Uji Hafalan Masuk</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onOpenRegister}
                className="mt-6 w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all text-center shadow-sm"
              >
                Pilih Jalur Tahfidz
              </button>
            </div>

            {/* Jalur 3: Prestasi */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Jalur Prestasi</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Bagi siswa peraih juara OSN, KSM, O2SN, FLS2N, atau MTQ tingkat kabupaten/provinsi/nasional.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Bebas Tes Akademik</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Beasiswa Potongan SPP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Upload Sertifikat Juara</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onOpenRegister}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 text-xs font-bold transition-all text-center"
              >
                Pilih Jalur Prestasi
              </button>
            </div>

            {/* Jalur 4: Afirmasi / Lazismu */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Jalur Afirmasi</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Dukungan beasiswa pendidikan penuh / parsial bagi anak yatim, piatu, atau keluarga prasejahtera berkolaborasi dengan Lazismu Bireuen.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Subsidi Biaya Pendidikan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verifikasi Faktual Lazismu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Prioritas Bantuan Seragam</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onOpenRegister}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 text-xs font-bold transition-all text-center"
              >
                Pilih Jalur Afirmasi
              </button>
            </div>
          </div>
        </div>

        {/* Fasilitas & Ekstrakurikuler */}
        <div className="mt-20 bg-emerald-950 text-white rounded-3xl p-8 sm:p-12">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Fasilitas & Pengembangan Bakat
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Ekosistem Belajar yang Lengkap, Nyaman, dan Menginspirasi
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-emerald-900/60 p-5 rounded-2xl border border-emerald-800">
              <Laptop className="w-8 h-8 text-amber-300 mb-3" />
              <h5 className="font-bold text-base text-white">Lab Komputer & Robotika</h5>
              <p className="text-xs text-emerald-200 mt-1">
                Dilengkapi PC modern berkecepatan tinggi, perangkat coding robotika mikrokontroler, dan akses internet terfilter.
              </p>
            </div>

            <div className="bg-emerald-900/60 p-5 rounded-2xl border border-emerald-800">
              <Shield className="w-8 h-8 text-amber-300 mb-3" />
              <h5 className="font-bold text-base text-white">Tapak Suci Putera Muhammadiyah</h5>
              <p className="text-xs text-emerald-200 mt-1">
                Ekskul beladiri resmi melatih ketahanan fisik, kedisiplinan, sportivitas, dan prestasi kejuaraan silat berjenjang.
              </p>
            </div>

            <div className="bg-emerald-900/60 p-5 rounded-2xl border border-emerald-800">
              <Building2 className="w-8 h-8 text-amber-300 mb-3" />
              <h5 className="font-bold text-base text-white">Masjid Sekolah & Aula Pertemuan</h5>
              <p className="text-xs text-emerald-200 mt-1">
                Pusat ibadah shalat berjamaah zhuhur dan ashar, kultum siswa, serta kegiatan pembinaan tilawah dan tahfidz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
