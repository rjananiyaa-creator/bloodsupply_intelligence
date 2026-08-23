/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BloodSupplyProvider, useBloodSupply } from './context/BloodSupplyContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { InventoryPage } from './components/inventory/InventoryPage';
import { DonorsPage } from './components/donors/DonorsPage';
import { RequestsPage } from './components/requests/RequestsPage';
import { HospitalsPage } from './components/hospitals/HospitalsPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { AlertsPage } from './components/alerts/AlertsPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { LoginPage } from './components/auth/LoginPage';
import { ToastContainer } from './components/common/ToastContainer';
import { AddStockModal } from './components/modals/AddStockModal';
import { UpdateStockModal } from './components/modals/UpdateStockModal';
import { AddDonorModal } from './components/modals/AddDonorModal';
import { CreateRequestModal } from './components/modals/CreateRequestModal';
import { AddHospitalModal } from './components/modals/AddHospitalModal';
import { CompatibilityModal } from './components/modals/CompatibilityModal';
import { BloodGroup } from './types';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, activePage } = useBloodSupply();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [updateStockOpen, setUpdateStockOpen] = useState(false);
  const [addDonorOpen, setAddDonorOpen] = useState(false);
  const [createRequestOpen, setCreateRequestOpen] = useState(false);
  const [addHospitalOpen, setAddHospitalOpen] = useState(false);
  const [compatibilityOpen, setCompatibilityOpen] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup>('O-');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleOpenAddModal = (type: 'stock' | 'donor' | 'request', bloodGroup?: BloodGroup) => {
    if (bloodGroup) {
      setSelectedBloodGroup(bloodGroup);
    }
    if (type === 'stock') setAddStockOpen(true);
    if (type === 'donor') setAddDonorOpen(true);
    if (type === 'request') setCreateRequestOpen(true);
  };

  const handleOpenUpdateModal = (bloodGroup: BloodGroup) => {
    setSelectedBloodGroup(bloodGroup);
    setUpdateStockOpen(true);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardPage
            onOpenAddModal={handleOpenAddModal}
            onOpenCompatibility={() => setCompatibilityOpen(true)}
          />
        );
      case 'inventory':
        return (
          <InventoryPage
            onOpenAddModal={handleOpenAddModal}
            onOpenUpdateModal={handleOpenUpdateModal}
          />
        );
      case 'donors':
        return <DonorsPage onOpenAddModal={() => setAddDonorOpen(true)} />;
      case 'requests':
        return <RequestsPage onOpenCreateModal={() => setCreateRequestOpen(true)} />;
      case 'hospitals':
        return (
          <HospitalsPage
            onOpenAddModal={() => setAddHospitalOpen(true)}
            onOpenCreateRequest={() => setCreateRequestOpen(true)}
          />
        );
      case 'reports':
        return <ReportsPage />;
      case 'alerts':
        return <AlertsPage onOpenCreateRequest={() => setCreateRequestOpen(true)} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <DashboardPage
            onOpenAddModal={handleOpenAddModal}
            onOpenCompatibility={() => setCompatibilityOpen(true)}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F3F4F6] text-[#111827] font-sans selection:bg-[#B91C1C] selection:text-white">
      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Mobile Drawer */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenAddModal={handleOpenAddModal}
        />

        <main className="flex-1 pb-16">{renderActivePage()}</main>
      </div>

      {/* Global Modals */}
      <AddStockModal
        isOpen={addStockOpen}
        onClose={() => setAddStockOpen(false)}
        defaultBloodGroup={selectedBloodGroup}
      />

      <UpdateStockModal
        isOpen={updateStockOpen}
        onClose={() => setUpdateStockOpen(false)}
        initialBloodGroup={selectedBloodGroup}
      />

      <AddDonorModal
        isOpen={addDonorOpen}
        onClose={() => setAddDonorOpen(false)}
      />

      <CreateRequestModal
        isOpen={createRequestOpen}
        onClose={() => setCreateRequestOpen(false)}
        defaultBloodGroup={selectedBloodGroup}
      />

      <AddHospitalModal
        isOpen={addHospitalOpen}
        onClose={() => setAddHospitalOpen(false)}
      />

      <CompatibilityModal
        isOpen={compatibilityOpen}
        onClose={() => setCompatibilityOpen(false)}
        initialBloodGroup={selectedBloodGroup}
      />

      {/* Toast Notification Hub */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <BloodSupplyProvider>
      <MainAppContent />
    </BloodSupplyProvider>
  );
}
