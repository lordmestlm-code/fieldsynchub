import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { AppState, AppAction, Job, Customer, Technician, Invoice, Estimate } from '../types';
import * as api from '../api';

const initialState: AppState = {
  jobs: [],
  customers: [],
  technicians: [],
  invoices: [],
  estimates: [],
  currentUser: null,
  isLoading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_JOBS':
      return { ...state, jobs: action.payload };
    case 'ADD_JOB':
      return { ...state, jobs: [...state.jobs, action.payload] };
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map(job => 
          job.id === action.payload.id ? action.payload : job
        ),
      };
    case 'DELETE_JOB':
      return {
        ...state,
        jobs: state.jobs.filter(job => job.id !== action.payload),
      };
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload };
    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.id ? action.payload : customer
        ),
      };
    case 'DELETE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.filter(customer => customer.id !== action.payload),
      };
    case 'SET_TECHNICIANS':
      return { ...state, technicians: action.payload };
    case 'ADD_TECHNICIAN':
      return { ...state, technicians: [...state.technicians, action.payload] };
    case 'UPDATE_TECHNICIAN':
      return {
        ...state,
        technicians: state.technicians.map(tech =>
          tech.id === action.payload.id ? action.payload : tech
        ),
      };
    case 'DELETE_TECHNICIANS':
      return {
        ...state,
        technicians: state.technicians.filter(tech => tech.id !== action.payload),
      };
    case 'SET_INVOICES':
      return { ...state, invoices: action.payload };
    case 'ADD_INVOICE':
      return { ...state, invoices: [...state.invoices, action.payload] };
    case 'UPDATE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.map(invoice =>
          invoice.id === action.payload.id ? action.payload : invoice
        ),
      };
    case 'DELETE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.filter(invoice => invoice.id !== action.payload),
      };
    case 'SET_ESTIMATES':
      return { ...state, estimates: action.payload };
    case 'ADD_ESTIMATE':
      return { ...state, estimates: [...state.estimates, action.payload] };
    case 'UPDATE_ESTIMATE':
      return {
        ...state,
        estimates: state.estimates.map(estimate =>
          estimate.id === action.payload.id ? action.payload : estimate
        ),
      };
    case 'DELETE_ESTIMATE':
      return {
        ...state,
        estimates: state.estimates.filter(estimate => estimate.id !== action.payload),
      };
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  stats: api.DashboardStats | null;
  refreshStats: () => Promise<void>;
  // Helper functions
  addJob: (job: Partial<Job>) => Promise<Job>;
  updateJob: (id: string, job: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => void;
  addCustomer: (customer: Partial<Customer>) => Promise<Customer>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  addTechnician: (technician: Partial<Technician>) => Promise<Technician>;
  updateTechnician: (id: string, technician: Partial<Technician>) => Promise<void>;
  addInvoice: (invoice: Partial<Invoice>) => Promise<Invoice>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
  addEstimate: (estimate: Partial<Estimate>) => Promise<Estimate>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [stats, setStats] = useState<api.DashboardStats | null>(null);

  // Load data from API on mount
  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [jobs, customers, technicians, invoices, estimates, statsData] = await Promise.all([
        api.getJobs(),
        api.getCustomers(),
        api.getTechnicians(),
        api.getInvoices(),
        api.getEstimates(),
        api.getStats(),
      ]);

      dispatch({ type: 'SET_JOBS', payload: jobs });
      dispatch({ type: 'SET_CUSTOMERS', payload: customers });
      dispatch({ type: 'SET_TECHNICIANS', payload: technicians });
      dispatch({ type: 'SET_INVOICES', payload: invoices });
      dispatch({ type: 'SET_ESTIMATES', payload: estimates });
      setStats(statsData);

      dispatch({ 
        type: 'SET_USER', 
        payload: { 
          id: 'user-1', 
          name: 'Admin User', 
          email: 'admin@fieldsynchub.com', 
          role: 'admin' 
        } 
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to connect to server. Make sure the backend is running.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }

  const refreshStats = async () => {
    try {
      const statsData = await api.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    }
  };

  // API-backed helper functions
  const addJob = async (job: Partial<Job>): Promise<Job> => {
    const newJob = await api.createJob(job);
    dispatch({ type: 'ADD_JOB', payload: newJob });
    return newJob;
  };

  const updateJob = async (id: string, job: Partial<Job>): Promise<void> => {
    await api.updateJob(id, job);
    const updatedJob = await api.getJob(id);
    if (updatedJob) {
      dispatch({ type: 'UPDATE_JOB', payload: updatedJob });
    }
  };

  const deleteJob = (id: string) => {
    dispatch({ type: 'DELETE_JOB', payload: id });
  };

  const addCustomer = async (customer: Partial<Customer>): Promise<Customer> => {
    const newCustomer = await api.createCustomer(customer);
    dispatch({ type: 'ADD_CUSTOMER', payload: newCustomer });
    return newCustomer;
  };

  const updateCustomer = async (id: string, customer: Partial<Customer>): Promise<void> => {
    await api.updateCustomer(id, customer);
    const updatedCustomer = await api.getCustomer(id);
    if (updatedCustomer) {
      dispatch({ type: 'UPDATE_CUSTOMER', payload: updatedCustomer });
    }
  };

  const deleteCustomer = async (id: string): Promise<void> => {
    await api.deleteCustomer(id);
    dispatch({ type: 'DELETE_CUSTOMER', payload: id });
  };

  const addTechnician = async (technician: Partial<Technician>): Promise<Technician> => {
    const newTech = await api.createTechnician(technician);
    dispatch({ type: 'ADD_TECHNICIAN', payload: newTech });
    return newTech;
  };

  const updateTechnician = async (id: string, technician: Partial<Technician>): Promise<void> => {
    await api.updateTechnician(id, technician);
    const updatedTech = await api.getTechnician(id);
    if (updatedTech) {
      dispatch({ type: 'UPDATE_TECHNICIAN', payload: updatedTech });
    }
  };

  const addInvoice = async (invoice: Partial<Invoice>): Promise<Invoice> => {
    const newInvoice = await api.createInvoice(invoice);
    dispatch({ type: 'ADD_INVOICE', payload: newInvoice });
    return newInvoice;
  };

  const updateInvoice = async (id: string, invoice: Partial<Invoice>): Promise<void> => {
    await api.updateInvoice(id, invoice);
    loadAllData(); // Reload to get updated data
  };

  const addEstimate = async (estimate: Partial<Estimate>): Promise<Estimate> => {
    const newEstimate = await api.createEstimate(estimate);
    dispatch({ type: 'ADD_ESTIMATE', payload: newEstimate });
    return newEstimate;
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      stats,
      refreshStats,
      addJob,
      updateJob,
      deleteJob,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addTechnician,
      updateTechnician,
      addInvoice,
      updateInvoice,
      addEstimate,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}