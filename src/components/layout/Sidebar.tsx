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
  LogOut,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = () => {
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
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: criticalStockGroups.length > 0 ? `${criticalStockGroups.length} Critical` : undefined,
      badgeType: 'danger',
    },
    {
      id: 'inventory',
      label: 'Blood Inventory',
      icon: Boxes,
    },
    {
      id: 'donors',
      label: 'Donors',
      icon: Users,
    },
    {
      id: 'requests',
      label: 'Blood Requests',
      icon: GitPullRequest,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined,
      badgeType: 'warning',
    },
    {
      id: 'hospitals',
      label: 'Hospitals',
      icon: Building2,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: Bell,
      badge: activeAlertsCount > 0 ? `${activeAlertsCount}` : undefined,
      badgeType: 'danger',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[220px] xl:w-[230px] bg-[#7F1D1D] text-white min-h-screen shrink-0 sticky top-0 h-screen select-none border-r border-[#991B1B]/40">
      {/* Brand Header */}
      <div className="px-5 pt-6 pb-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#B91C1C] border border-white/20 flex items-center justify-center text-white shrink-0 shadow-sm">
          <Droplet className="w-4 h-4 fill-white" />
        </div>
        <div className="min-w-0">
          <div className="font-extrabold text-[13px] tracking-wide text-white leading-tight uppercase">
            BLOODSUPPLY
          </div>
          <div className="text-[10px] font-semibold text-white/70 tracking-wider uppercase">
            INTELLIGENCE
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-5 py-2.5 text-[13px] font-medium transition-colors text-left ${
                isActive
                  ? 'bg-[#B91C1C] text-white font-semibold border-l-4 border-white shadow-xs'
                  : 'text-white/75 hover:bg-white/10 hover:text-white border-l-4 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-white/70'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tight shrink-0 ml-1.5 ${
                    item.badgeType === 'danger'
                      ? 'bg-[#DC2626] text-white'
                      : 'bg-[#D97706] text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Cold Chain Monitor Chip */}
      <div className="mx-3 my-2 p-2.5 rounded-md bg-black/20 border border-white/10 text-[11px]">
        <div className="flex items-center gap-1.5 text-emerald-300 font-semibold mb-0.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
          </span>
          <span className="text-[10px] uppercase tracking-wider">Cold-Chain Active</span>
        </div>
        <div className="text-[10px] text-white/70 font-mono">
          Vault Temp: <span className="text-white font-bold">3.8°C</span>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-white/10 bg-black/25">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#B91C1C] border border-white/30 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
              {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'AD'}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-white truncate leading-tight">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] text-white/60 truncate">{user?.role || 'Medical Officer'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded transition shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
