// Placeholder procedure store for Zustand
// This store will be implemented when procedure management features are added

import { create } from 'zustand';

interface ProcedureState {
  procedures: any[];
  loading: boolean;
  error: string | null;
}

export const useProcedureStore = create<ProcedureState>(() => ({
  procedures: [],
  loading: false,
  error: null,
}));
