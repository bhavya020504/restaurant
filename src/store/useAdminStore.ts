import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Reservation, 
  CallLog, 
  Recording, 
  Transcript, 
  CallSummary, 
  Complaint, 
  WhatsAppLog, 
  EmailLog, 
  ReservationStatus,
  ComplaintStatus
} from '../types';
import { 
  MOCK_RESERVATIONS, 
  MOCK_CALL_LOGS, 
  MOCK_RECORDINGS, 
  MOCK_TRANSCRIPTS, 
  MOCK_SUMMARIES, 
  MOCK_COMPLAINTS, 
  MOCK_WHATSAPP_LOGS, 
  MOCK_EMAIL_LOGS 
} from '../constants/mockData';

interface AdminState {
  reservations: Reservation[];
  callLogs: CallLog[];
  recordings: Recording[];
  transcripts: Transcript[];
  summaries: CallSummary[];
  complaints: Complaint[];
  whatsAppLogs: WhatsAppLog[];
  emailLogs: EmailLog[];

  // Reservation actions
  setReservations: (reservations: Reservation[]) => void;
  addReservation: (res: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => Reservation;
  updateReservationStatus: (id: string, status: ReservationStatus) => void;

  // Complaint actions
  addComplaint: (cmp: Omit<Complaint, 'id' | 'date' | 'status'>) => void;
  updateComplaintStatus: (id: string, status: ComplaintStatus, notes?: string) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      reservations: MOCK_RESERVATIONS,
      callLogs: MOCK_CALL_LOGS,
      recordings: MOCK_RECORDINGS,
      transcripts: MOCK_TRANSCRIPTS,
      summaries: MOCK_SUMMARIES,
      complaints: MOCK_COMPLAINTS,
      whatsAppLogs: MOCK_WHATSAPP_LOGS,
      emailLogs: MOCK_EMAIL_LOGS,

      setReservations: (reservations) => set({ reservations }),

      addReservation: (data) => {
        const id = `RES-${Math.floor(300 + Math.random() * 900)}`;
        const newRes: Reservation = {
          ...data,
          id,
          status: 'Pending',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        set((state) => ({ reservations: [newRes, ...state.reservations] }));
        return newRes;
      },

      updateReservationStatus: (id, status) => {
        set((state) => ({
          reservations: state.reservations.map((r) => (r.id === id ? { ...r, status } : r))
        }));
      },

      addComplaint: (cmp) => {
        const id = `CMP-${Math.floor(400 + Math.random() * 500)}`;
        const newCmp: Complaint = {
          ...cmp,
          id,
          status: 'Open',
          date: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        set((state) => ({ complaints: [newCmp, ...state.complaints] }));
      },

      updateComplaintStatus: (id, status, notes) => {
        set((state) => ({
          complaints: state.complaints.map((c) =>
            c.id === id ? { ...c, status, adminNotes: notes || c.adminNotes } : c
          )
        }));
      }
    }),
    {
      name: 'br-kitchen-admin-storage'
    }
  )
);
