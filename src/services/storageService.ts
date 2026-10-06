import { Applicant, StaffUser, StaffRole } from '../types/ppdb';
import { INITIAL_APPLICANTS, STAFF_ACCOUNTS, SCHOOL_INFO } from '../data/initialData';

const STORAGE_KEY = 'ppdb_smp_muh_bireuen_v2';
const CURRENT_USER_KEY = 'ppdb_current_user_v2';

export const storageService = {
  getApplicants(): Applicant[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveApplicants(INITIAL_APPLICANTS);
        return INITIAL_APPLICANTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse applicants from storage', e);
      return INITIAL_APPLICANTS;
    }
  },

  saveApplicants(applicants: Applicant[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applicants));
      // Dispatch custom event for real-time reactive sync across components
      window.dispatchEvent(new Event('ppdb-data-updated'));
    } catch (e) {
      console.error('Failed to save applicants to storage', e);
    }
  },

  addApplicant(applicant: Applicant): Applicant {
    const list = this.getApplicants();
    // Prepend new applicant
    const updated = [applicant, ...list];
    this.saveApplicants(updated);
    return applicant;
  },

  updateApplicant(id: string, updates: Partial<Applicant>): Applicant | null {
    const list = this.getApplicants();
    const idx = list.findIndex(a => a.id === id);
    if (idx === -1) return null;
    const updatedApplicant = {
      ...list[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updatedApplicant;
    this.saveApplicants(list);
    return updatedApplicant;
  },

  deleteApplicant(id: string): boolean {
    const list = this.getApplicants();
    const filtered = list.filter(a => a.id !== id);
    if (filtered.length === list.length) return false;
    this.saveApplicants(filtered);
    return true;
  },

  findByNisnOrReg(query: string): Applicant | undefined {
    const clean = query.trim().toUpperCase();
    const list = this.getApplicants();
    return list.find(
      a =>
        a.nisn.toUpperCase() === clean ||
        a.registrationNumber.toUpperCase() === clean ||
        a.nik.toUpperCase() === clean
    );
  },

  resetToDefault(): void {
    this.saveApplicants(INITIAL_APPLICANTS);
  },

  getCurrentUser(): StaffUser {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return STAFF_ACCOUNTS[0]; // default: Super Admin
  },

  setCurrentUser(user: StaffUser): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('ppdb-user-changed'));
  },

  getStaffAccounts(): StaffUser[] {
    return STAFF_ACCOUNTS;
  },

  // Export to Excel (CSV with UTF-8 BOM compatible with Excel/Numbers)
  exportToExcel(applicants: Applicant[]): void {
    const headers = [
      'No',
      'No Registrasi',
      'Gelombang',
      'Jalur',
      'Nama Siswa',
      'NISN',
      'NIK',
      'L/P',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Asal Sekolah SD/MI',
      'Nama Ayah',
      'Pekerjaan Ayah',
      'Nama Ibu',
      'No WA Wali',
      'Email Wali',
      'Alamat',
      'Status Pembayaran (Rp 150.000)',
      'Metode Bayar',
      'Status Berkas',
      'Skor Berkas (%)',
      'Status Akhir PPDB',
      'Tanggal Daftar',
    ];

    const rows = applicants.map((app, index) => [
      index + 1,
      `"${app.registrationNumber}"`,
      `Gelombang ${app.wave}`,
      app.track.toUpperCase(),
      `"${app.fullName.replace(/"/g, '""')}"`,
      `'${app.nisn}`,
      `'${app.nik}`,
      app.gender,
      `"${app.birthPlace}"`,
      app.birthDate,
      `"${app.previousSchool.replace(/"/g, '""')}"`,
      `"${app.fatherName.replace(/"/g, '""')}"`,
      `"${app.fatherJob}"`,
      `"${app.motherName.replace(/"/g, '""')}"`,
      `'${app.parentWhatsapp}`,
      `"${app.parentEmail}"`,
      `"${app.address.replace(/"/g, '""')}"`,
      app.payment.status === 'paid' ? 'LUNAS (Rp 150.000)' : 'BELUM LUNAS',
      app.payment.method.toUpperCase(),
      app.documentStatus.toUpperCase(),
      `${app.documentScore}%`,
      app.overallStatus.toUpperCase(),
      new Date(app.createdAt).toLocaleDateString('id-ID'),
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    link.download = `Rekapitulasi_PPDB_SMP_Muhammadiyah_Bireuen_${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Export Printable PDF Report with Official Kop Surat
  printOfficialReport(applicants: Applicant[]): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Mohon izinkan pop-up peramban untuk mencetak laporan PDF.');
      return;
    }

    const totalPaid = applicants.filter(a => a.payment.status === 'paid').length;
    const totalVerified = applicants.filter(a => a.documentStatus === 'verified').length;
    const totalAccepted = applicants.filter(a => a.overallStatus === 'accepted').length;
    const totalFunds = totalPaid * SCHOOL_INFO.registrationFee;

    const html = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="utf-8">
        <title>Laporan Resmi Rekapitulasi PPDB - SMP Muhammadiyah Bireuen</title>
        <style>
          @page { size: A4 landscape; margin: 15mm; }
          body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; color: #111; margin: 0; padding: 20px; }
          .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 15px; position: relative; }
          .header h2 { margin: 0; font-size: 18pt; text-transform: uppercase; letter-spacing: 1px; color: #065f46; }
          .header h3 { margin: 4px 0; font-size: 14pt; }
          .header p { margin: 2px 0; font-size: 10pt; color: #444; }
          .meta-title { text-align: center; margin: 16px 0 10px 0; font-size: 13pt; font-weight: bold; text-decoration: underline; }
          .meta-info { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 10pt; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 9.5pt; }
          th, td { border: 1px solid #333; padding: 6px 8px; text-align: left; }
          th { background-color: #f1f5f9; text-align: center; font-weight: bold; }
          .text-center { text-align: center; }
          .badge { padding: 2px 6px; font-size: 8pt; border-radius: 4px; font-weight: bold; display: inline-block; }
          .badge-paid { background: #dcfce7; color: #166534; }
          .badge-unpaid { background: #fee2e2; color: #991b1b; }
          .summary-box { margin-top: 16px; display: flex; gap: 20px; font-size: 10pt; background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; }
          .signature-area { margin-top: 40px; display: flex; justify-content: space-between; page-break-inside: avoid; }
          .sign-col { width: 250px; text-align: center; }
          .sign-space { height: 75px; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 15px; text-align: right;">
          <button onclick="window.print()" style="padding: 8px 16px; background: #065f46; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12pt;">
            🖨️ Cetak / Simpan ke PDF
          </button>
        </div>

        <div class="header">
          <div style="font-size: 11pt; font-weight: bold; color: #15803d; letter-spacing: 2px;">MAJELIS PENDIDIKAN DASAR DAN MENENGAH PDM BIREUEN</div>
          <h2>SMP MUHAMMADIYAH BIREUEN</h2>
          <p>NPSN: ${SCHOOL_INFO.npsn} | Terakreditasi: ${SCHOOL_INFO.accreditation}</p>
          <p>${SCHOOL_INFO.address}</p>
          <p>Telepon: ${SCHOOL_INFO.phone} | WhatsApp: ${SCHOOL_INFO.whatsapp} | Website: ${SCHOOL_INFO.website}</p>
        </div>

        <div class="meta-title">REKAPITULASI PENERIMAAN PESERTA DIDIK BARU (PPDB) T.A. ${SCHOOL_INFO.academicYear}</div>
        <div class="meta-info">
          <div>Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div>Total Calon Siswa Terdata: <strong>${applicants.length} Orang</strong></div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 30px;">No</th>
              <th>No. Registrasi</th>
              <th>Nama Calon Siswa</th>
              <th>NISN</th>
              <th>L/P</th>
              <th>Asal Sekolah SD/MI</th>
              <th>Jalur</th>
              <th>Nama Wali</th>
              <th>No. WhatsApp</th>
              <th>Pembayaran (Rp 150rb)</th>
              <th>Status Berkas</th>
              <th>Status Akhir</th>
            </tr>
          </thead>
          <tbody>
            ${applicants
              .map(
                (app, i) => `
              <tr>
                <td class="text-center">${i + 1}</td>
                <td class="text-center font-bold"><strong>${app.registrationNumber}</strong></td>
                <td><strong>${app.fullName}</strong></td>
                <td class="text-center">${app.nisn}</td>
                <td class="text-center">${app.gender}</td>
                <td>${app.previousSchool}</td>
                <td class="text-center" style="text-transform: capitalize;">${app.track}</td>
                <td>${app.fatherName || app.motherName}</td>
                <td class="text-center">${app.parentWhatsapp}</td>
                <td class="text-center">
                  <span class="badge ${app.payment.status === 'paid' ? 'badge-paid' : 'badge-unpaid'}">
                    ${app.payment.status === 'paid' ? 'LUNAS' : 'PENDING'}
                  </span>
                </td>
                <td class="text-center" style="text-transform: capitalize;">${app.documentStatus}</td>
                <td class="text-center" style="font-weight: bold; text-transform: capitalize;">${app.overallStatus}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="summary-box">
          <div><strong>Total Pendaftar:</strong> ${applicants.length} Siswa</div>
          <div><strong>Pembayaran Lunas:</strong> ${totalPaid} Siswa (Rp ${totalFunds.toLocaleString('id-ID')})</div>
          <div><strong>Berkas Terverifikasi:</strong> ${totalVerified} Siswa</div>
          <div><strong>Lolos Seleksi Diterima:</strong> ${totalAccepted} Siswa</div>
          <div><strong>Kuota Tersedia:</strong> ${SCHOOL_INFO.totalQuota - applicants.length} Kursi</div>
        </div>

        <div class="signature-area">
          <div class="sign-col">
            <p>Mengetahui,</p>
            <p><strong>Kepala SMP Muhammadiyah Bireuen</strong></p>
            <div class="sign-space"></div>
            <p><strong><u>${SCHOOL_INFO.principal}</u></strong></p>
            <p>NBM. 1029.384.11</p>
          </div>

          <div class="sign-col">
            <p>Bireuen, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p><strong>Ketua Panitia PPDB 2026</strong></p>
            <div class="sign-space"></div>
            <p><strong><u>${SCHOOL_INFO.committeeLeader}</u></strong></p>
            <p>NBM. 1092.481.09</p>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  },

  // Generate WhatsApp Message & Click-to-Chat URL
  generateWhatsAppDetails(applicant: Applicant) {
    const isPaid = applicant.payment.status === 'paid';
    const message = `*KONFIRMASI PENDAFTARAN PPDB SMP MUHAMMADIYAH BIREUEN*
Tahun Ajaran ${SCHOOL_INFO.academicYear}
---------------------------------------------
Assalamu'alaikum Wr. Wb.
Yth. Bapak/Ibu Wali dari *${applicant.fullName}*,

Pendaftaran calon peserta didik baru telah berhasil tercatat dalam sistem:
📋 *No. Registrasi:* ${applicant.registrationNumber}
🏷️ *Jalur Pendaftaran:* ${applicant.track.toUpperCase()}
🏫 *Asal Sekolah:* ${applicant.previousSchool}
💳 *Status Biaya Pendaftaran:* ${isPaid ? '✅ LUNAS (Rp 150.000)' : '⏳ MENUNGGU PEMBAYARAN (Rp 150.000)'}
${isPaid ? `🧾 *No. Kwitansi:* ${applicant.payment.receiptNumber || 'KWT-SMPMB-2026'}` : `🔗 *Kode Bayar/VA:* ${applicant.payment.paymentCode}`}
📂 *Status Berkas Digital:* ${applicant.documentStatus.toUpperCase()} (${applicant.documentScore}% Validasi Otomatis)

${
  isPaid
    ? '📌 *Tahap Selanjutnya:* Silakan cetak Kartu Peserta PPDB dan pantau jadwal tes pemetaan (Al-Qur\'an & Akademik) di portal resmi.'
    : '📌 *Petunjuk:* Harap menyelesaikan pembayaran biaya pendaftaran Rp 150.000 agar berkas segera diverifikasi panitia.'
}

Cek status mandiri: ${window.location.origin}
Sekretariat PPDB: ${SCHOOL_INFO.address}
Hotline WA: ${SCHOOL_INFO.whatsapp}

Wassalamu'alaikum Wr. Wb.
Panitia PPDB SMP Muhammadiyah Bireuen`;

    // Clean phone number: convert 08xx to 628xx
    let cleanPhone = applicant.parentWhatsapp.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith('8')) {
      cleanPhone = '628' + cleanPhone.slice(1);
    }

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    return { cleanPhone, message, waUrl };
  },

  // Generate Email Confirmation HTML Template
  generateEmailHtml(applicant: Applicant): string {
    const isPaid = applicant.payment.status === 'paid';
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Bukti Pendaftaran & Pembayaran PPDB SMP Muhammadiyah Bireuen</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <div style="background-color: #047857; color: #ffffff; padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; text-transform: uppercase;">SMP MUHAMMADIYAH BIREUEN</h1>
            <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">Penerimaan Peserta Didik Baru (PPDB) T.A. ${SCHOOL_INFO.academicYear}</p>
          </div>
          
          <div style="padding: 24px;">
            <div style="background-color: ${isPaid ? '#ecfdf5' : '#fffbeb'}; border-left: 4px solid ${isPaid ? '#10b981' : '#f59e0b'}; padding: 12px 16px; margin-bottom: 20px;">
              <strong style="color: ${isPaid ? '#065f46' : '#92400e'}; font-size: 15px;">
                ${isPaid ? '✅ Pembayaran Rp 150.000 Terverifikasi Lunas' : '⏳ Menunggu Penyelesaian Pembayaran Rp 150.000'}
              </strong>
              <p style="margin: 4px 0 0; font-size: 13px; color: #4b5563;">
                ${isPaid ? 'Tanda bukti pendaftaran & kuitansi resmi telah diterbitkan.' : 'Segera lakukan pembayaran untuk verifikasi berkas pendaftaran.'}
              </p>
            </div>

            <h3 style="margin-top: 0; color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px;">Ringkasan Data Calon Peserta Didik</h3>
            <table style="width: 100%; font-size: 13px; line-height: 1.8; margin-bottom: 20px;">
              <tr><td style="width: 40%; color: #6b7280;">Nomor Registrasi:</td><td><strong style="color: #047857;">${applicant.registrationNumber}</strong></td></tr>
              <tr><td style="color: #6b7280;">Nama Lengkap Siswa:</td><td><strong>${applicant.fullName}</strong></td></tr>
              <tr><td style="color: #6b7280;">NISN:</td><td>${applicant.nisn}</td></tr>
              <tr><td style="color: #6b7280;">Jalur Pendaftaran:</td><td><span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${applicant.track.toUpperCase()}</span></td></tr>
              <tr><td style="color: #6b7280;">Asal Sekolah SD/MI:</td><td>${applicant.previousSchool}</td></tr>
              <tr><td style="color: #6b7280;">Wali Murid:</td><td>${applicant.fatherName || applicant.motherName} (${applicant.parentWhatsapp})</td></tr>
              <tr><td style="color: #6b7280;">Skor Validasi Berkas:</td><td><strong style="color: #059669;">${applicant.documentScore}% (Otomatis)</strong></td></tr>
            </table>

            <h3 style="color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px;">Kuitansi Biaya Formulir & Pendaftaran</h3>
            <table style="width: 100%; font-size: 13px; background: #f9fafb; padding: 12px; border-radius: 6px; margin-bottom: 24px;">
              <tr><td style="color: #6b7280;">Biaya Pendaftaran:</td><td style="text-align: right; font-weight: bold; font-size: 15px; color: #111827;">Rp 150.000</td></tr>
              <tr><td style="color: #6b7280;">Metode Pembayaran:</td><td style="text-align: right;">${applicant.payment.method.toUpperCase()}</td></tr>
              <tr><td style="color: #6b7280;">Status:</td><td style="text-align: right; color: ${isPaid ? '#059669' : '#d97706'}; font-weight: bold;">${isPaid ? 'LUNAS (VERIFIED)' : 'PENDING'}</td></tr>
              ${isPaid ? `<tr><td style="color: #6b7280;">No. Kuitansi:</td><td style="text-align: right; font-family: monospace;">${applicant.payment.receiptNumber || 'KWT-2026-REG'}</td></tr>` : ''}
            </table>

            <p style="font-size: 13px; color: #6b7280; line-height: 1.5;">
              Simpan email ini sebagai bukti pendaftaran resmi. Anda dapat mencetak Kartu Peserta PPDB melalui menu <strong>Cek Status Pendaftaran</strong> pada website resmi kami.
            </p>
          </div>

          <div style="background-color: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">SMP Muhammadiyah Bireuen &bull; Kampus Berkeadaban & Prestasi</p>
            <p style="margin: 4px 0 0;">${SCHOOL_INFO.address} &bull; WA: ${SCHOOL_INFO.whatsapp}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  },
};
