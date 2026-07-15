import { useParams, useNavigate } from "react-router";
import { useIncidentById } from "@/hooks/useIncidents";

import { ArrowLeft } from "lucide-react";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  STATUS_LABELS,
  TYPE_LABELS,
  STATUS_VARIANT,
} from "@/lib/incidentOptions";
import { formatDateTime } from "@/lib/formatDate";
import { useZones } from "@/hooks/useZones";
import { useMemo } from "react";
import { Field, FieldTitle, FieldDescription } from "@/components/ui/field";
import { PageHeader } from "@/components/pageHeader/PageHeader";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";

export default function IncidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: incident,
    isPending,
    isError,
    refetch,
  } = useIncidentById(id ?? "");

  const { data: zones } = useZones();
  const zonesById = useMemo(
    () => new Map(zones?.map((z) => [z.id, z.name]) ?? []),
    [zones],
  );

  return (
    <div className="flex flex-col gap-6 h-full">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-5" />
        Volver a incidentes
      </button>
      <PageHeader title="Detalle del incidente" />
      <div className="flex-1 min-h-0">
        {isPending && <LoadingState text="Cargando incidente..." />}
        {isError && (
          <ErrorState text="Error al cargar el incidente." onRetry={refetch} />
        )}
        {!isError && incident && (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg">
                    {TYPE_LABELS[incident.type]}
                  </CardTitle>
                  <Badge variant={STATUS_VARIANT[incident.status]}>
                    {STATUS_LABELS[incident.status]}
                  </Badge>
                </div>
                <CardDescription>
                  Reportado el {formatDateTime(incident.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Field>
                  <FieldTitle>Descripción</FieldTitle>
                  <FieldDescription>{incident.description}</FieldDescription>
                </Field>
                <Field>
                  <FieldTitle>Zona</FieldTitle>
                  <FieldDescription>
                    {zonesById.get(incident.zoneId) ?? incident.zoneId}
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldTitle>Coordenadas</FieldTitle>
                  <FieldDescription className="tabular-nums">
                    {incident.lat.toFixed(5)}, {incident.lng.toFixed(5)}
                  </FieldDescription>
                </Field>
              </CardContent>
            </Card>

            {/* Mini-mapa */}
            <Card className="overflow-hidden p-0">
              <MapContainer
                center={[incident.lat, incident.lng]}
                zoom={15}
                scrollWheelZoom={false}
                className="h-72 w-full lg:h-full min-h-64"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[incident.lat, incident.lng]} />
              </MapContainer>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
