/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Applicant, StaffUser } from './types/ppdb';
import { storageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SchoolProfile } from './components/SchoolProfile';
import { RegistrationFlowInfo } from './components/RegistrationFlowInfo';
import { StaffDashboard } from './components/StaffDashboard';
import { Footer } from './components/Footer';
import { RegistrationFormModal } from './components/RegistrationFormModal';
import { CheckStatusModal } from './components/CheckStatusModal';
import { PaymentGatewayModal } from './components/PaymentGatewayModal';
import { FileText, Search, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'dashboard'>('landing');
  const [currentUser, setCurrentUser] = useState<StaffUser>(() => storageService.getCurrentUser());
  const [applicants, setApplicants] = useState<Applicant[]>(() => storageService.getApplicants());

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCheckStatusOpen, setIsCheckStatusOpen] = useState(false);
  const [paymentApplicant, setPaymentApplicant] = useState<Applicant | null>(null);

  // Sync data across components and tabs
  useEffect(() => {
    const handleDataChange = () => {
      setApplicants(storageService.getApplicants());
    };

    const handleUserChange = () => {
      setCurrentUser(storageService.getCurrentUser());
    };

    window.addEventListener('ppdb-data-updated', handleDataChange);
    window.addEventListener('ppdb-user-changed', handleUserChange);

    return () => {
      window.removeEventListener('ppdb-data-updated', handleDataChange);
      window.removeEventListener('ppdb-user-changed', handleUserChange);
    };
  }, []);

  const handleSelectUser = (user: StaffUser) => {
    storageService.setCurrentUser(user);
    setCurrentUser(user);
  };

  const handleRefreshData = () => {
    setApplicants(storageService.getApplicants());
  };

  const handleRegistrationSuccess = (newApplicant: Applicant) => {
    setApplicants(storageService.getApplicants());
  };

  const handlePaymentSuccess = (updatedApplicant: Applicant) => {
    setApplicants(storageService.getApplicants());
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        staffAccounts={storageService.getStaffAccounts()}
        onSelectUser={handleSelectUser}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenCheckStatus={() => setIsCheckStatusOpen(true)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
        currentTab={currentTab}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentTab === 'landing' ? (
          <div>
            <Hero
              onOpenRegister={() => setIsRegisterOpen(true)}
              onOpenCheckStatus={() => setIsCheckStatusOpen(true)}
              totalApplicants={applicants.length}
            />

            <SchoolProfile onOpenRegister={() => setIsRegisterOpen(true)} />

            <RegistrationFlowInfo onOpenRegister={() => setIsRegisterOpen(true)} />
          </div>
        ) : (
          <StaffDashboard
            currentUser={currentUser}
            applicants={applicants}
            onRefreshData={handleRefreshData}
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenCheckStatus={() => setIsCheckStatusOpen(true)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
      />

      {/* Modals */}
      <RegistrationFormModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleRegistrationSuccess}
      />

      <CheckStatusModal
        isOpen={isCheckStatusOpen}
        onClose={() => setIsCheckStatusOpen(false)}
        onPayNow={(app) => setPaymentApplicant(app)}
      />

      <PaymentGatewayModal
        isOpen={Boolean(paymentApplicant)}
        applicant={paymentApplicant}
        onClose={() => setPaymentApplicant(null)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Floating Action Button for Quick Access on Mobile */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-2.5 sm:hidden">
        <button
          onClick={() => setIsCheckStatusOpen(true)}
          className="w-12 h-12 rounded-full bg-white text-emerald-800 shadow-lg border border-slate-200 flex items-center justify-center"
          title="Cek Status Pendaftaran"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsRegisterOpen(true)}
          className="w-12 h-12 rounded-full bg-emerald-700 text-white shadow-xl flex items-center justify-center animate-bounce"
          title="Daftar Siswa Baru Rp 150rb"
        >
          <FileText className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
