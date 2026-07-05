import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { zoneSchema } from "@/lib/schemas";
import { z } from "zod";
import { zoneKeys } from "@/lib/queryKeys";

export function useZones() {
  return useQuery({
    queryKey: zoneKeys.all,
    queryFn: async () => {
      const data = await apiFetch<unknown>("/zones");
      return z.array(zoneSchema).parse(data);
    },
    staleTime: Infinity,
  });
}
