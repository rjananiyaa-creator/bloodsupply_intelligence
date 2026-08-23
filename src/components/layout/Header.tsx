import React, { useState, useRef, useEffect } from 'react';
import { useBloodSupply } from '../../context/BloodSupplyContext';
import {
  Search,
  Bell,
  Plus,
  HelpCircle,
  Menu,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Droplet,
  HeartHandshake,
  GitPullRequest,
} from 'lucide-react';
import { CompatibilityModal } from '../modals/CompatibilityModal';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenAddModal: (type: 'stock' | 'donor' | 'request') => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu, onOpenAddModal }) => {
  const {
    user,
    alerts,
    searchQuery,
    setSearchQuery,
    activePage,
    setActivePage,
    criticalStockGroups,
    acknowledgeAlert,
    resolveAlert,
  } = useBloodSupply();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const quickRef = useRef<HTMLDivElement>(null);

  const activeAlerts = alerts.filter((a) => a.status === 'Active');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (quickRef.current && !quickRef.current.contains(event.target as Node)) {
        setShowQuickMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return 'Dashboard';
      case 'inventory':
        return 'Blood Inventory';
      case 'donors':
        return 'Donors';
      case 'requests':
        return 'Blood Requests';
      case 'hospitals':
        return 'Hospitals';
      case 'reports':
        return 'Reports';
      case 'alerts':
        return 'Alerts';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
    : 'AD';

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB] h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & current page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-1.5 rounded-md text-[#6B7280] hover:bg-[#F3F4F6] transition"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#111827] tracking-tight flex items-center gap-2">
              <span>{getPageTitle()}</span>
              {criticalStockGroups.length > 0 && activePage === 'dashboard' && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-[#FEE2E2] text-[#991B1B] border border-[#F87171]/40 rounded-full animate-pulse-subtle uppercase">
                  <AlertTriangle className="w-3 h-3 text-[#DC2626]" />
                  {criticalStockGroups.length} Critical Stock
                </span>
              )}
            </h2>
          </div>
        </div>

        {/* Center: Live Global Search */}
        <div className="flex-1 max-w-[340px] mx-2 hidden md:block">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search donor, hospital or request ID..."
              className="w-full pl-8 pr-4 py-1.5 text-xs bg-[#F3F4F6] hover:bg-[#E5E7EB]/70 focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] rounded-md outline-hidden transition text-[#111827] placeholder:text-[#6B7280]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#6B7280] hover:text-[#111827]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick Compatibility Lookup Button */}
          <button
            onClick={() => setShowCompatibilityModal(true)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#111827] bg-[#F3F4F6] hover:bg-[#E5E7EB] border border-[#E5E7EB] rounded-md transition"
            title="Open Blood Type Compatibility Rules"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#B91C1C]" />
            <span>Compatibility</span>
          </button>

          {/* Quick Action Button */}
          <div className="relative" ref={quickRef}>
            <button
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-md transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Action</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showQuickMenu && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-md shadow-lg border border-[#E5E7EB] p-1.5 z-50 animate-in fade-in duration-100">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                  Quick Actions
                </div>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenAddModal('request');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded text-xs font-medium text-[#111827] hover:bg-[#FEE2E2] hover:text-[#991B1B] flex items-center gap-2 transition"
                >
                  <GitPullRequest className="w-3.5 h-3.5 text-[#B91C1C]" />
                  <span>Create Blood Request</span>
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenAddModal('stock');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded text-xs font-medium text-[#111827] hover:bg-[#FEE2E2] hover:text-[#991B1B] flex items-center gap-2 transition"
                >
                  <Droplet className="w-3.5 h-3.5 text-[#B91C1C]" />
                  <span>Add Inventory Stock</span>
                </button>
                <button
                  onClick={() => {
                    setShowQuickMenu(false);
                    onOpenAddModal('donor');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded text-xs font-medium text-[#111827] hover:bg-[#FEE2E2] hover:text-[#991B1B] flex items-center gap-2 transition"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-[#B91C1C]" />
                  <span>Register New Donor</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-md text-[#111827] hover:bg-[#F3F4F6] border border-[#E5E7EB] transition cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {activeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#DC2626] text-[9px] font-bold text-white border-2 border-white">
                  {activeAlerts.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-1.5 w-80 bg-white rounded-md shadow-xl border border-[#E5E7EB] p-0 z-50 overflow-hidden animate-in fade-in duration-100">
                <div className="px-4 py-2.5 border-b border-[#E5E7EB] bg-[#F3F4F6] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-[#111827]">Notifications</h4>
                    <span className="px-1.5 py-0.2 text-[9px] font-bold bg-[#FEE2E2] text-[#991B1B] rounded-full">
                      {activeAlerts.length} Active
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setActivePage('alerts');
                      setShowNotifications(false);
                    }}
                    className="text-[11px] font-semibold text-[#B91C1C] hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#E5E7EB]">
                  {activeAlerts.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#6B7280]">
                      <CheckCircle2 className="w-6 h-6 text-[#059669] mx-auto mb-1" />
                      All systems normal.
                    </div>
                  ) : (
                    activeAlerts.slice(0, 5).map((alert) => (
                      <div key={alert.id} className="p-3 hover:bg-[#F3F4F6] transition text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-bold ${
                              alert.priority === 'Critical'
                                ? 'text-[#991B1B]'
                                : alert.priority === 'High'
                                ? 'text-[#92400E]'
                                : 'text-[#111827]'
                            }`}
                          >
                            {alert.title}
                          </span>
                          <span className="text-[10px] text-[#6B7280]">{alert.date}</span>
                        </div>
                        <p className="text-[#6B7280] line-clamp-2 text-[11px]">{alert.description}</p>
                        <div className="flex items-center justify-end gap-1.5 pt-1">
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="px-2 py-0.5 text-[10px] font-semibold text-[#6B7280] hover:bg-[#E5E7EB] rounded"
                          >
                            Ack
                          </button>
                          <button
                            onClick={() => resolveAlert(alert.id)}
                            className="px-2 py-0.5 text-[10px] font-bold text-[#065F46] bg-[#D1FAE5] hover:bg-[#A7F3D0] rounded"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-[#E5E7EB] bg-[#F3F4F6] text-center">
                  <button
                    onClick={() => {
                      setActivePage('alerts');
                      setShowNotifications(false);
                    }}
                    className="w-full py-1 text-[11px] font-bold text-[#B91C1C] hover:underline"
                  >
                    Open Alerts Command Center →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Chip */}
          <div className="flex items-center gap-2 pl-3 border-l border-[#E5E7EB]">
            <div className="w-8 h-8 rounded-full bg-[#B91C1C] flex items-center justify-center text-white font-bold text-xs shrink-0">
              {userInitials}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-[#111827] leading-tight">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] text-[#6B7280] leading-tight">{user?.role || 'Medical Officer'}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Global Compatibility Modal */}
      <CompatibilityModal
        isOpen={showCompatibilityModal}
        onClose={() => setShowCompatibilityModal(false)}
      />
    </>
  );
};
