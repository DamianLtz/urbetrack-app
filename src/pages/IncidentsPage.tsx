import { useMemo, useState } from "react";
import { useIncidents } from "@/hooks/useIncidents";
import { useZones } from "@/hooks/useZones";
import { getIncidentsColumns } from "@/components/dataTable/columns/incidentsColumns";
import { DataTable } from "@/components/dataTable/DataTable";
import type { IncidentFilters } from "@/lib/queryKeys";
import { Spinner } from "@/components/spinner/Spinner";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import { Marker, MarkerContent } from "@/components/ui/marker";
import { IncidentsFilterDialog } from "@/components/dialogs/IncidentsFilterDialog";
import { IncidentsFilterChips } from "@/components/chips/IncidentsFilterChips";
import { useNavigate } from "react-router";

export default function IncidentsPage() {
  const [filters, setFilters] = useState<IncidentFilters>({});
  const navigate = useNavigate();

  const {
    data: incidents,
    isPending,
    isError,
    refetch,
  } = useIncidents(filters);
  const { data: zones } = useZones();

  const zonesById = useMemo(
    () => new Map(zones?.map((z) => [z.id, z.name]) ?? []),
    [zones],
  );
  const columns = useMemo(() => getIncidentsColumns(zonesById), [zonesById]);

  return (
    <div className="flex flex-col gap-6 h-full">
      <h1 className="text-2xl font-bold">Incidentes</h1>

      {/* toolbar + chips: chrome persistente, siempre visible */}
      <div className="flex items-center justify-end gap-2">
        <Button
          disabled={!Object.values(filters).some(Boolean)}
          variant="ghost"
          onClick={() => setFilters({})}
        >
          Limpiar filtros
        </Button>
        <IncidentsFilterDialog applied={filters} onApply={setFilters} />
      </div>
      <div className="flex items-center justify-end">
        <IncidentsFilterChips
          applied={filters}
          onRemove={(key) => setFilters((f) => ({ ...f, [key]: undefined }))}
        />
      </div>

      {/* región de contenido: swap loading / error / tabla */}
      <div className="flex-1 min-h-0">
        {isPending && (
          <div className="grid place-items-center h-full">
            <div className="flex flex-col gap-4">
              <Spinner />
              <Marker role="status">
                <MarkerContent className="shimmer">
                  Cargando incidentes...
                </MarkerContent>
              </Marker>
            </div>
          </div>
        )}
        {isError && (
          <div className="grid place-items-center h-full">
            <div className="flex flex-col items-center gap-3 text-center">
              <TriangleAlert className="size-8 text-destructive" />
              <p className="text-sm">
                Hubo un problema al cargar los incidentes. Reintentá
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Reintentar
              </Button>
            </div>
          </div>
        )}
        {!isPending && !isError && (
          <DataTable
            columns={columns}
            data={incidents ?? []}
            onRowClick={(incident) => navigate(`/incidentes/${incident.id}`)}
          />
        )}
      </div>
    </div>
  );
}
