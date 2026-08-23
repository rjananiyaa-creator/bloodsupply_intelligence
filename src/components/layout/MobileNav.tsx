import React from 'react';
import { useBloodSupply } from '../../context/BloodSupplyContext';
import {
  LayoutDashboard,
  Boxes,
  Users,
  GitPullRequest,
  Building2,
  BarChart3,
  Bell,
  Settings,
  Droplet,
  X,
  LogOut,
} from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const {
    activePage,
    setActivePage,
    pendingRequestsCount,
    alerts,
    criticalStockGroups,
    user,
    logout,
  } = useBloodSupply();

  const activeAlertsCount = alerts.filter((a) => a.status === 'Active').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: criticalStockGroups.length > 0 ? `${criticalStockGroups.length} Critical` : undefined, badgeType: 'danger' },
    { id: 'inventory', label: 'Blood Inventory', icon: Boxes },
    { id: 'donors', label: 'Donors', icon: Users },
    { id: 'requests', label: 'Blood Requests', icon: GitPullRequest, badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined, badgeType: 'warning' },
    { id: 'hospitals', label: 'Hospitals', icon: Building2 },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: activeAlertsCount > 0 ? `${activeAlertsCount}` : undefined, badgeType: 'danger' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-64 max-w-[80vw] bg-[#7F1D1D] text-white h-full flex flex-col shadow-2xl z-10">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#B91C1C] flex items-center justify-center text-white">
              <Droplet className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h2 className="font-bold text-xs tracking-wider uppercase text-white">BLOODSUPPLY</h2>
              <p className="text-[9px] text-white/70 uppercase">INTELLIGENCE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-4 py-2 text-xs font-medium transition ${
                  isActive
                    ? 'bg-[#B91C1C] text-white font-semibold border-l-4 border-white'
                    : 'text-white/75 hover:bg-white/10 hover:text-white border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/70'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.badgeType === 'danger' ? 'bg-[#DC2626] text-white' : 'bg-[#D97706] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Profile Footer */}
        <div className="p-3 border-t border-white/10 bg-black/25 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#B91C1C] text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'AD'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-white/60 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="p-1 text-white/60 hover:text-white transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
