import { useState } from "react";
import type { IncidentFilters } from "@/lib/queryKeys";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";

import { STATUS_OPTIONS, TYPE_OPTIONS } from "@/lib/incidentOptions";
import type { IncidentStatus, IncidentType } from "@/lib/schemas";
import { useZones } from "@/hooks/useZones";

type Props = {
  applied: IncidentFilters;
  onApply: (filters: IncidentFilters) => void;
};

export function IncidentsFilterDialog({ applied, onApply }: Props) {
  const [draft, setDraft] = useState<IncidentFilters>(applied);
  const [open, setOpen] = useState(false);
  const {
    data: zones,
    isPending: zonesLoading,
    isError: zonesError,
  } = useZones();

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setDraft(applied);
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default">Filtrar</Button>
      </DialogTrigger>
      <DialogContent sizeDialog="max-w-xl">
        <DialogHeader>
          <DialogTitle>Filtrar incidentes</DialogTitle>
          <DialogDescription>
            Seleccione los filtros para refinar la busqueda.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-6">
          <div className="space-y-1">
            <Label>Estado</Label>
            <Select
              value={draft.status ?? "ALL"}
              onValueChange={(value) =>
                setDraft((d) => ({
                  ...d,
                  status:
                    value === "ALL" ? undefined : (value as IncidentStatus),
                }))
              }
            >
              <SelectTrigger sizeClassName="w-full">
                <SelectValue placeholder="Seleccioná un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ALL">Todos los estados</SelectItem>
                  {STATUS_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Tipo</Label>
            <Select
              value={draft.type ?? "ALL"}
              onValueChange={(value) =>
                setDraft((d) => ({
                  ...d,
                  type: value === "ALL" ? undefined : (value as IncidentType),
                }))
              }
            >
              <SelectTrigger sizeClassName="w-full">
                <SelectValue placeholder="Seleccioná un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ALL">Todos los tipos</SelectItem>
                  {TYPE_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Zona</Label>
            <Select
              disabled={zonesLoading || zonesError}
              value={draft.zoneId ?? "ALL"}
              onValueChange={(value) =>
                setDraft((d) => ({
                  ...d,
                  zoneId: value === "ALL" ? undefined : value,
                }))
              }
            >
              <SelectTrigger
                sizeClassName="w-full"
                disabled={zonesLoading || zonesError}
              >
                <SelectValue
                  placeholder={
                    zonesLoading ? "Cargando..." : "Seleccioná la Zona"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ALL">Todas las zonas</SelectItem>
                  {zones?.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={() => {
              onApply(draft);
              setOpen(false);
            }}
          >
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
