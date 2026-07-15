import { useMemo, useState } from "react";
import { useIncidents } from "@/hooks/useIncidents";
import { useZones } from "@/hooks/useZones";
import { getIncidentsColumns } from "@/components/dataTable/columns/incidentsColumns";
import { DataTable } from "@/components/dataTable/DataTable";
import type { IncidentFilters } from "@/lib/queryKeys";
import { Button } from "@/components/ui/button";
import { IncidentsFilterDialog } from "@/components/dialogs/IncidentsFilterDialog";
import { IncidentsFilterChips } from "@/components/chips/IncidentsFilterChips";
import { Link, useNavigate, useSearchParams } from "react-router";
import { PageHeader } from "@/components/pageHeader/PageHeader";
import { isValidStatus } from "@/lib/schemas";
import { LoadingState } from "@/components/feedback/LoadingState";
import { ErrorState } from "@/components/feedback/ErrorState";

export default function IncidentsPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<IncidentFilters>(() => {
    const status = searchParams.get("status");
    return isValidStatus(status) ? { status } : {};
  });
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
        <div className="flex flex-col gap-4">
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

      <div className="flex-1 min-h-0">
        {isPending && <LoadingState text="Cargando incidentes..." />}
        {isError && (
          <ErrorState
            text="Hubo un problema al cargar los incidentes. Reintentá"
            onRetry={refetch}
          />
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
