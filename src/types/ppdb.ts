export type RegistrationTrack = 'reguler' | 'tahfidz' | 'prestasi' | 'afirmasi';

export type PaymentStatus = 'unpaid' | 'paid' | 'pending' | 'expired';

export type DocumentStatus = 'pending' | 'verified' | 'revision' | 'rejected';

export type OverallStatus = 'draft' | 'submitted' | 'document_verified' | 'accepted' | 'rejected' | 'reserve';

export type StaffRole = 'super_admin' | 'verifikator' | 'bendahara' | 'wali_murid';

export interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
  status: DocumentStatus;
  notes?: string;
  verifiedAt?: string;
}

export interface ApplicantDocuments {
  kartuKeluarga?: DocumentFile;
  aktaKelahiran?: DocumentFile;
  pasFoto?: DocumentFile;
  raporOrSkl?: DocumentFile;
  sertifikatPrestasi?: DocumentFile;
}

export interface PaymentDetails {
  amount: number; // 150000
  method: 'qris' | 'va_bank_aceh' | 'va_bsi' | 'va_bca' | 'va_mandiri' | 'gopay';
  paymentCode: string;
  status: PaymentStatus;
  paidAt?: string;
  transactionId?: string;
  receiptNumber?: string;
}

export interface Applicant {
  id: string;
  registrationNumber: string; // e.g. SMPMB-2026-0042
  wave: number; // Gelombang 1, 2, 3
  track: RegistrationTrack;
  createdAt: string;
  updatedAt: string;

  // Data Siswa
  fullName: string;
  nisn: string;
  nik: string;
  gender: 'L' | 'P';
  birthPlace: string;
  birthDate: string;
  previousSchool: string;
  address: string;
  studentPhone?: string;

  // Data Orang Tua / Wali
  fatherName: string;
  fatherJob: string;
  motherName: string;
  motherJob: string;
  parentWhatsapp: string;
  parentEmail: string;
  parentIncome?: string;

  // Status & Berkas
  documents: ApplicantDocuments;
  documentScore: number; // 0-100% automated score
  documentStatus: DocumentStatus;
  verificationNotes?: string;

  // Pembayaran
  payment: PaymentDetails;

  // Status Akhir
  overallStatus: OverallStatus;
  testScore?: number;
  testDate?: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  roleTitle: string;
  avatar: string;
}

export interface NotificationLog {
  id: string;
  applicantId: string;
  type: 'whatsapp' | 'email';
  recipient: string;
  subjectOrPreview: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'failed';
}
