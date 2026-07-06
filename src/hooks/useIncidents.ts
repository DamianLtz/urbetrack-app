import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, apiPost } from "@/lib/api";
import { incidentSchema, type IncidentInput } from "@/lib/schemas";
import { z } from "zod";
import { incidentKeys, type IncidentFilters } from "@/lib/queryKeys";

export function useIncidents(filters: IncidentFilters) {
  return useQuery({
    queryKey: incidentKeys.list(filters),
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
    queryKey: incidentKeys.detail(id),
    enabled: !!id,
    queryFn: async () => {
      const data = await apiFetch<unknown>(`/incidents/${id}`);
      return incidentSchema.parse(data);
    },
  });
}

// Mutaciones:

export function useCreateIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: IncidentInput) => {
      const data = await apiPost<unknown>("/incidents", input);
      return incidentSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incidentKeys.lists() });
    },
  });
}
