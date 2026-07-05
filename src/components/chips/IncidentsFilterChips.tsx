import { useMemo } from "react";
import type { IncidentFilters } from "@/lib/queryKeys";
import { STATUS_LABELS, TYPE_LABELS } from "@/lib/incidentOptions";
import { useZones } from "@/hooks/useZones";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type Props = {
  applied: IncidentFilters;
  onRemove: (key: keyof IncidentFilters) => void;
};

export function IncidentsFilterChips({ applied, onRemove }: Props) {
  const { data: zones } = useZones();
  const zonesById = useMemo(
    () => new Map(zones?.map((z) => [z.id, z.name]) ?? []),
    [zones],
  );

  // derivar la lista de chips activos
  const chips: { key: keyof IncidentFilters; label: string }[] = [];
  if (applied.status)
    chips.push({ key: "status", label: STATUS_LABELS[applied.status] });
  if (applied.type)
    chips.push({ key: "type", label: TYPE_LABELS[applied.type] });
  if (applied.zoneId)
    chips.push({
      key: "zoneId",
      label: zonesById.get(applied.zoneId) ?? applied.zoneId,
    });

  if (chips.length === 0) return null; // sin filtros activos → no renderizar nada

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Badge key={chip.key} variant="secondary" className="gap-1">
          {chip.label}
          <button
            type="button"
            onClick={() => onRemove(chip.key)}
            aria-label={`Quitar filtro ${chip.label}`}
            className="cursor-pointer"
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
