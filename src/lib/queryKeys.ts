import type {
  IncidentStatus,
  IncidentType,
  AssetStatus,
  AssetType,
} from "@/lib/schemas";

export type IncidentFilters = {
  status?: IncidentStatus;
  type?: IncidentType;
  zoneId?: string;
};

export type AssetFilters = {
  status?: AssetStatus;
  type?: AssetType;
};

export const incidentKeys = {
  all: ["incidents"] as const,
  lists: () => [...incidentKeys.all, "list"] as const,
  list: (filters: IncidentFilters) =>
    [...incidentKeys.lists(), filters] as const,
  details: () => [...incidentKeys.all, "detail"] as const,
  detail: (id: string) => [...incidentKeys.details(), id] as const,
};

export const assetKeys = {
  all: ["assets"] as const,
  lists: () => [...assetKeys.all, "list"] as const,
  list: (filters: AssetFilters) => [...assetKeys.lists(), filters] as const,
};

export const zoneKeys = {
  all: ["zones"] as const,
};

export const vehicleKeys = {
  all: ["vehicles"] as const,
};
