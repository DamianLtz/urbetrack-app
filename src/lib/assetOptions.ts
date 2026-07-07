import type { AssetStatus, AssetType } from "@/lib/schemas";

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  BIN: "Cesto",
  CONTAINER: "Contenedor",
  BENCH: "Banco",
};

export const ASSET_STATUS_LABELS: Record<AssetStatus, string> = {
  OK: "En buen estado",
  DAMAGED: "Dañado",
  FULL: "Lleno",
  OUT_OF_SERVICE: "Fuera de servicio",
};
