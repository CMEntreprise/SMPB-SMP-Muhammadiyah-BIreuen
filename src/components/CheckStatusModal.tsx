import React, { useState } from 'react';
import { Applicant } from '../types/ppdb';
import { storageService } from '../services/storageService';
import { 
  X, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Printer, 
  Send, 
  CreditCard,
  FileText,
  UserCheck
} from 'lucide-react';

interface CheckStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayNow: (applicant: Applicant) => void;
}

export const CheckStatusModal: React.FC<CheckStatusModalProps> = ({
  isOpen,
  onClose,
  onPayNow,
}) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Applicant | null>(null);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const found = storageService.findByNisnOrReg(query);
    setResult(found || null);
    setSearched(true);
  };

  const handleQuickFill = (sample: string) => {
    setQuery(sample);
    const found = storageService.findByNisnOrReg(sample);
    setResult(found || null);
    setSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-100 my-8">
        {/* Header */}
        <div className="bg-emerald-900 text-white p-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Cek Status Pendaftaran Mandiri</h3>
            <p className="text-xs text-emerald-200 mt-0.5">
              Masukkan NISN atau Nomor Registrasi (contoh: SMPMB-2026-0001)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Body */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nomor Registrasi atau 10 digit NISN..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 text-sm font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all shrink-0"
            >
              Cari Data
            </button>
          </form>

          {/* Quick Demo Pre-fills */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
            <span>Contoh cepat:</span>
            <button
              type="button"
              onClick={() => handleQuickFill('SMPMB-2026-0001')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-100 text-emerald-800 font-mono"
            >
              SMPMB-2026-0001
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('0128472911')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-100 text-emerald-800 font-mono"
            >
              0128472911
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('SMPMB-2026-0004')}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-amber-100 text-amber-800 font-mono"
            >
              Belum Bayar (0004)
            </button>
          </div>

          {/* Search Result Display */}
          {searched && (
            <div>
              {result ? (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        {result.track.toUpperCase()} &bull; GELOMBANG {result.wave}
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 mt-1">{result.fullName}</h4>
                      <p className="text-xs text-slate-500 font-mono">
                        No. Registrasi: <strong className="text-slate-800">{result.registrationNumber}</strong> | NISN: {result.nisn}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          result.payment.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {result.payment.status === 'paid' ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" /> Lunas (Rp 150rb)
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5" /> Belum Bayar
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200">
                    <div>
                      <span className="text-slate-500 block">Asal Sekolah SD/MI:</span>
                      <strong className="text-slate-800">{result.previousSchool}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Status Berkas Digital:</span>
                      <strong className="text-emerald-700 capitalize">
                        {result.documentStatus} ({result.documentScore}% Valid)
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Wali Murid:</span>
                      <strong className="text-slate-800">{result.fatherName || result.motherName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Status Akhir:</span>
                      <span className="font-bold text-emerald-800 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                        {result.overallStatus}
                      </span>
                    </div>
                  </div>

                  {result.verificationNotes && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-700 block">Catatan Panitia PPDB:</span>
                      <p className="text-slate-600 mt-0.5">{result.verificationNotes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {result.payment.status === 'unpaid' || result.payment.status === 'pending' ? (
                      <button
                        onClick={() => {
                          onPayNow(result);
                          onClose();
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs shadow-md transition-all"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Bayar Sekarang Rp 150.000</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => storageService.printOfficialReport([result])}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Cetak Bukti & Kuitansi (PDF)</span>
                      </button>
                    )}

                    <a
                      href={storageService.generateWhatsAppDetails(result).waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Kirim WA</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Data Tidak Ditemukan</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Pastikan nomor registrasi atau NISN yang dimasukkan sudah benar.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
