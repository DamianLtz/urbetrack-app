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
import { Link, useNavigate } from "react-router";
import { PageHeader } from "@/components/pageHeader/PageHeader";

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

  // Más reciente primero: es lo esperable en una tabla operativa y de paso el
  // incidente recién creado cae en la página 1. Copia para no mutar la cache.
  const rows = useMemo(
    () =>
      [...(incidents ?? [])].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      ),
    [incidents],
  );

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <PageHeader
          title="Incidentes"
          subtitle="Listado de incidentes reportados y su estado"
        />
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center lg:justify-end gap-2">
            <Button
              disabled={!Object.values(filters).some(Boolean)}
              variant="ghost"
              onClick={() => setFilters({})}
              className="sm:flex-1 lg:flex-none"
            >
              Limpiar filtros
            </Button>
            <IncidentsFilterDialog applied={filters} onApply={setFilters} />
            <Button
              asChild
              variant="secondary"
              className="sm:flex-1 lg:flex-none"
            >
              <Link to="/incidentes/nuevo">Reportar incidente</Link>
            </Button>
          </div>
          <div className="flex items-center justify-end">
            <IncidentsFilterChips
              applied={filters}
              onRemove={(key) =>
                setFilters((f) => ({ ...f, [key]: undefined }))
              }
            />
          </div>
        </div>
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
          <div className="grid grid-cols-1">
            <DataTable
              columns={columns}
              data={rows}
              getRowId={(incident) => incident.id}
              onRowClick={(incident) => navigate(`/incidentes/${incident.id}`)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
