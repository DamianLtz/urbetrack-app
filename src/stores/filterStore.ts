import { create } from "zustand";
import type { IncidentStatus, IncidentType } from "@/lib/schemas";

interface FilterState {
  zoneId?: string;
  status?: IncidentStatus;
  type?: IncidentType;

  setZoneId: (zoneId?: string) => void;
  setStatus: (status?: IncidentStatus) => void;
  setType: (type?: IncidentType) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  zoneId: undefined,
  status: undefined,
  type: undefined,
  setZoneId: (zoneId) => set({ zoneId }),
  setStatus: (status) => set({ status }),
  setType: (type) => set({ type }),
  reset: () => set({ zoneId: undefined, status: undefined, type: undefined }),
}));
