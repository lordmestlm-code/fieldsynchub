import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppState, AppAction, Job, Customer, Technician, Invoice, Estimate } from '../types';
import { 
  mockJobs, 
  mockCustomers, 
  mockTechnicians, 
  mockInvoices, 
  mockEstimates 
} from '../api';

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
  // Helper functions
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  deleteJob: (id: string) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  addTechnician: (technician: Technician) => void;
  updateTechnician: (technician: Technician) => void;
  deleteTechnician: (id: string) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  addEstimate: (estimate: Estimate) => void;
  updateEstimate: (estimate: Estimate) => void;
  deleteEstimate: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize with mock data
  useEffect(() => {
    dispatch({ type: 'SET_JOBS', payload: mockJobs });
    dispatch({ type: 'SET_CUSTOMERS', payload: mockCustomers });
    dispatch({ type: 'SET_TECHNICIANS', payload: mockTechnicians });
    dispatch({ type: 'SET_INVOICES', payload: mockInvoices });
    dispatch({ type: 'SET_ESTIMATES', payload: mockEstimates });
    dispatch({ 
      type: 'SET_USER', 
      payload: { 
        id: 'user-1', 
        name: 'Admin User', 
        email: 'admin@fieldsynchub.com', 
        role: 'admin' 
      } 
    });
  }, []);

  // Helper functions
  const addJob = (job: Job) => dispatch({ type: 'ADD_JOB', payload: job });
  const updateJob = (job: Job) => dispatch({ type: 'UPDATE_JOB', payload: job });
  const deleteJob = (id: string) => dispatch({ type: 'DELETE_JOB', payload: id });

  const addCustomer = (customer: Customer) => dispatch({ type: 'ADD_CUSTOMER', payload: customer });
  const updateCustomer = (customer: Customer) => dispatch({ type: 'UPDATE_CUSTOMER', payload: customer });
  const deleteCustomer = (id: string) => dispatch({ type: 'DELETE_CUSTOMER', payload: id });

  const addTechnician = (technician: Technician) => dispatch({ type: 'ADD_TECHNICIAN', payload: technician });
  const updateTechnician = (technician: Technician) => dispatch({ type: 'UPDATE_TECHNICIAN', payload: technician });
  const deleteTechnician = (id: string) => dispatch({ type: 'DELETE_TECHNICIANS', payload: id });

  const addInvoice = (invoice: Invoice) => dispatch({ type: 'ADD_INVOICE', payload: invoice });
  const updateInvoice = (invoice: Invoice) => dispatch({ type: 'UPDATE_INVOICE', payload: invoice });
  const deleteInvoice = (id: string) => dispatch({ type: 'DELETE_INVOICE', payload: id });

  const addEstimate = (estimate: Estimate) => dispatch({ type: 'ADD_ESTIMATE', payload: estimate });
  const updateEstimate = (estimate: Estimate) => dispatch({ type: 'UPDATE_ESTIMATE', payload: estimate });
  const deleteEstimate = (id: string) => dispatch({ type: 'DELETE_ESTIMATE', payload: id });

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      addJob,
      updateJob,
      deleteJob,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addTechnician,
      updateTechnician,
      deleteTechnician,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      addEstimate,
      updateEstimate,
      deleteEstimate,
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