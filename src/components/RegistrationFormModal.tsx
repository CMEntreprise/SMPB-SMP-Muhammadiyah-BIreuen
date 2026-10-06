import React, { useState } from 'react';
import { SCHOOL_INFO } from '../data/initialData';
import { Applicant, RegistrationTrack, ApplicantDocuments, DocumentFile } from '../types/ppdb';
import { storageService } from '../services/storageService';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  UploadCloud, 
  CreditCard, 
  ShieldCheck, 
  FileText, 
  User, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  QrCode,
  Building,
  Check,
  FileCheck,
  Send,
  Mail,
  Printer
} from 'lucide-react';

interface RegistrationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newApplicant: Applicant) => void;
}

export const RegistrationFormModal: React.FC<RegistrationFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [track, setTrack] = useState<RegistrationTrack>('tahfidz');
  const [fullName, setFullName] = useState('');
  const [nisn, setNisn] = useState('');
  const [nik, setNik] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [birthPlace, setBirthPlace] = useState('Bireuen');
  const [birthDate, setBirthDate] = useState('2014-05-12');
  const [previousSchool, setPreviousSchool] = useState('');
  const [address, setAddress] = useState('');
  const [studentPhone, setStudentPhone] = useState('');

  // Parent States
  const [fatherName, setFatherName] = useState('');
  const [fatherJob, setFatherJob] = useState('Wiraswasta');
  const [motherName, setMotherName] = useState('');
  const [motherJob, setMotherJob] = useState('Ibu Rumah Tangga');
  const [parentWhatsapp, setParentWhatsapp] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentIncome, setParentIncome] = useState('Rp 5.000.000 - Rp 10.000.000');

  // Documents
  const [documents, setDocuments] = useState<ApplicantDocuments>({});
  const [documentScore, setDocumentScore] = useState<number>(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va_bank_aceh' | 'va_bsi' | 'va_bca'>('qris');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [createdApplicant, setCreatedApplicant] = useState<Applicant | null>(null);

  if (!isOpen) return null;

  // Validation function per step
  const validateStep = (currentStep: number): boolean => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!fullName.trim()) errors.fullName = 'Nama lengkap wajib diisi.';
      if (!nisn.trim()) {
        errors.nisn = 'NISN wajib diisi (10 digit).';
      } else if (!/^\d{10}$/.test(nisn.trim())) {
        errors.nisn = 'NISN harus tepat 10 digit angka.';
      }

      if (!nik.trim()) {
        errors.nik = 'NIK wajib diisi (16 digit).';
      } else if (!/^\d{16}$/.test(nik.trim())) {
        errors.nik = 'NIK harus tepat 16 digit sesuai Kartu Keluarga.';
      }

      if (!previousSchool.trim()) errors.previousSchool = 'Asal sekolah SD/MI wajib diisi.';
      if (!address.trim()) errors.address = 'Alamat domisili wajib diisi.';
    }

    if (currentStep === 2) {
      if (!fatherName.trim() && !motherName.trim()) {
        errors.parentName = 'Minimal masukkan nama salah satu orang tua / wali.';
      }
      if (!parentWhatsapp.trim()) {
        errors.parentWhatsapp = 'Nomor WhatsApp aktif wajib diisi untuk notifikasi.';
      } else if (parentWhatsapp.replace(/\D/g, '').length < 10) {
        errors.parentWhatsapp = 'Nomor WhatsApp tidak valid (minimal 10 digit).';
      }
      if (!parentEmail.trim()) {
        errors.parentEmail = 'Email wajib diisi untuk pengiriman bukti pendaftaran.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) {
        errors.parentEmail = 'Format email tidak valid.';
      }
    }

    if (currentStep === 3) {
      if (!documents.kartuKeluarga) errors.kk = 'Kartu Keluarga wajib diunggah.';
      if (!documents.aktaKelahiran) errors.akta = 'Akta Kelahiran wajib diunggah.';
      if (!documents.pasFoto) errors.pasFoto = 'Pas Foto 3x4 wajib diunggah.';
      if (!documents.raporOrSkl) errors.rapor = 'Rapor / SKL wajib diunggah.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Mock auto document scanner & validator
  const handleFileUpload = (docKey: keyof ApplicantDocuments, file: File | null) => {
    if (!file) return;

    // Automated Check Rules
    const isSizeOk = file.size <= 5 * 1024 * 1024; // max 5MB
    const isTypeOk = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);

    if (!isSizeOk) {
      alert(`File ${file.name} melebihi ukuran maksimal 5MB.`);
      return;
    }
    if (!isTypeOk) {
      alert('Format berkas harus JPG, PNG, atau PDF.');
      return;
    }

    const docObj: DocumentFile = {
      id: 'doc-' + Date.now() + '-' + Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'verified', // Auto verified by client heuristics
      verifiedAt: new Date().toISOString(),
    };

    const newDocs = { ...documents, [docKey]: docObj };
    setDocuments(newDocs);

    // Calculate dynamic auto-verification score (0-100%)
    const requiredKeys = ['kartuKeluarga', 'aktaKelahiran', 'pasFoto', 'raporOrSkl'];
    const uploadedCount = requiredKeys.filter(k => (newDocs as any)[k]).length;
    const bonusPrestasi = newDocs.sertifikatPrestasi ? 10 : 0;
    const calculatedScore = Math.min(100, Math.round((uploadedCount / requiredKeys.length) * 90 + bonusPrestasi));
    setDocumentScore(calculatedScore);

    // Clear error
    const newErrors = { ...validationErrors };
    delete newErrors[docKey];
    setValidationErrors(newErrors);
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  // Finalize Registration and Trigger Instant Payment Gateway
  const handleProcessPayment = () => {
    setIsProcessingPayment(true);

    // Generate Registration Code: e.g. SMPMB-2026-XXXX
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const regNumber = `SMPMB-2026-${randomSeq}`;
    const transactionId = `TXN-PAY-${Date.now().toString().slice(-6)}`;
    const receiptNumber = `KWT-2026-${randomSeq}`;

    setTimeout(() => {
      const newApplicant: Applicant = {
        id: 'app-' + Date.now(),
        registrationNumber: regNumber,
        wave: SCHOOL_INFO.activeWave,
        track,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fullName,
        nisn,
        nik,
        gender,
        birthPlace,
        birthDate,
        previousSchool,
        address,
        studentPhone,
        fatherName,
        fatherJob,
        motherName,
        motherJob,
        parentWhatsapp,
        parentEmail,
        parentIncome,
        documents,
        documentScore: documentScore || 95,
        documentStatus: 'verified',
        verificationNotes: 'Otomatis divalidasi oleh sistem digital PPDB SMP Muhammadiyah Bireuen.',
        payment: {
          amount: SCHOOL_INFO.registrationFee,
          method: paymentMethod,
          paymentCode: paymentMethod === 'qris' ? `QRIS-SMPMB-${randomSeq}` : `VA-ACEH-7110${randomSeq}`,
          status: 'paid',
          paidAt: new Date().toISOString(),
          transactionId,
          receiptNumber,
        },
        overallStatus: 'document_verified',
      };

      // Save to persistent cloud storage
      storageService.addApplicant(newApplicant);
      setCreatedApplicant(newApplicant);
      setIsProcessingPayment(false);
      setPaymentSuccess(true);
      setStep(5); // Completion step

      // Celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      onSuccess(newApplicant);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-100 my-8 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-6 relative flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Formulir Pendaftaran Siswa Baru T.A. {SCHOOL_INFO.academicYear}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black mt-1">
              SMP Muhammadiyah Bireuen
            </h3>
            <p className="text-xs text-emerald-200 mt-0.5">
              Lengkapi data calon siswa dengan teliti. Seluruh data dienkripsi dengan aman.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        {step < 5 && (
          <div className="bg-emerald-50/70 border-b border-emerald-100 px-6 py-3 shrink-0">
            <div className="flex items-center justify-between max-w-xl mx-auto">
              {[
                { s: 1, label: 'Data Siswa' },
                { s: 2, label: 'Data Wali' },
                { s: 3, label: 'Unggah Berkas' },
                { s: 4, label: 'Biaya Rp 150rb' },
              ].map((item) => (
                <div key={item.s} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step === item.s
                        ? 'bg-emerald-700 text-white ring-4 ring-emerald-200'
                        : step > item.s
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {step > item.s ? <Check className="w-3.5 h-3.5" /> : item.s}
                  </div>
                  <span
                    className={`text-xs font-bold hidden sm:inline ${
                      step === item.s ? 'text-emerald-900' : 'text-slate-500'
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.s < 4 && <div className="w-6 sm:w-10 h-0.5 bg-slate-200 mx-1"></div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: JALUR & DATA SISWA */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Pilihan Jalur */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Pilih Jalur Pendaftaran
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'tahfidz', label: 'Tahfidz Qur\'an', desc: 'Target 3-5 Juz' },
                    { id: 'reguler', label: 'Reguler Plus', desc: 'Dwi-Bahasa' },
                    { id: 'prestasi', label: 'Prestasi Juara', desc: 'Bebas Tes' },
                    { id: 'afirmasi', label: 'Afirmasi / Lazismu', desc: 'Subsidi' },
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setTrack(t.id as RegistrationTrack)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        track === t.id
                          ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/30'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{t.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Calon Siswa */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-700" />
                  <span>Biodata Calon Peserta Didik</span>
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Siswa (sesuai Ijazah/Akta) *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Muhammad Al-Fatih"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm"
                  />
                  {validationErrors.fullName && (
                    <p className="text-xs text-rose-600 mt-1">{validationErrors.fullName}</p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      NISN (10 Digit Angka) *
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={nisn}
                      onChange={(e) => setNisn(e.target.value.replace(/\D/g, ''))}
                      placeholder="0012345678"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm font-mono"
                    />
                    {validationErrors.nisn && (
                      <p className="text-xs text-rose-600 mt-1">{validationErrors.nisn}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      NIK Calon Siswa (16 Digit) *
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      value={nik}
                      onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                      placeholder="111101XXXXXXXXXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm font-mono"
                    />
                    {validationErrors.nik && (
                      <p className="text-xs text-rose-600 mt-1">{validationErrors.nik}</p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Jenis Kelamin *
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm bg-white"
                    >
                      <option value="L">Laki-Laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tempat Lahir *
                    </label>
                    <input
                      type="text"
                      value={birthPlace}
                      onChange={(e) => setBirthPlace(e.target.value)}
                      placeholder="Bireuen"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Lahir *
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Asal Sekolah SD / MI *
                  </label>
                  <input
                    type="text"
                    value={previousSchool}
                    onChange={(e) => setPreviousSchool(e.target.value)}
                    placeholder="Contoh: SD Muhammadiyah Bireuen / MIN 1 Bireuen"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm"
                  />
                  {validationErrors.previousSchool && (
                    <p className="text-xs text-rose-600 mt-1">{validationErrors.previousSchool}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Domisili Siswa (Kabupaten Bireuen & Sekitarnya) *
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nama Gampong, Dusun, RT/RW, Kecamatan, Kab. Bireuen"
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm"
                  />
                  {validationErrors.address && (
                    <p className="text-xs text-rose-600 mt-1">{validationErrors.address}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DATA ORANG TUA / WALI */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Identitas Orang Tua / Wali Murid</span>
              </h4>
              <p className="text-xs text-slate-500">
                Informasi ini digunakan untuk komunikasi resmi, laporan hasil seleksi, dan notifikasi konfirmasi WhatsApp & Email.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Ayah
                  </label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="Nama Ayah Kandung"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pekerjaan Ayah
                  </label>
                  <input
                    type="text"
                    value={fatherJob}
                    onChange={(e) => setFatherJob(e.target.value)}
                    placeholder="PNS / Wiraswasta / Petani / dll"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Ibu *
                  </label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="Nama Ibu Kandung"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pekerjaan Ibu
                  </label>
                  <input
                    type="text"
                    value={motherJob}
                    onChange={(e) => setMotherJob(e.target.value)}
                    placeholder="Ibu Rumah Tangga / PNS / dll"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp Aktif Wali (Untuk Notifikasi Instan) *
                  </label>
                  <input
                    type="tel"
                    value={parentWhatsapp}
                    onChange={(e) => setParentWhatsapp(e.target.value)}
                    placeholder="Contoh: 085260123456"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Nomor ini akan menerima pesan konfirmasi resmi & status verifikasi berkas.
                  </p>
                  {validationErrors.parentWhatsapp && (
                    <p className="text-xs text-rose-600 mt-1">{validationErrors.parentWhatsapp}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Email Wali (Untuk Kuitansi & Tanda Bukti) *
                  </label>
                  <input
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="contoh: wali@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Kuitansi resmi pendaftaran Rp 150rb & Kartu Peserta akan dikirim ke sini.
                  </p>
                  {validationErrors.parentEmail && (
                    <p className="text-xs text-rose-600 mt-1">{validationErrors.parentEmail}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Penghasilan Gabungan Orang Tua per Bulan
                </label>
                <select
                  value={parentIncome}
                  onChange={(e) => setParentIncome(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm bg-white"
                >
                  <option value="< Rp 2.000.000 (Penerima KIP/Lazismu)">Kurang dari Rp 2.000.000 (Keluarga Prasejahtera / KIP)</option>
                  <option value="Rp 2.000.000 - Rp 5.000.000">Rp 2.000.000 - Rp 5.000.000</option>
                  <option value="Rp 5.000.000 - Rp 10.000.000">Rp 5.000.000 - Rp 10.000.000</option>
                  <option value="Rp 10.000.000 - Rp 20.000.000">Rp 10.000.000 - Rp 20.000.000</option>
                  <option value="> Rp 20.000.000">Diatas Rp 20.000.000</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: UNGGAH & VALIDASI OTOMATIS BERKAS */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    <strong className="text-sm text-emerald-950">Sistem Validasi Berkas Digital Otomatis</strong>
                  </div>
                  <p className="text-xs text-emerald-800 mt-1">
                    Sistem mengecek format, batas ukuran (maks. 5MB), dan kelayakan berkas secara real-time.
                  </p>
                </div>
                <div className="text-right pl-4">
                  <div className="text-2xl font-black text-emerald-700">{documentScore}%</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Skor Kelengkapan</div>
                </div>
              </div>

              {/* Upload Item 1: Kartu Keluarga */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">1. Kartu Keluarga (KK) Asli / Legalisir *</span>
                  {documents.kartuKeluarga ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Terunggah ({Math.round(documents.kartuKeluarga.size / 1024)} KB)
                    </span>
                  ) : (
                    <span className="text-xs text-amber-600 font-semibold">Wajib Diunggah</span>
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('kartuKeluarga', e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                />
                {validationErrors.kk && <p className="text-xs text-rose-600 mt-1">{validationErrors.kk}</p>}
              </div>

              {/* Upload Item 2: Akta Kelahiran */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">2. Akta Kelahiran Calon Siswa *</span>
                  {documents.aktaKelahiran ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Terunggah ({Math.round(documents.aktaKelahiran.size / 1024)} KB)
                    </span>
                  ) : (
                    <span className="text-xs text-amber-600 font-semibold">Wajib Diunggah</span>
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('aktaKelahiran', e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                />
                {validationErrors.akta && <p className="text-xs text-rose-600 mt-1">{validationErrors.akta}</p>}
              </div>

              {/* Upload Item 3: Pas Foto 3x4 */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">3. Pas Foto Resmi 3x4 (Latar Merah / Biru) *</span>
                  {documents.pasFoto ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Terunggah ({Math.round(documents.pasFoto.size / 1024)} KB)
                    </span>
                  ) : (
                    <span className="text-xs text-amber-600 font-semibold">Wajib Diunggah</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => handleFileUpload('pasFoto', e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                />
                {validationErrors.pasFoto && <p className="text-xs text-rose-600 mt-1">{validationErrors.pasFoto}</p>}
              </div>

              {/* Upload Item 4: Rapor / SKL */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">4. Rapor Kelas 6 (Sem. 1) atau SKL Sementara *</span>
                  {documents.raporOrSkl ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Terunggah ({Math.round(documents.raporOrSkl.size / 1024)} KB)
                    </span>
                  ) : (
                    <span className="text-xs text-amber-600 font-semibold">Wajib Diunggah</span>
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('raporOrSkl', e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                />
                {validationErrors.rapor && <p className="text-xs text-rose-600 mt-1">{validationErrors.rapor}</p>}
              </div>

              {/* Upload Item 5: Sertifikat Prestasi (Opsional) */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">5. Sertifikat Prestasi / Tahfidz (Opsional)</span>
                  {documents.sertifikatPrestasi && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Terunggah
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload('sertifikatPrestasi', e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT GATEWAY (BIAYA PENDAFTARAN RP 150.000) */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white rounded-3xl p-6 text-center shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl"></div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Tagihan Biaya Pendaftaran Resmi
                </span>
                <div className="text-4xl sm:text-5xl font-black mt-2 text-white">
                  Rp 150.000
                </div>
                <p className="text-xs text-emerald-200 mt-2 max-w-md mx-auto">
                  Biaya formulir & verifikasi berkas digital PPDB SMP Muhammadiyah Bireuen T.A. {SCHOOL_INFO.academicYear}.
                </p>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Pilih Saluran Pembayaran (Payment Gateway Instan):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* QRIS */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qris')}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === 'qris'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center shrink-0">
                      <QrCode className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">QRIS Instan (Rekomendasi)</div>
                      <div className="text-xs text-slate-500 mt-0.5">Semua Mobile Banking & E-Wallet (BCA, BSI, GoPay, OVO, ShopeePay)</div>
                    </div>
                  </button>

                  {/* Bank Aceh Syariah */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('va_bank_aceh')}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === 'va_bank_aceh'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center shrink-0">
                      <Building className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Virtual Account Bank Aceh</div>
                      <div className="text-xs text-slate-500 mt-0.5">Action Mobile Banking & ATM Bank Aceh Syariah</div>
                    </div>
                  </button>

                  {/* BSI */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('va_bsi')}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === 'va_bsi'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center shrink-0">
                      <Building className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Virtual Account BSI Syariah</div>
                      <div className="text-xs text-slate-500 mt-0.5">BSI Mobile & ATM Bank Syariah Indonesia</div>
                    </div>
                  </button>

                  {/* BCA */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('va_bca')}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === 'va_bca'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center shrink-0">
                      <CreditCard className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">Virtual Account BCA / Prima</div>
                      <div className="text-xs text-slate-500 mt-0.5">BCA Mobile, myBCA & Seluruh Bank Lain</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Gateway Interactive Preview */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Nama Calon Siswa:</span>
                  <strong className="text-slate-900">{fullName}</strong>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Pilihan Jalur:</span>
                  <span className="font-bold text-emerald-700 uppercase">{track}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Notifikasi Otomatis Terhubung:</span>
                  <span className="font-bold text-slate-900">WhatsApp ({parentWhatsapp}) & Email ({parentEmail})</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Total Pembayaran:</span>
                  <span className="font-extrabold text-base text-emerald-700">Rp 150.000 (Nett)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: REGISTRATION COMPLETE & NOTIFICATION ACTIONS */}
          {step === 5 && createdApplicant && (
            <div className="text-center space-y-6 py-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-md">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Pendaftaran Berhasil & Lunas
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-3">
                  Alhamdulillah, Selamat Datang di SMP Muhammadiyah Bireuen!
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-md mx-auto">
                  Data calon peserta didik <strong className="text-slate-900">{createdApplicant.fullName}</strong> telah resmi tercatat dengan nomor registrasi:
                </p>
                <div className="inline-block mt-3 px-6 py-2.5 rounded-2xl bg-slate-900 text-amber-300 font-mono font-black text-lg sm:text-xl shadow-inner">
                  {createdApplicant.registrationNumber}
                </div>
              </div>

              {/* Status Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left max-w-lg mx-auto text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Biaya Formulir:</span>
                  <span className="font-bold text-emerald-700">Rp 150.000 (Lunas / Verified)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Kwitansi:</span>
                  <span className="font-mono text-slate-800">{createdApplicant.payment.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Skor Kelengkapan Berkas:</span>
                  <span className="font-bold text-emerald-700">{createdApplicant.documentScore}% (Siap Seleksi)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal Transaksi:</span>
                  <span className="text-slate-800">{new Date(createdApplicant.createdAt).toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Action Buttons: WhatsApp, Email, & Cetak Bukti */}
              <div className="space-y-3 max-w-md mx-auto">
                {/* Trigger Real WhatsApp Direct Link */}
                <a
                  href={storageService.generateWhatsAppDetails(createdApplicant).waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Notifikasi Konfirmasi ke WhatsApp ({createdApplicant.parentWhatsapp})</span>
                </a>

                {/* Print/Download Official Card */}
                <button
                  type="button"
                  onClick={() => storageService.printOfficialReport([createdApplicant])}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan Kartu Pendaftaran & Kuitansi (PDF)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          {step < 5 ? (
            <>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
              ) : (
                <div></div>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all"
                >
                  <span>Lanjutkan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={isProcessingPayment}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-black text-xs shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Memverifikasi Pembayaran Rp 150.000...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Konfirmasi & Bayar Rp 150.000 (Verifikasi Instan)</span>
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Selesai & Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
