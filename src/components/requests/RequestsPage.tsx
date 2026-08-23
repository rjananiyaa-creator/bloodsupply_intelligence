import React, { useState } from 'react';
import { useBloodSupply } from '../../context/BloodSupplyContext';
import { BloodRequest } from '../../types';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import {
  GitPullRequest,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  AlertTriangle,
  Eye,
  UserCheck,
  X,
  FileText,
  Truck,
} from 'lucide-react';

interface RequestsPageProps {
  onOpenCreateModal: () => void;
}

export const RequestsPage: React.FC<RequestsPageProps> = ({ onOpenCreateModal }) => {
  const {
    requests,
    inventory,
    approveRequest,
    fulfillRequest,
    rejectRequest,
    searchQuery,
    setSearchQuery,
  } = useBloodSupply();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('ALL');
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('Crossmatch antigen incompatibility detected');

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = req.id.toLowerCase().includes(q);
      const matchHosp = req.hospitalName.toLowerCase().includes(q);
      const matchGroup = req.bloodGroup.toLowerCase().includes(q);
      const matchPatient = req.patientId?.toLowerCase().includes(q) || false;
      if (!matchId && !matchHosp && !matchGroup && !matchPatient) return false;
    }

    if (selectedStatusFilter !== 'ALL' && req.status !== selectedStatusFilter) {
      return false;
    }

    if (selectedPriorityFilter !== 'ALL' && req.priority !== selectedPriorityFilter) {
      return false;
    }

    return true;
  });

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingRequestId) return;
    rejectRequest(rejectingRequestId, rejectReason);
    setRejectingRequestId(null);
  };

  // Metrics
  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const criticalCount = requests.filter((r) => r.priority === 'Critical' && r.status !== 'Fulfilled' && r.status !== 'Rejected').length;
  const fulfilledCount = requests.filter((r) => r.status === 'Fulfilled').length;

  return (
    <div className="p-4 sm:p-5 max-w-[1400px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#111827] tracking-tight flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-[#B91C1C]" />
            <span>Hospital Blood Requisition Pipeline</span>
          </h2>
          <p className="text-xs text-[#6B7280]">
            Emergency orders, surgical reserves, triage approvals, and cold-chain courier dispatch
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="px-3.5 py-2 text-xs font-bold bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-md shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Blood Request</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Total Requisitions</p>
          <h3 className="text-2xl font-bold text-[#111827] font-mono mt-0.5">{totalCount}</h3>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-semibold text-[#D97706] uppercase tracking-wider">Pending Action</p>
          <h3 className="text-2xl font-bold text-[#D97706] font-mono mt-0.5">{pendingCount}</h3>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-semibold text-[#DC2626] uppercase tracking-wider">Critical Emergency</p>
          <h3 className="text-2xl font-bold text-[#DC2626] font-mono mt-0.5">{criticalCount}</h3>
        </div>

        <div className="p-4 bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <p className="text-[11px] font-semibold text-[#059669] uppercase tracking-wider">Fulfilled & Dispatched</p>
          <h3 className="text-2xl font-bold text-[#059669] font-mono mt-0.5">{fulfilledCount}</h3>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search request #, hospital, blood group, patient ID..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] placeholder:text-[#6B7280] outline-hidden transition"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] font-medium outline-hidden transition"
            >
              <option value="ALL">All Request Statuses</option>
              <option value="Pending">Pending Approval</option>
              <option value="Approved">Approved / Units Reserved</option>
              <option value="Fulfilled">Fulfilled & Dispatched</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#F3F4F6] focus:bg-white border border-[#E5E7EB] focus:border-[#B91C1C] text-[#111827] font-medium outline-hidden transition"
            >
              <option value="ALL">All Priority Levels</option>
              <option value="Critical">Critical Priority (Immediate)</option>
              <option value="Urgent">Urgent Priority (&lt; 6 hrs)</option>
              <option value="Normal">Normal / Elective</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[#6B7280] uppercase tracking-wider text-[10px] font-bold">
                <th className="py-2.5 px-3.5">Request ID</th>
                <th className="py-2.5 px-3.5">Hospital</th>
                <th className="py-2.5 px-3.5">Blood Group</th>
                <th className="py-2.5 px-3.5">Units Req</th>
                <th className="py-2.5 px-3.5">Priority</th>
                <th className="py-2.5 px-3.5">Required By</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#6B7280] text-xs">
                    No blood requests match your current filters.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  return (
                    <tr
                      key={req.id}
                      className={`hover:bg-[#F3F4F6]/60 transition ${
                        req.priority === 'Critical' && req.status === 'Pending'
                          ? 'bg-[#FEE2E2]/30'
                          : ''
                      }`}
                    >
                      {/* Request ID & Date */}
                      <td className="py-2.5 px-3.5">
                        <div className="font-mono text-[11px] font-semibold text-[#111827]">{req.id}</div>
                        <div className="text-[10px] text-[#6B7280]">{req.requestDate}</div>
                      </td>

                      {/* Hospital & Patient */}
                      <td className="py-2.5 px-3.5">
                        <div className="font-bold text-[#111827]">{req.hospitalName}</div>
                        <div className="text-[10px] text-[#6B7280] truncate max-w-[170px]">
                          Patient: {req.patientId || 'Unassigned'} • {req.patientCondition || 'Transfusion'}
                        </div>
                      </td>

                      {/* Blood Group */}
                      <td className="py-2.5 px-3.5">
                        <BloodGroupBadge bloodGroup={req.bloodGroup} size="sm" />
                      </td>

                      {/* Units Required */}
                      <td className="py-2.5 px-3.5 font-mono font-bold text-[#111827]">
                        {req.unitsRequired} {req.unitsRequired === 1 ? 'Unit' : 'Units'}
                      </td>

                      {/* Priority */}
                      <td className="py-2.5 px-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            req.priority === 'Critical'
                              ? 'bg-[#DC2626] text-white animate-pulse-subtle'
                              : req.priority === 'Urgent'
                              ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                              : 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]'
                          }`}
                        >
                          {req.priority === 'Critical' && <Flame className="w-3 h-3" />}
                          {req.priority === 'Urgent' && <AlertTriangle className="w-3 h-3" />}
                          <span>{req.priority}</span>
                        </span>
                      </td>

                      {/* Required Date */}
                      <td className="py-2.5 px-3.5 text-[#111827] font-medium whitespace-nowrap text-xs">
                        {req.requiredDate}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === 'Fulfilled'
                              ? 'bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]'
                              : req.status === 'Approved'
                              ? 'bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE]'
                              : req.status === 'Pending'
                              ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                              : 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]'
                          }`}
                        >
                          {req.status === 'Fulfilled' && <CheckCircle2 className="w-3 h-3 text-[#059669]" />}
                          {req.status === 'Approved' && <UserCheck className="w-3 h-3 text-[#2563EB]" />}
                          {req.status === 'Pending' && <Clock className="w-3 h-3 text-[#D97706]" />}
                          {req.status === 'Rejected' && <XCircle className="w-3 h-3 text-[#DC2626]" />}
                          <span>{req.status}</span>
                        </span>
                      </td>

                      {/* Interactive Actions */}
                      <td className="py-2.5 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded transition cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {req.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => approveRequest(req.id)}
                                className="px-2.5 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded transition shadow-xs cursor-pointer"
                                title="Approve & Reserve Units"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => setRejectingRequestId(req.id)}
                                className="p-1 text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded transition cursor-pointer"
                                title="Reject Request"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {req.status === 'Approved' && (
                            <button
                              onClick={() => fulfillRequest(req.id)}
                              className="px-2.5 py-1 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs rounded transition shadow-xs flex items-center gap-1 cursor-pointer"
                              title="Dispatch & Fulfill Blood Units"
                            >
                              <Truck className="w-3 h-3" />
                              <span>Fulfill</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden border border-[#E5E7EB]">
            <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-[#7F1D1D] text-white flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">Requisition #{selectedRequest.id}</h3>
                  <p className="text-xs text-[#6B7280]">{selectedRequest.hospitalName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1 text-[#6B7280] hover:text-[#111827] rounded hover:bg-[#E5E7EB] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-3 bg-[#FEE2E2]/60 rounded-md border border-[#FECACA]">
                <div className="flex items-center gap-2.5">
                  <BloodGroupBadge bloodGroup={selectedRequest.bloodGroup} size="lg" />
                  <div>
                    <span className="font-bold text-[#111827] text-xs">
                      {selectedRequest.unitsRequired} Units Requested
                    </span>
                    <p className="text-[#6B7280] text-[11px]">Priority: {selectedRequest.priority}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-white text-[#111827] font-bold rounded border border-[#E5E7EB]">
                  Status: {selectedRequest.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-[#F3F4F6] rounded-md border border-[#E5E7EB]">
                  <span className="text-[#6B7280] font-bold uppercase text-[10px]">Patient Record</span>
                  <p className="text-[#111827] font-mono font-bold mt-0.5">{selectedRequest.patientId || 'PT-General'}</p>
                </div>
                <div className="p-2.5 bg-[#F3F4F6] rounded-md border border-[#E5E7EB]">
                  <span className="text-[#6B7280] font-bold uppercase text-[10px]">Required By</span>
                  <p className="text-[#111827] font-bold mt-0.5">{selectedRequest.requiredDate}</p>
                </div>
              </div>

              <div className="p-2.5 bg-[#F3F4F6] rounded-md border border-[#E5E7EB]">
                <span className="text-[#6B7280] font-bold uppercase text-[10px]">Clinical Condition</span>
                <p className="text-[#111827] font-medium mt-1 leading-relaxed">
                  {selectedRequest.patientCondition || 'Surgical Transfusion Support'}
                </p>
              </div>

              {selectedRequest.notes && (
                <div className="p-2.5 bg-[#F3F4F6] rounded-md border border-[#E5E7EB]">
                  <span className="text-[#6B7280] font-bold uppercase text-[10px]">Handling & Delivery Notes</span>
                  <p className="text-[#111827] mt-1">{selectedRequest.notes}</p>
                </div>
              )}

              {selectedRequest.approvedBy && (
                <div className="p-2.5 bg-[#D1FAE5] rounded-md border border-[#A7F3D0] text-[#065F46]">
                  <span className="font-bold">Approval Audit:</span> Verified by {selectedRequest.approvedBy} on {selectedRequest.approvedDate}.
                </div>
              )}

              {selectedRequest.rejectionReason && (
                <div className="p-2.5 bg-[#FEE2E2] rounded-md border border-[#FECACA] text-[#991B1B]">
                  <span className="font-bold">Rejection Reason:</span> {selectedRequest.rejectionReason}
                </div>
              )}

              {/* Action bar inside details */}
              <div className="pt-2 flex gap-2">
                {selectedRequest.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => {
                        approveRequest(selectedRequest.id);
                        setSelectedRequest(null);
                      }}
                      className="flex-1 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-md transition shadow-xs cursor-pointer"
                    >
                      Approve & Reserve Units
                    </button>
                    <button
                      onClick={() => {
                        setRejectingRequestId(selectedRequest.id);
                        setSelectedRequest(null);
                      }}
                      className="px-3 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] font-bold rounded-md transition cursor-pointer"
                    >
                      Reject
                    </button>
                  </>
                )}
                {selectedRequest.status === 'Approved' && (
                  <button
                    onClick={() => {
                      fulfillRequest(selectedRequest.id);
                      setSelectedRequest(null);
                    }}
                    className="w-full py-2 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-md transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Dispatch ColdChain Courier & Mark Fulfilled</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Request Reason Modal */}
      {rejectingRequestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 space-y-3.5 border border-[#E5E7EB]">
            <h3 className="text-sm font-bold text-[#111827]">Reject Blood Request</h3>
            <p className="text-xs text-[#6B7280]">
              Provide a medical or logistical reason for rejecting request #{rejectingRequestId}.
            </p>
            <form onSubmit={handleRejectSubmit} className="space-y-3">
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[#E5E7EB] text-xs bg-[#F3F4F6] focus:bg-white text-[#111827] outline-hidden"
              >
                <option value="Crossmatch antigen incompatibility detected">Crossmatch antigen incompatibility detected</option>
                <option value="Insufficient available stock for critical reserve">Insufficient available stock for critical reserve</option>
                <option value="Incomplete patient clinical documentation">Incomplete patient clinical documentation</option>
                <option value="Duplicate requisition order submitted">Duplicate requisition order submitted</option>
                <option value="Redirected to alternate regional blood bank facility">Redirected to alternate regional blood bank facility</option>
              </select>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingRequestId(null)}
                  className="flex-1 py-1.5 text-xs font-semibold bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 text-xs font-bold bg-[#DC2626] text-white hover:bg-[#B91C1C] rounded-md cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
