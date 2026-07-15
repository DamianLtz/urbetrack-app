import { useMemo } from "react";
import { useIncidents } from "@/hooks/useIncidents";
import {
  totalIncidents,
  countByStatus,
  countByZone,
} from "@/lib/incidentStats";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUS_LABELS } from "@/lib/incidentOptions";
import { useZones } from "@/hooks/useZones";
import type { IncidentStatus } from "@/lib/schemas";
import { IncidentsByZoneChart } from "@/components/charts/IncidentsByZoneChart";
import { PageHeader } from "@/components/pageHeader/PageHeader";
import { Link } from "react-router";
import { ErrorState } from "@/components/feedback/ErrorState";

const KPI_GRID = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";

export default function DashboardPage() {
  const { data: incidents, isPending, isError, refetch } = useIncidents({});
  const {
    data: zones,
    isPending: zonesPending,
    isError: zonesError,
  } = useZones();

  const stats = useMemo(() => {
    if (!incidents || !zones) return null;
    return {
      total: totalIncidents(incidents),
      byStatus: countByStatus(incidents),
      byZone: countByZone(incidents, zones),
    };
  }, [incidents, zones]);

  function renderContent() {
    if (isPending || zonesPending) {
      return (
        <div className={KPI_GRID}>
          {[1, 2, 3, 4].map((i) => (
            <Card key={`card-KPI-${i}`}>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-3/4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-12 rounded-md" />
              </CardContent>
            </Card>
          ))}
          <Card className="col-span-4">
            <CardHeader>
              <Skeleton className="w-full h-10" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-full h-[320px]" />
            </CardContent>
          </Card>
        </div>
      );
    }

    if (isError || zonesError) {
      return (
        <ErrorState
          text="Hubo un problema al cargar las estadísticas. Reintentá"
          onRetry={refetch}
        />
      );
    }

    if (!stats) return null;

    return (
      <>
        <section className={KPI_GRID}>
          <Link to="/incidentes">
            <Card className="transition-colors outline hover:outline-2 outline-transparent hover:outline-secondary-ut">
              <CardHeader>
                <CardTitle>Total de incidentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.total}</p>
              </CardContent>
            </Card>
          </Link>

          {/* status cards */}
          {(Object.entries(stats.byStatus) as [IncidentStatus, number][]).map(
            ([status, count]) => (
              <Link to={`/incidentes?status=${status}`} key={status}>
                <Card className="transition-colors outline hover:outline-2 outline-transparent hover:outline-secondary-ut">
                  <CardHeader>
                    <CardTitle>{STATUS_LABELS[status]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{count}</p>
                  </CardContent>
                </Card>
              </Link>
            ),
          )}
        </section>
        <section>
          <IncidentsByZoneChart data={stats.byZone} />
        </section>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <PageHeader
        title="Dashboard"
        subtitle="Resumen operativo de incidentes"
      />
      <div className="grid grid-cols-1 gap-6 flex-1 min-h-0">
        {renderContent()}
      </div>
    </div>
  );
}
