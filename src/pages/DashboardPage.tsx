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
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import { useZones } from "@/hooks/useZones";
import type { IncidentStatus } from "@/lib/schemas";

export default function DashboardPage() {
  const { data: incidents, isPending, isError, refetch } = useIncidents({});
  const { data: zones } = useZones();

  const stats = useMemo(() => {
    if (!incidents || !zones) return null;
    return {
      total: totalIncidents(incidents),
      byStatus: countByStatus(incidents),
      byZone: countByZone(incidents, zones),
    };
  }, [incidents, zones]);

  return (
    <section>
      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        </div>
      ) : isError ? (
        <div className="grid place-items-center bg-background/80 h-[calc(100dvh-148px)]">
          <div className="flex flex-col items-center gap-3 text-center">
            <TriangleAlert className="size-8 text-destructive" />
            <p className="text-sm">
              Hubo un problema al cargar las estadísticas. Reintentá
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Reintentar
            </Button>
          </div>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total de incidentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>

          {/* status cards */}
          {(Object.entries(stats.byStatus) as [IncidentStatus, number][]).map(
            ([status, count]) => (
              <Card key={status}>
                <CardHeader>
                  <CardTitle>{STATUS_LABELS[status]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{count}</p>
                </CardContent>
              </Card>
            ),
          )}
        </div>
      ) : null}
    </section>
  );
}
