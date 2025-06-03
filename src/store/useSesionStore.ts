import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionStore {
  customerId: number | null;
  patientId: number | null;
  setCustomerId: (id: number) => void;
  setPatientId: (id: number) => void;
  clear: () => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      customerId: null,
      patientId: null,
      setCustomerId: (id) => set({ customerId: id }),
      setPatientId: (id) => set({ patientId: id }),
      clear: () => set({ customerId: null, patientId: null }),
    }),
    {
      name: "session-storage",
    }
  )
);
