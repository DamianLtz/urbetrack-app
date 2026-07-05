import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { vehicleSchema } from "@/lib/schemas";
import { z } from "zod";
import { vehicleKeys } from "@/lib/queryKeys";

export function useVehicles() {
  return useQuery({
    queryKey: vehicleKeys.all,
    queryFn: async () => {
      const data = await apiFetch<unknown>("/vehicles");
      return z.array(vehicleSchema).parse(data);
    },
  });
}
