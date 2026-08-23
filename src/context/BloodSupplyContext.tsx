import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  BloodGroup,
  BloodStock,
  StockStatus,
  Donor,
  BloodRequest,
  Hospital,
  AlertItem,
  RecentActivity,
  AppSettings,
  User,
  RequestStatus,
} from '../types';
import {
  DEFAULT_USER,
  INITIAL_SETTINGS,
  INITIAL_INVENTORY,
  INITIAL_DONORS,
  INITIAL_HOSPITALS,
  INITIAL_REQUESTS,
  INITIAL_ALERTS,
  INITIAL_ACTIVITIES,
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

interface BloodSupplyContextType {
  // State
  inventory: BloodStock[];
  donors: Donor[];
  requests: BloodRequest[];
  hospitals: Hospital[];
  alerts: AlertItem[];
  activities: RecentActivity[];
  settings: AppSettings;
  user: User | null;
  isAuthenticated: boolean;
  activePage: string;
  toasts: ToastMessage[];
  searchQuery: string;

  // Navigation & UI
  setActivePage: (page: string) => void;
  setSearchQuery: (query: string) => void;
  showToast: (title: string, message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;

  // Inventory actions
  addStock: (bloodGroup: BloodGroup, units: number, notes?: string, source?: string) => void;
  updateStock: (bloodGroup: BloodGroup, unitsChange: number, action: 'add' | 'subtract' | 'set', reason: string) => void;
  getStockStatus: (bloodGroup: BloodGroup) => StockStatus;
  getBloodGroupStock: (bloodGroup: BloodGroup) => BloodStock;

  // Donor actions
  addDonor: (donor: Omit<Donor, 'id' | 'donationCount'>) => void;
  updateDonor: (id: string, donor: Partial<Donor>) => void;
  deleteDonor: (id: string) => void;

  // Request actions
  createRequest: (request: Omit<BloodRequest, 'id' | 'status' | 'requestDate'>) => void;
  approveRequest: (requestId: string, allocatedUnits?: number) => void;
  fulfillRequest: (requestId: string) => void;
  rejectRequest: (requestId: string, reason: string) => void;

  // Hospital actions
  addHospital: (hospital: Omit<Hospital, 'id' | 'activeRequests' | 'totalRequests'>) => void;
  updateHospital: (id: string, hospital: Partial<Hospital>) => void;

  // Alert actions
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  triggerEmergencyBroadcast: (bloodGroup: BloodGroup, message?: string) => void;

  // Settings & System
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  login: (email?: string, password?: string) => boolean;
  logout: () => void;
  resetToDefaultData: () => void;

  // Computed metrics
  totalUnits: number;
  totalReservedUnits: number;
  totalExpiringUnits: number;
  eligibleDonorsCount: number;
  pendingRequestsCount: number;
  criticalStockGroups: BloodStock[];
  lowStockGroups: BloodStock[];
}

const BloodSupplyContext = createContext<BloodSupplyContextType | undefined>(undefined);

const STORAGE_PREFIX = 'bloodsupply_intel_';

export const BloodSupplyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from local storage or fallback to defaults
  const [inventory, setInventory] = useState<BloodStock[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}inventory`);
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [donors, setDonors] = useState<Donor[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}donors`);
    return saved ? JSON.parse(saved) : INITIAL_DONORS;
  });

  const [requests, setRequests] = useState<BloodRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}requests`);
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}hospitals`);
    return saved ? JSON.parse(saved) : INITIAL_HOSPITALS;
  });

  const [alerts, setAlerts] = useState<AlertItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}alerts`);
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [activities, setActivities] = useState<RecentActivity[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}activities`);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}settings`);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}user`);
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}auth`);
    return saved !== null ? JSON.parse(saved) : true; // Default logged in for seamless demo
  });

  const [activePage, setActivePage] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}inventory`, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}donors`, JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}requests`, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}hospitals`, JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}alerts`, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}activities`, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}auth`, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  // Toast Helper
  const showToast = (title: string, message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to get formatted current time
  const getNowFormatted = () => {
    const now = new Date();
    return `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Stock status calculation
  const getStockStatus = (bloodGroup: BloodGroup): StockStatus => {
    const item = inventory.find((i) => i.bloodGroup === bloodGroup);
    if (!item) return 'Good';
    const min = settings.minThresholds[bloodGroup] || item.minimumRequired;
    if (item.availableUnits < min) return 'Critical';
    if (item.availableUnits < min * 1.4) return 'Low';
    return 'Good';
  };

  const getBloodGroupStock = (bloodGroup: BloodGroup): BloodStock => {
    const item = inventory.find((i) => i.bloodGroup === bloodGroup);
    if (item) return item;
    return {
      bloodGroup,
      availableUnits: 0,
      reservedUnits: 0,
      expiringUnits: 0,
      minimumRequired: settings.minThresholds[bloodGroup] || 25,
      optimalLevel: settings.optimalThresholds[bloodGroup] || 60,
      lastUpdated: getNowFormatted(),
      shelfLifeAvgDays: 30,
    };
  };

  // Check and auto-generate stock alerts if needed
  const evaluateInventoryAlerts = (updatedInventory: BloodStock[]) => {
    const newAlerts = [...alerts];
    let alertCreated = false;

    updatedInventory.forEach((item) => {
      const min = settings.minThresholds[item.bloodGroup] || item.minimumRequired;
      const existingCritAlert = newAlerts.find(
        (a) => a.bloodGroup === item.bloodGroup && a.type === 'CRITICAL_STOCK' && a.status === 'Active'
      );

      if (item.availableUnits < min) {
        if (!existingCritAlert) {
          newAlerts.unshift({
            id: `ALT-CRIT-${item.bloodGroup}-${Date.now()}`,
            type: 'CRITICAL_STOCK',
            title: `${item.bloodGroup} Stock Critically Low`,
            description: `Current available level (${item.availableUnits} units) is below minimum safe threshold (${min} units).`,
            bloodGroup: item.bloodGroup,
            priority: 'Critical',
            date: getNowFormatted(),
            status: 'Active',
          });
          alertCreated = true;
        }
      }
    });

    if (alertCreated) {
      setAlerts(newAlerts);
    }
  };

  // Inventory actions
  const addStock = (bloodGroup: BloodGroup, units: number, notes?: string, source?: string) => {
    const timestamp = getNowFormatted();
    setInventory((prev) => {
      const updated = prev.map((item) => {
        if (item.bloodGroup === bloodGroup) {
          return {
            ...item,
            availableUnits: item.availableUnits + units,
            lastUpdated: timestamp,
          };
        }
        return item;
      });
      evaluateInventoryAlerts(updated);
      return updated;
    });

    // Add activity log
    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        date: 'Today, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date().toISOString(),
        activity: `Stock Inflow: ${source || 'Donation Inflow'}`,
        bloodGroup,
        units,
        status: 'Completed',
        facility: notes || 'Central Blood Bank Cold Storage',
        actor: user?.name || 'Admin',
      },
      ...prev,
    ]);

    showToast('Stock Added', `Successfully credited ${units} units of ${bloodGroup} to inventory.`, 'success');
  };

  const updateStock = (bloodGroup: BloodGroup, unitsChange: number, action: 'add' | 'subtract' | 'set', reason: string) => {
    const timestamp = getNowFormatted();
    let changeSummary = '';

    setInventory((prev) => {
      const updated = prev.map((item) => {
        if (item.bloodGroup === bloodGroup) {
          let newUnits = item.availableUnits;
          if (action === 'add') {
            newUnits += unitsChange;
            changeSummary = `+${unitsChange} units`;
          } else if (action === 'subtract') {
            newUnits = Math.max(0, newUnits - unitsChange);
            changeSummary = `-${unitsChange} units`;
          } else {
            newUnits = Math.max(0, unitsChange);
            changeSummary = `set to ${unitsChange} units`;
          }
          return {
            ...item,
            availableUnits: newUnits,
            lastUpdated: timestamp,
          };
        }
        return item;
      });
      evaluateInventoryAlerts(updated);
      return updated;
    });

    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        date: 'Today, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date().toISOString(),
        activity: `Inventory Adjusted (${reason})`,
        bloodGroup,
        units: unitsChange,
        status: action === 'subtract' ? 'Warning' : 'Completed',
        facility: reason,
        actor: user?.name || 'Admin',
      },
      ...prev,
    ]);

    showToast('Inventory Updated', `${bloodGroup} stock was ${changeSummary}. Reason: ${reason}`, 'info');
  };

  // Donor actions
  const addDonor = (donorData: Omit<Donor, 'id' | 'donationCount'>) => {
    const newId = `DNR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDonor: Donor = {
      ...donorData,
      id: newId,
      donationCount: 1,
      isUniversalDonor: donorData.bloodGroup === 'O-',
    };

    setDonors((prev) => [newDonor, ...prev]);

    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        date: 'Today, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date().toISOString(),
        activity: 'New Donor Enrolled',
        bloodGroup: donorData.bloodGroup,
        units: 1,
        status: 'Completed',
        facility: `${donorData.city} Donor Network`,
        actor: user?.name || 'Intake Officer',
      },
      ...prev,
    ]);

    showToast('Donor Registered', `${newDonor.name} (${newDonor.bloodGroup}) was successfully registered.`, 'success');
  };

  const updateDonor = (id: string, updatedData: Partial<Donor>) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updatedData } : d))
    );
    showToast('Donor Updated', `Donor record #${id} updated successfully.`, 'info');
  };

  const deleteDonor = (id: string) => {
    const donor = donors.find((d) => d.id === id);
    setDonors((prev) => prev.filter((d) => d.id !== id));
    showToast('Donor Removed', `Donor ${donor?.name || id} was removed from the registry.`, 'warning');
  };

  // Request actions
  const createRequest = (requestData: Omit<BloodRequest, 'id' | 'status' | 'requestDate'>) => {
    const newId = `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newRequest: BloodRequest = {
      ...requestData,
      id: newId,
      status: 'Pending',
      requestDate: getNowFormatted(),
      unitsAllocated: 0,
    };

    setRequests((prev) => [newRequest, ...prev]);

    // Update hospital active requests
    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id === requestData.hospitalId || h.name === requestData.hospitalName) {
          return { ...h, activeRequests: h.activeRequests + 1, totalRequests: h.totalRequests + 1 };
        }
        return h;
      })
    );

    // If critical priority, trigger an active urgent alert
    if (requestData.priority === 'Critical') {
      setAlerts((prev) => [
        {
          id: `ALT-REQ-${newId}`,
          type: 'URGENT_REQUEST',
          title: `Emergency Demand: ${requestData.unitsRequired} units ${requestData.bloodGroup}`,
          description: `${requestData.hospitalName} logged a CRITICAL emergency transfusion request for Patient ${requestData.patientId || 'Unassigned'}.`,
          bloodGroup: requestData.bloodGroup,
          priority: 'Critical',
          date: getNowFormatted(),
          status: 'Active',
          relatedId: newId,
        },
        ...prev,
      ]);
    }

    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        date: 'Today, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date().toISOString(),
        activity: `Blood Request Submitted (${requestData.priority})`,
        bloodGroup: requestData.bloodGroup,
        units: requestData.unitsRequired,
        status: 'Pending',
        facility: requestData.hospitalName,
        actor: 'Hospital ER Dept',
      },
      ...prev,
    ]);

    showToast(
      'Blood Request Created',
      `Request #${newId} for ${requestData.unitsRequired} units of ${requestData.bloodGroup} received.`,
      requestData.priority === 'Critical' ? 'warning' : 'info'
    );
  };

  const approveRequest = (requestId: string, allocatedUnits?: number) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    const unitsToAllocate = allocatedUnits ?? req.unitsRequired;

    // Check if sufficient units exist
    const stock = inventory.find((i) => i.bloodGroup === req.bloodGroup);
    if (stock && stock.availableUnits < unitsToAllocate) {
      showToast(
        'Insufficient Available Stock',
        `Cannot approve ${unitsToAllocate} units of ${req.bloodGroup}. Available: ${stock.availableUnits} units.`,
        'error'
      );
      return;
    }

    // Reserve the units in inventory
    setInventory((prev) =>
      prev.map((item) => {
        if (item.bloodGroup === req.bloodGroup) {
          return {
            ...item,
            availableUnits: Math.max(0, item.availableUnits - unitsToAllocate),
            reservedUnits: item.reservedUnits + unitsToAllocate,
            lastUpdated: getNowFormatted(),
          };
        }
        return item;
      })
    );

    // Update request state
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'Approved',
            unitsAllocated: unitsToAllocate,
            approvedBy: user?.name || 'Dr. Sarah Mitchell',
            approvedDate: getNowFormatted(),
          };
        }
        return r;
      })
    );

    // Activity log
    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        date: 'Today, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date().toISOString(),
        activity: 'Blood Allocation Approved & Reserved',
        bloodGroup: req.bloodGroup,
        units: unitsToAllocate,
        status: 'Approved',
        facility: req.hospitalName,
        actor: user?.name || 'Admin',
      },
      ...prev,
    ]);

    showToast('Request Approved', `Allocated ${unitsToAllocate} units of ${req.bloodGroup} for ${req.hospitalName}.`, 'success');
  };

  const fulfillRequest = (requestId: string) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    const unitsToDeduct = req.unitsAllocated || req.unitsRequired;

    // If was approved, deduct from reserved units; if pending, deduct from available
    setInventory((prev) =>
      prev.map((item) => {
        if (item.bloodGroup === req.bloodGroup) {
          if (req.status === 'Approved') {
            return {
              ...item,
              reservedUnits: Math.max(0, item.reservedUnits - unitsToDeduct),
              lastUpdated: getNowFormatted(),
            };
          } else {
            return {
              ...item,
              availableUnits: Math.max(0, item.availableUnits - unitsToDeduct),
              lastUpdated: getNowFormatted(),
            };
          }
        }
        return item;
      })
    );

    // Update request
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Fulfilled' } : r))
    );

    // Decrement hospital active count
    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id === req.hospitalId || h.name === req.hospitalName) {
          return { ...h, activeRequests: Math.max(0, h.activeRequests - 1) };
        }
        return h;
      })
    );

    // Resolve any linked alert
    setAlerts((prev) =>
      prev.map((a) => (a.relatedId === requestId ? { ...a, status: 'Resolved' } : a))
    );

    // Add activity
    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        date: 'Today, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date().toISOString(),
        activity: 'Blood Units Dispatched & Fulfilled',
        bloodGroup: req.bloodGroup,
        units: unitsToDeduct,
        status: 'Issued',
        facility: req.hospitalName,
        actor: user?.name || 'ColdChain Logistics',
      },
      ...prev,
    ]);

    showToast('Blood Dispatched & Fulfilled', `Issued ${unitsToDeduct} units of ${req.bloodGroup} to ${req.hospitalName}.`, 'success');
  };

  const rejectRequest = (requestId: string, reason: string) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    // If it was already approved, return reserved units to available
    if (req.status === 'Approved' && req.unitsAllocated) {
      setInventory((prev) =>
        prev.map((item) => {
          if (item.bloodGroup === req.bloodGroup) {
            return {
              ...item,
              availableUnits: item.availableUnits + (req.unitsAllocated || 0),
              reservedUnits: Math.max(0, item.reservedUnits - (req.unitsAllocated || 0)),
              lastUpdated: getNowFormatted(),
            };
          }
          return item;
        })
      );
    }

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'Rejected',
              rejectionReason: reason || 'Not approved due to protocol mismatch.',
            }
          : r
      )
    );

    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id === req.hospitalId || h.name === req.hospitalName) {
          return { ...h, activeRequests: Math.max(0, h.activeRequests - 1) };
        }
        return h;
      })
    );

    showToast('Request Rejected', `Request #${requestId} was rejected. Reason: ${reason}`, 'warning');
  };

  // Hospital actions
  const addHospital = (hospitalData: Omit<Hospital, 'id' | 'activeRequests' | 'totalRequests'>) => {
    const newId = `HOSP-${Math.floor(10 + Math.random() * 90)}`;
    const newHospital: Hospital = {
      ...hospitalData,
      id: newId,
      activeRequests: 0,
      totalRequests: 0,
    };
    setHospitals((prev) => [...prev, newHospital]);
    showToast('Hospital Added', `${newHospital.name} added to partner network.`, 'success');
  };

  const updateHospital = (id: string, updatedData: Partial<Hospital>) => {
    setHospitals((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updatedData } : h))
    );
    showToast('Hospital Updated', `Hospital profile updated.`, 'info');
  };

  // Alert actions
  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Acknowledged' } : a))
    );
    showToast('Alert Acknowledged', 'Alert status moved to acknowledged.', 'info');
  };

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Resolved' } : a))
    );
    showToast('Alert Resolved', 'Alert marked as resolved.', 'success');
  };

  const triggerEmergencyBroadcast = (bloodGroup: BloodGroup, message?: string) => {
    const matchingDonors = donors.filter(
      (d) => d.bloodGroup === bloodGroup && d.status === 'Eligible'
    );

    showToast(
      'Urgent Donor Broadcast Sent',
      `Dispatched SMS & App notifications to ${matchingDonors.length} eligible ${bloodGroup} donors!`,
      'success'
    );

    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        date: 'Today, ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date().toISOString(),
        activity: `Emergency Broadcast Sent to ${bloodGroup} Donors (${matchingDonors.length} contacted)`,
        bloodGroup,
        units: matchingDonors.length,
        status: 'Completed',
        facility: 'Automated SMS / Push Gateway',
        actor: user?.name || 'System Dispatcher',
      },
      ...prev,
    ]);
  };

  // Settings
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      return updated;
    });
    showToast('Settings Saved', 'System configurations updated successfully.', 'success');
  };

  // Auth
  const login = (email?: string, password?: string) => {
    setIsAuthenticated(true);
    setUser(DEFAULT_USER);
    showToast('Welcome Back', `Logged in as ${DEFAULT_USER.name} (${DEFAULT_USER.role})`, 'success');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast('Logged Out', 'You have been safely signed out.', 'info');
  };

  // Reset to default data
  const resetToDefaultData = () => {
    setInventory(INITIAL_INVENTORY);
    setDonors(INITIAL_DONORS);
    setRequests(INITIAL_REQUESTS);
    setHospitals(INITIAL_HOSPITALS);
    setAlerts(INITIAL_ALERTS);
    setActivities(INITIAL_ACTIVITIES);
    setSettings(INITIAL_SETTINGS);
    setUser(DEFAULT_USER);
    setIsAuthenticated(true);
    localStorage.clear();
    showToast('Data Reset', 'All records restored to realistic initial baseline.', 'info');
  };

  // Calculated Metrics
  const totalUnits = inventory.reduce((sum, item) => sum + item.availableUnits, 0);
  const totalReservedUnits = inventory.reduce((sum, item) => sum + item.reservedUnits, 0);
  const totalExpiringUnits = inventory.reduce((sum, item) => sum + item.expiringUnits, 0);
  const eligibleDonorsCount = donors.filter((d) => d.status === 'Eligible').length;
  const pendingRequestsCount = requests.filter((r) => r.status === 'Pending').length;

  const criticalStockGroups = inventory.filter((item) => {
    const min = settings.minThresholds[item.bloodGroup] || item.minimumRequired;
    return item.availableUnits < min;
  });

  const lowStockGroups = inventory.filter((item) => {
    const min = settings.minThresholds[item.bloodGroup] || item.minimumRequired;
    return item.availableUnits >= min && item.availableUnits < min * 1.4;
  });

  return (
    <BloodSupplyContext.Provider
      value={{
        inventory,
        donors,
        requests,
        hospitals,
        alerts,
        activities,
        settings,
        user,
        isAuthenticated,
        activePage,
        toasts,
        searchQuery,
        setActivePage,
        setSearchQuery,
        showToast,
        dismissToast,
        addStock,
        updateStock,
        getStockStatus,
        getBloodGroupStock,
        addDonor,
        updateDonor,
        deleteDonor,
        createRequest,
        approveRequest,
        fulfillRequest,
        rejectRequest,
        addHospital,
        updateHospital,
        acknowledgeAlert,
        resolveAlert,
        triggerEmergencyBroadcast,
        updateSettings,
        login,
        logout,
        resetToDefaultData,
        totalUnits,
        totalReservedUnits,
        totalExpiringUnits,
        eligibleDonorsCount,
        pendingRequestsCount,
        criticalStockGroups,
        lowStockGroups,
      }}
    >
      {children}
    </BloodSupplyContext.Provider>
  );
};

export const useBloodSupply = () => {
  const context = useContext(BloodSupplyContext);
  if (!context) {
    throw new Error('useBloodSupply must be used within a BloodSupplyProvider');
  }
  return context;
};
