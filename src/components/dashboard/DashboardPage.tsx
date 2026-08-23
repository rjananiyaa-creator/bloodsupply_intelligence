import React, { useState } from 'react';
import { useBloodSupply } from '../../context/BloodSupplyContext';
import { BloodGroup } from '../../types';
import { StatCard } from '../common/StatCard';
import {
  Droplet,
  Users,
  GitPullRequest,
  AlertOctagon,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Send,
  CheckCircle2,
  HelpCircle,
  Activity as ActivityIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ReferenceLine,
  AreaChart,
  Area,
  PieChart,
  Pie,
} from 'recharts';
import { INVENTORY_7_DAY_TREND } from '../../data/initialData';

interface DashboardPageProps {
  onOpenAddModal: (type: 'stock' | 'donor' | 'request', bloodGroup?: BloodGroup) => void;
  onOpenCompatibility: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const PIE_COLORS: Record<BloodGroup, string> = {
  'A+': '#B91C1C',
  'A-': '#DC2626',
  'B+': '#2563EB',
  'B-': '#3B82F6',
  'AB+': '#7C3AED',
  'AB-': '#9333EA',
  'O+': '#991B1B',
  'O-': '#7F1D1D',
};

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenAddModal,
  onOpenCompatibility,
}) => {
  const {
    inventory,
    donors,
    requests,
    activities,
    settings,
    totalUnits,
    totalReservedUnits,
    eligibleDonorsCount,
    pendingRequestsCount,
    criticalStockGroups,
    lowStockGroups,
    getStockStatus,
    triggerEmergencyBroadcast,
    setActivePage,
  } = useBloodSupply();

  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('ALL');

  // Chart 1: Stock by Blood Group
  const stockBarData = inventory.map((item) => {
    const minReq = settings.minThresholds[item.bloodGroup] || item.minimumRequired;
    const status = getStockStatus(item.bloodGroup);
    return {
      bloodGroup: item.bloodGroup,
      units: item.availableUnits,
      reserved: item.reservedUnits,
      minRequired: minReq,
      status,
      fill: status === 'Critical' ? '#DC2626' : status === 'Low' ? '#D97706' : '#B91C1C',
    };
  });

  // Chart 3: Requests Status breakdown
  const requestStatusData = [
    { name: 'Pending', count: requests.filter((r) => r.status === 'Pending').length, fill: '#D97706' },
    { name: 'Approved', count: requests.filter((r) => r.status === 'Approved').length, fill: '#2563EB' },
    { name: 'Fulfilled', count: requests.filter((r) => r.status === 'Fulfilled').length, fill: '#059669' },
    { name: 'Rejected', count: requests.filter((r) => r.status === 'Rejected').length, fill: '#6B7280' },
  ];

  // Chart 4: Blood Group Distribution
  const distributionPieData = inventory.map((item) => ({
    name: item.bloodGroup,
    value: item.availableUnits,
    fill: PIE_COLORS[item.bloodGroup] || '#B91C1C',
  }));

  // Filter activities
  const displayedActivities = selectedGroupFilter === 'ALL'
    ? activities.slice(0, 7)
    : activities.filter((a) => a.bloodGroup === selectedGroupFilter).slice(0, 7);

  return (
    <div className="p-4 sm:p-5 max-w-[1400px] mx-auto space-y-4">
      {/* Critical Deficit Alert Strip */}
      {criticalStockGroups.length > 0 && (
        <div className="p-3.5 rounded-lg bg-[#7F1D1D] text-white border border-[#991B1B] shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#B91C1C] flex items-center justify-center shrink-0">
              <AlertOctagon className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#B91C1C] px-1.5 py-0.5 rounded text-white">
                  Critical Deficit Warning
                </span>
                <span className="text-xs text-white/80">Immediate Action Required</span>
              </div>
              <p className="text-xs font-medium text-white mt-0.5">
                {criticalStockGroups.map((g) => g.bloodGroup).join(' and ')} stock is critically below safe clinical reserve!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => triggerEmergencyBroadcast(criticalStockGroups[0]?.bloodGroup || 'O-')}
              className="flex-1 md:flex-none px-3 py-1.5 bg-white text-[#7F1D1D] hover:bg-[#F3F4F6] text-xs font-bold rounded-md transition flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast to {criticalStockGroups[0]?.bloodGroup} Donors</span>
            </button>
            <button
              onClick={() => onOpenAddModal('stock', criticalStockGroups[0]?.bloodGroup)}
              className="flex-1 md:flex-none px-3 py-1.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-bold rounded-md transition flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stock</span>
            </button>
          </div>
        </div>
      )}

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          title="Total Blood Units"
          value={totalUnits}
          subtitle={`+ ${totalReservedUnits} Reserved`}
          icon={<Droplet className="w-4 h-4 fill-white text-white" />}
          variant="blood"
          trend={{ value: '+4.2%', isPositive: true, label: 'from last week' }}
          onClick={() => setActivePage('inventory')}
        />

        <StatCard
          title="Available Donors"
          value={eligibleDonorsCount}
          subtitle={`of ${donors.length} registered`}
          icon={<Users className="w-4 h-4" />}
          variant="success"
          trend={{ value: '12 registered', isPositive: true, label: 'today' }}
          onClick={() => setActivePage('donors')}
        />

        <StatCard
          title="Pending Requests"
          value={pendingRequestsCount}
          subtitle={`${requests.filter((r) => r.priority === 'Critical' && r.status === 'Pending').length} urgent requests`}
          icon={<GitPullRequest className="w-4 h-4" />}
          variant={pendingRequestsCount > 0 ? 'warning' : 'default'}
          trend={{
            value: pendingRequestsCount > 0 ? `${pendingRequestsCount} pending` : 'All clear',
            isPositive: pendingRequestsCount === 0,
            label: '',
          }}
          onClick={() => setActivePage('requests')}
        />

        <StatCard
          title="Critical Stock"
          value={criticalStockGroups.length}
          subtitle={criticalStockGroups.length > 0 ? `${criticalStockGroups.map((g) => g.bloodGroup).join(' & ')} below limit` : `${lowStockGroups.length} low band`}
          icon={<AlertTriangle className="w-4 h-4" />}
          variant={criticalStockGroups.length > 0 ? 'danger' : 'default'}
          trend={{
            value: criticalStockGroups.length > 0 ? 'Action required' : 'Optimal buffer',
            isPositive: criticalStockGroups.length === 0,
            label: '',
          }}
          onClick={() => setActivePage('alerts')}
        />
      </div>

      {/* 8 Blood Group Inventory Cards Grid */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wide">
              Blood Group Inventory (8 Groups)
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#F3F4F6] text-[#6B7280] rounded border border-[#E5E7EB]">
              Real-Time Vault
            </span>
          </div>
          <button
            onClick={onOpenCompatibility}
            className="text-xs font-semibold text-[#B91C1C] hover:text-[#7F1D1D] flex items-center gap-1 self-start sm:self-auto hover:underline"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Compatibility Guide</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {BLOOD_GROUPS.map((bg) => {
            const stock = inventory.find((i) => i.bloodGroup === bg) || {
              bloodGroup: bg,
              availableUnits: 0,
              reservedUnits: 0,
              expiringUnits: 0,
              minimumRequired: settings.minThresholds[bg] || 25,
              optimalLevel: settings.optimalThresholds[bg] || 60,
              lastUpdated: 'Just now',
              shelfLifeAvgDays: 30,
            };

            const min = settings.minThresholds[bg] || stock.minimumRequired;
            const optimal = settings.optimalThresholds[bg] || stock.optimalLevel || 60;
            const status = getStockStatus(bg);
            const percentage = Math.min(100, Math.round((stock.availableUnits / optimal) * 100));

            return (
              <div
                key={bg}
                className="bg-white p-3 rounded-lg border border-[#E5E7EB] text-center flex flex-col items-center justify-between hover:border-[#B91C1C]/40 transition shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                <div className="w-full flex items-center justify-between text-[11px] mb-1">
                  <span className="text-lg font-extrabold text-[#B91C1C] leading-none font-mono">
                    {bg}
                  </span>
                  <span
                    className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                      status === 'Critical'
                        ? 'bg-[#FEE2E2] text-[#DC2626]'
                        : status === 'Low'
                        ? 'bg-[#FEF3C7] text-[#D97706]'
                        : 'bg-[#D1FAE5] text-[#059669]'
                    }`}
                  >
                    {status === 'Good' && stock.availableUnits >= optimal ? 'Optimum' : status === 'Low' ? 'Moderate' : status}
                  </span>
                </div>

                <div className="text-[13px] font-semibold text-[#111827] mt-0.5 font-mono">
                  {stock.availableUnits} <span className="text-[11px] font-normal text-[#6B7280]">Units</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-[#F3F4F6] rounded-full my-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      status === 'Critical'
                        ? 'bg-[#DC2626]'
                        : status === 'Low'
                        ? 'bg-[#D97706]'
                        : 'bg-[#059669]'
                    }`}
                    style={{ width: `${Math.max(6, percentage)}%` }}
                  />
                </div>

                <div className="w-full flex items-center justify-between text-[9px] text-[#6B7280] mb-2 font-mono">
                  <span>Min: {min}</span>
                  <span>Opt: {optimal}</span>
                </div>

                {/* Quick Add / Request Buttons */}
                <div className="w-full grid grid-cols-2 gap-1 pt-1 border-t border-[#F3F4F6]">
                  <button
                    onClick={() => onOpenAddModal('stock', bg)}
                    className="py-1 px-1 text-[10px] font-semibold bg-[#F3F4F6] hover:bg-[#FEE2E2] hover:text-[#991B1B] text-[#111827] rounded transition"
                  >
                    + Add
                  </button>
                  <button
                    onClick={() => onOpenAddModal('request', bg)}
                    className="py-1 px-1 text-[10px] font-semibold bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] rounded transition"
                  >
                    Req
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Recent Activities & Weekly Inventory Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Recent Activities Table (7 Columns) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-[#E5E7EB] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <ActivityIcon className="w-4 h-4 text-[#B91C1C]" />
                <h3 className="text-sm font-bold text-[#111827]">Recent Activities</h3>
              </div>
              <div className="flex items-center gap-1.5">
                {['ALL', 'O+', 'O-', 'A+', 'B+'].map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setSelectedGroupFilter(bg)}
                    className={`px-1.5 py-0.5 text-[10px] font-semibold rounded border transition ${
                      selectedGroupFilter === bg
                        ? 'bg-[#111827] text-white border-[#111827]'
                        : 'bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB] hover:bg-[#E5E7EB]'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    <th className="py-2 text-[11px] font-semibold text-[#6B7280]">Date</th>
                    <th className="py-2 text-[11px] font-semibold text-[#6B7280]">Activity</th>
                    <th className="py-2 text-[11px] font-semibold text-[#6B7280]">Group</th>
                    <th className="py-2 text-[11px] font-semibold text-[#6B7280]">Units</th>
                    <th className="py-2 text-[11px] font-semibold text-[#6B7280]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedActivities.map((act) => (
                    <tr key={act.id} className="border-b border-[#F3F4F6] hover:bg-[#F3F4F6]/60 transition">
                      <td className="py-2 text-[11px] text-[#6B7280] whitespace-nowrap">
                        {act.date}
                      </td>
                      <td className="py-2 text-xs font-semibold text-[#111827]">
                        {act.activity}
                        <span className="block text-[10px] text-[#6B7280] font-normal">{act.facility || act.actor}</span>
                      </td>
                      <td className="py-2 text-xs font-bold text-[#B91C1C] font-mono">
                        {act.bloodGroup}
                      </td>
                      <td className="py-2 text-xs font-mono font-semibold text-[#111827]">
                        {act.units} {act.units === 1 ? 'Unit' : 'Units'}
                      </td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold inline-block ${
                            act.status === 'Completed' || act.status === 'Issued'
                              ? 'bg-[#D1FAE5] text-[#065F46]'
                              : act.status === 'Pending' || act.status === 'In-Transit'
                              ? 'bg-[#FEF3C7] text-[#92400E]'
                              : act.status === 'Approved'
                              ? 'bg-[#DBEAFE] text-[#1E40AF]'
                              : 'bg-[#FEE2E2] text-[#991B1B]'
                          }`}
                        >
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#6B7280]">
            <span>Showing {displayedActivities.length} recent log entries</span>
            <button
              onClick={() => setActivePage('reports')}
              className="text-xs font-semibold text-[#B91C1C] hover:underline flex items-center gap-1"
            >
              <span>View All Records</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Weekly Inventory Trend Panel (5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-[#E5E7EB] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E5E7EB]">
              <h3 className="text-sm font-bold text-[#111827]">Weekly Inventory Trend</h3>
              <select className="text-[11px] px-2 py-1 bg-[#F3F4F6] border border-[#E5E7EB] rounded text-[#111827] outline-hidden">
                <option>Last 7 Days</option>
              </select>
            </div>

            <div className="h-52 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={INVENTORY_7_DAY_TREND} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B91C1C" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#B91C1C" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#6B7280' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} domain={['dataMin - 15', 'dataMax + 15']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="total" name="Total Units" stroke="#B91C1C" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#F3F4F6]">
            <div className="flex justify-between items-center mb-1 text-[11px]">
              <span className="text-[#6B7280]">Average Fulfillment Rate</span>
              <span className="font-bold text-[#111827]">84%</span>
            </div>
            <div className="w-full h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div className="h-full bg-[#059669] rounded-full" style={{ width: '84%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Additional High-Density Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Stock by Blood Group Bar Chart */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E5E7EB]">
            <div>
              <h4 className="text-sm font-bold text-[#111827]">Blood Stock vs Safety Limit</h4>
              <p className="text-[11px] text-[#6B7280]">Available units against required minimum safe threshold</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-[#FEE2E2] text-[#991B1B] rounded border border-[#FECACA]">
              Vault Status
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="bloodGroup" tick={{ fontSize: 11, fontWeight: 700, fill: '#111827' }} />
                <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} Units`, name === 'units' ? 'Available' : 'Reserved']}
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                />
                <ReferenceLine y={25} stroke="#DC2626" strokeDasharray="3 3" label={{ value: 'Safe Limit (25)', position: 'insideTopRight', fill: '#DC2626', fontSize: 9 }} />
                <Bar dataKey="units" radius={[3, 3, 0, 0]}>
                  {stockBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Requests Status Distribution */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E5E7EB]">
            <div>
              <h4 className="text-sm font-bold text-[#111827]">Hospital Blood Requisition Pipeline</h4>
              <p className="text-[11px] text-[#6B7280]">Requisitions by current processing stage</p>
            </div>
            <button
              onClick={() => setActivePage('requests')}
              className="text-xs font-semibold text-[#B91C1C] hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={requestStatusData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#6B7280' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fontWeight: 600, fill: '#111827' }} width={70} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="count" name="Orders" radius={[0, 4, 4, 0]}>
                  {requestStatusData.map((entry, index) => (
                    <Cell key={`cell-req-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
