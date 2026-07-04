import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import {
  incidentSchema,
  type IncidentStatus,
  type IncidentType,
} from "@/lib/schemas";
import { z } from "zod";

export function useIncidents(filters: {
  status?: IncidentStatus;
  type?: IncidentType;
  zoneId?: string;
}) {
  return useQuery({
    queryKey: ["incidents", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.type) params.set("type", filters.type);
      if (filters.zoneId) params.set("zoneId", filters.zoneId);
      const queryString = params.toString();
      const data = await apiFetch<unknown>(
        `/incidents${queryString ? `?${queryString}` : ""}`,
      );
      return z.array(incidentSchema).parse(data);
    },
  });
}

export function useIncidentById(id: string) {
  return useQuery({
    queryKey: ["incident", id],
    enabled: !!id,
    queryFn: async () => {
      const data = await apiFetch<unknown>(`/incidents/${id}`);
      return incidentSchema.parse(data);
    },
  });
}
