import { useFilterStore } from "@/stores/filterStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IncidentStatus, IncidentType } from "@/lib/schemas";
import { Label } from "@/components/ui/label";
import { useZones } from "@/hooks/useZones";
import { STATUS_OPTIONS, TYPE_OPTIONS } from "@/lib/incidentOptions";

export function MapFilters() {
  const status = useFilterStore((s) => s.status);
  const setStatus = useFilterStore((s) => s.setStatus);

  const type = useFilterStore((t) => t.type);
  const setType = useFilterStore((t) => t.setType);

  const zoneId = useFilterStore((z) => z.zoneId);
  const setZoneId = useFilterStore((z) => z.setZoneId);
  const {
    data: zones,
    isPending: zonesLoading,
    isError: zonesError,
  } = useZones();

  return (
    <div className="flex flex-col sm:flex-row md:items-center lg:justify-end gap-2 lg:self-end">
      <div className="space-y-1 flex-1 lg:flex-none">
        <Label>Estado</Label>
        <Select
          value={status ?? "ALL"}
          onValueChange={(value) =>
            setStatus(value === "ALL" ? undefined : (value as IncidentStatus))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los estados</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1 flex-1 lg:flex-none">
        <Label>Tipo</Label>
        <Select
          value={type ?? "ALL"}
          onValueChange={(value) =>
            setType(value === "ALL" ? undefined : (value as IncidentType))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los tipos</SelectItem>
            {TYPE_OPTIONS.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1 flex-1 lg:flex-none">
        <Label>Zona</Label>
        <Select
          disabled={zonesLoading || zonesError}
          value={zoneId ?? "ALL"}
          onValueChange={(value) =>
            setZoneId(value === "ALL" ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue
              placeholder={zonesLoading ? "Cargando zonas..." : "Zona"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">
              {zonesLoading ? "Cargando zonas..." : "Todas las zonas"}
            </SelectItem>
            {zones?.map((zone) => (
              <SelectItem key={zone.id} value={zone.id}>
                {zone.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
