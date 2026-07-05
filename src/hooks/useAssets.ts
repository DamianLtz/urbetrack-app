import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { assetSchema } from "@/lib/schemas";
import { z } from "zod";
import { assetKeys, type AssetFilters } from "@/lib/queryKeys";

export function useAssets(filters: AssetFilters) {
  return useQuery({
    queryKey: assetKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.type) params.set("type", filters.type);
      const queryString = params.toString();
      const data = await apiFetch<unknown>(
        `/assets${queryString ? `?${queryString}` : ""}`,
      );
      return z.array(assetSchema).parse(data);
    },
  });
}
