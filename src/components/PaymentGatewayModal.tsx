import React, { useState } from 'react';
import { Applicant } from '../types/ppdb';
import { storageService } from '../services/storageService';
import { SCHOOL_INFO } from '../data/initialData';
import confetti from 'canvas-confetti';
import { 
  X, 
  QrCode, 
  Building, 
  CreditCard, 
  Check, 
  Clock, 
  Copy, 
  ShieldCheck, 
  CheckCircle2, 
  Send,
  Printer
} from 'lucide-react';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  applicant: Applicant | null;
  onClose: () => void;
  onPaymentSuccess: (updatedApplicant: Applicant) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  applicant,
  onClose,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<'qris' | 'va_bank_aceh' | 'va_bsi' | 'va_bca'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);
  const [updatedData, setUpdatedData] = useState<Applicant | null>(null);

  if (!isOpen || !applicant) return null;

  const vaCode =
    method === 'va_bank_aceh'
      ? `711019${applicant.nisn.slice(-6)}`
      : method === 'va_bsi'
      ? `900192${applicant.nisn.slice(-6)}`
      : `801294${applicant.nisn.slice(-6)}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const receiptNumber = `KWT-${Date.now().toString().slice(-6)}`;
      const updated = storageService.updateApplicant(applicant.id, {
        payment: {
          amount: SCHOOL_INFO.registrationFee,
          method,
          paymentCode: method === 'qris' ? `QRIS-SMPMB-${applicant.nisn.slice(-4)}` : vaCode,
          status: 'paid',
          paidAt: new Date().toISOString(),
          transactionId: `TXN-PG-${Date.now().toString().slice(-6)}`,
          receiptNumber,
        },
        overallStatus: applicant.documentStatus === 'verified' ? 'document_verified' : 'submitted',
      });

      setIsProcessing(false);
      setSuccess(true);
      if (updated) {
        setUpdatedData(updated);
        try {
          confetti({ particleCount: 90, spread: 60 });
        } catch {}
        onPaymentSuccess(updated);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Payment Gateway Terintegrasi</span>
            </div>
            <h3 className="text-lg font-bold mt-0.5">Pembayaran Biaya Formulir PPDB</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {!success ? (
            <>
              {/* Bill Details */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Nama Calon Siswa:</span>
                  <strong className="text-slate-900 text-sm">{applicant.fullName}</strong>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-500">No. Registrasi:</span>
                  <span className="font-mono font-bold text-emerald-800">{applicant.registrationNumber}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-slate-800">Total Tagihan:</span>
                  <span className="text-xl font-black text-emerald-700">Rp 150.000</span>
                </div>
              </div>

              {/* Method Selector Tabs */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Pilih Metode Pembayaran:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('qris')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2 ${
                      method === 'qris'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/30'
                        : 'border-slate-200'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-700" />
                    <span>QRIS Real-Time</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('va_bank_aceh')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2 ${
                      method === 'va_bank_aceh'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/30'
                        : 'border-slate-200'
                    }`}
                  >
                    <Building className="w-4 h-4 text-emerald-700" />
                    <span>VA Bank Aceh Syariah</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('va_bsi')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2 ${
                      method === 'va_bsi'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/30'
                        : 'border-slate-200'
                    }`}
                  >
                    <Building className="w-4 h-4 text-emerald-700" />
                    <span>VA BSI Syariah</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('va_bca')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2 ${
                      method === 'va_bca'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/30'
                        : 'border-slate-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <span>VA BCA / Prima</span>
                  </button>
                </div>
              </div>

              {/* QRIS or VA Presentation */}
              {method === 'qris' ? (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                    Pindai Kode QRIS di bawah ini dengan m-Banking / e-Wallet:
                  </span>
                  {/* Stylized QRIS box */}
                  <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
                    <QrCode className="w-32 h-32 text-slate-900" />
                    <span className="text-[9px] font-mono font-bold text-emerald-800">
                      NMID: ID1029384758
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Mendukung BCA, BSI, Bank Aceh Action, GoPay, OVO, ShopeePay, DANA.
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-slate-500">Nomor Virtual Account:</span>
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-base font-mono font-bold text-slate-900">{vaCode}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(vaCode)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Instant Verification Simulation Button */}
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Memverifikasi Pembayaran Otomatis...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verifikasi Pembayaran Instan (Rp 150.000)</span>
                  </>
                )}
              </button>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>

              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Pembayaran Terverifikasi
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-2">
                  Pembayaran Rp 150.000 Berhasil!
                </h4>
                <p className="text-slate-500 mt-1">
                  Kuitansi resmi & konfirmasi telah terbit secara digital.
                </p>
              </div>

              {updatedData && (
                <div className="space-y-2 pt-2">
                  <a
                    href={storageService.generateWhatsAppDetails(updatedData).waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Bukti ke WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => storageService.printOfficialReport([updatedData])}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Kartu Ujian & Kuitansi (PDF)</span>
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
              >
                Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
