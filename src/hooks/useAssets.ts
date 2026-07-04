import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { assetSchema, type AssetStatus, type AssetType } from "@/lib/schemas";
import { z } from "zod";

export function useAssets(filters: { status?: AssetStatus; type?: AssetType }) {
  return useQuery({
    queryKey: ["assets", filters],
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
