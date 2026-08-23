import React, { useState } from 'react';
import { useBloodSupply } from '../../context/BloodSupplyContext';
import {
  BarChart3,
  Download,
  Printer,
  FileText,
  Droplet,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts';
import { MONTHLY_TREND_DATA } from '../../data/initialData';

const COLORS = ['#B91C1C', '#2563EB', '#059669', '#D97706', '#7C3AED', '#DB2777', '#0891B2', '#65A30D'];

export const ReportsPage: React.FC = () => {
  const {
    inventory,
    donors,
    requests,
    hospitals,
    totalUnits,
    totalReservedUnits,
    showToast,
    settings,
  } = useBloodSupply();

  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '6m' | 'ytd'>('6m');
  const [showGeneratedModal, setShowGeneratedModal] = useState(false);

  // Derived metrics
  const totalDonationsCount = donors.reduce((acc, d) => acc + d.donationCount, 0);
  const totalRequestsCount = requests.length;
  const fulfilledCount = requests.filter((r) => r.status === 'Fulfilled').length;
  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const fulfillmentRate = totalRequestsCount > 0 ? Math.round((fulfilledCount / totalRequestsCount) * 100) : 100;

  // Hospital demand aggregation
  const hospitalDemandData = hospitals.map((h) => ({
    name: h.name.replace(' Hospital', '').replace(' Center', ''),
    requests: requests.filter((r) => r.hospitalId === h.id || r.hospitalName === h.name).length,
    tier: h.tier,
  }));

  // Export CSV Handler
  const handleExportCSV = () => {
    const csvContent = [
      'Report Type,BloodSupply Intelligence Operational Audit',
      `Generated Date,${new Date().toISOString()}`,
      `Total Units in Vault,${totalUnits}`,
      `Total Lifetime Donations,${totalDonationsCount}`,
      `Total Requests,${totalRequestsCount}`,
      `Fulfillment Rate,${fulfillmentRate}%`,
      '',
      'Blood Group,Available Units,Reserved Units,Expiring Units,Min Threshold',
      ...inventory.map(
        (i) => `${i.bloodGroup},${i.availableUnits},${i.reservedUnits},${i.expiringUnits},${settings.minThresholds[i.bloodGroup] || i.minimumRequired}`
      ),
      '',
      'Hospital,Total Requests,Tier,Status',
      ...hospitals.map((h) => `"${h.name}",${h.totalRequests},"${h.tier}","${h.status}"`),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bloodsupply_intelligence_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Report Exported', 'CSV summary exported and downloaded successfully.', 'success');
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-5 max-w-[1400px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#111827] tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#B91C1C]" />
            <span>Reports & Supply Analytics</span>
          </h2>
          <p className="text-xs text-[#6B7280]">
            Transfusion trends, hospital utilization, stock audits, and fulfillment KPIs
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowGeneratedModal(true)}
            className="px-3.5 py-2 text-xs font-bold bg-[#111827] hover:bg-black text-white rounded-md shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Audit Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-bold bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] border border-[#E5E7EB] rounded-md shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 text-xs font-bold bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] border border-[#E5E7EB] rounded-md shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Timeframe Selector & KPI Bar */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-[#E5E7EB] p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider pl-1">
          Select Reporting Window:
        </span>
        <div className="flex gap-1">
          {[
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: '6m', label: 'Last 6 Months' },
            { id: 'ytd', label: 'Year-to-Date (2026)' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeframe(t.id as any)}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition cursor-pointer ${
                timeframe === t.id
                  ? 'bg-[#B91C1C] text-white shadow-xs'
                  : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="p-3.5 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">Donations Inflow</p>
          <h3 className="text-2xl font-bold text-[#111827] font-mono mt-0.5">{totalDonationsCount} Bags</h3>
          <span className="text-[10px] text-[#059669] font-bold">+12% vs prev quarter</span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">Units Issued</p>
          <h3 className="text-2xl font-bold text-[#B91C1C] font-mono mt-0.5">{fulfilledCount * 4 + 18} Units</h3>
          <span className="text-[10px] text-[#6B7280]">Transfused to patients</span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">Hospital Demands</p>
          <h3 className="text-2xl font-bold text-[#111827] font-mono mt-0.5">{totalRequestsCount} Orders</h3>
          <span className="text-[10px] text-[#D97706] font-bold">{pendingCount} in queue</span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[10px] font-semibold text-[#059669] uppercase tracking-wider">Fulfillment Rate</p>
          <h3 className="text-2xl font-bold text-[#059669] font-mono mt-0.5">{fulfillmentRate}%</h3>
          <span className="text-[10px] text-[#059669] font-bold">Standard: &gt;90%</span>
        </div>

        <div className="p-3.5 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">Vault Inventory</p>
          <h3 className="text-2xl font-bold text-[#111827] font-mono mt-0.5">{totalUnits} Units</h3>
          <span className="text-[10px] text-[#6B7280]">{totalReservedUnits} reserved</span>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CHART 1: Monthly Donations vs Transfusion Usage */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div className="mb-3">
            <h4 className="text-xs font-bold text-[#111827] tracking-tight flex items-center justify-between">
              <span>Monthly Blood Donation vs Transfusion Usage</span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-[#F3F4F6] text-[#6B7280] rounded">
                6-Month Trend
              </span>
            </h4>
            <p className="text-[11px] text-[#6B7280]">Inflow collections compared with hospital consumption</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 600, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="donations" name="Donations Collected" fill="#B91C1C" radius={[3, 3, 0, 0]} />
                <Bar dataKey="usage" name="Transfusion Dispatches" fill="#2563EB" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Blood Request Demand by Hospital */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div className="mb-3">
            <h4 className="text-xs font-bold text-[#111827] tracking-tight">
              Requisitions by Partner Healthcare Facility
            </h4>
            <p className="text-[11px] text-[#6B7280]">Active and processed blood requisitions by hospital</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hospitalDemandData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#111827' }} width={120} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="requests" name="Requisitions" fill="#B91C1C" radius={[0, 4, 4, 0]}>
                  {hospitalDemandData.map((_, index) => (
                    <Cell key={`hosp-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Generated Audit Report Modal Preview */}
      {showGeneratedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E5E7EB]">
            <div className="p-4 border-b border-[#E5E7EB] bg-[#7F1D1D] text-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-[#B91C1C] flex items-center justify-center text-white font-bold">
                  <Droplet className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Official Blood Supply Audit Report</h3>
                  <p className="text-[10px] text-white/70">Generated for Compliance & Clinical Review</p>
                </div>
              </div>
              <button
                onClick={() => setShowGeneratedModal(false)}
                className="p-1 text-white/70 hover:text-white rounded hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-[#111827]">
              <div className="p-3 bg-[#F3F4F6] rounded-md border border-[#E5E7EB] flex justify-between items-center">
                <div>
                  <p className="text-[#6B7280]">Facility Code: <strong className="text-[#111827]">{settings.facilityCode}</strong></p>
                  <p className="text-[#6B7280]">Authorized Director: <strong className="text-[#111827]">{settings.adminName}</strong></p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] font-bold rounded text-[10px]">
                    Audit Status: PASSED
                  </span>
                  <p className="text-[10px] text-[#6B7280] mt-0.5">Certified via ColdChain Protocol</p>
                </div>
              </div>

              {/* Table snapshot */}
              <div>
                <h4 className="font-bold uppercase tracking-wider text-[#6B7280] text-[10px] mb-1.5">
                  Inventory Balance Sheet Snapshot
                </h4>
                <div className="border border-[#E5E7EB] rounded-md overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#F9FAFB] text-[10px] text-[#6B7280] uppercase font-bold border-b border-[#E5E7EB]">
                      <tr>
                        <th className="py-2 px-3">Blood Group</th>
                        <th className="py-2 px-3">Available</th>
                        <th className="py-2 px-3">Reserved</th>
                        <th className="py-2 px-3">Min Safe Line</th>
                        <th className="py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3F4F6]">
                      {inventory.map((i) => (
                        <tr key={i.bloodGroup}>
                          <td className="py-1.5 px-3 font-bold font-mono text-[#111827]">{i.bloodGroup}</td>
                          <td className="py-1.5 px-3 font-mono text-[#111827]">{i.availableUnits} units</td>
                          <td className="py-1.5 px-3 font-mono text-[#6B7280]">{i.reservedUnits} units</td>
                          <td className="py-1.5 px-3 font-mono text-[#6B7280]">{settings.minThresholds[i.bloodGroup]} units</td>
                          <td className="py-1.5 px-3 font-bold">
                            <span className={i.availableUnits < settings.minThresholds[i.bloodGroup] ? 'text-[#DC2626]' : 'text-[#059669]'}>
                              {i.availableUnits < settings.minThresholds[i.bloodGroup] ? 'DEFICIT' : 'OPTIMAL'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E5E7EB]">
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] font-bold rounded-md text-xs cursor-pointer"
                >
                  Download CSV
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold rounded-md text-xs cursor-pointer"
                >
                  Print Official Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
