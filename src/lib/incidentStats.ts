import type {
  Incident,
  IncidentStatus,
  IncidentType,
  Zone,
} from "@/lib/schemas";

// Aggregators puros: reciben data, devuelven KPIs. Sin React, sin efectos.
// Testeables en aislamiento (input -> output).

// 1. Total de incidentes.
export function totalIncidents(incidents: Incident[]): number {
  return incidents.length;
}

// 2. Conteo por estado -> { REPORTED: 3, IN_PROGRESS: 1, RESOLVED: 5 }
// El acumulador arranca con TODAS las claves en 0: un estado sin
// incidentes devuelve 0, no queda ausente del objeto.
export function countByStatus(
  incidents: Incident[],
): Record<IncidentStatus, number> {
  return incidents.reduce(
    (acc, incident) => {
      acc[incident.status]++;
      return acc;
    },
    { REPORTED: 0, IN_PROGRESS: 0, RESOLVED: 0 } as Record<
      IncidentStatus,
      number
    >,
  );
}

// 3. Conteo por tipo -> { OVERFLOW: 2, DAMAGE: 4, LITTERING: 0, OTHER: 1 }
export function countByType(
  incidents: Incident[],
): Record<IncidentType, number> {
  return incidents.reduce(
    (acc, incident) => {
      acc[incident.type]++;
      return acc;
    },
    { OVERFLOW: 0, DAMAGE: 0, LITTERING: 0, OTHER: 0 } as Record<
      IncidentType,
      number
    >,
  );
}

// 4. Conteo por zona, para el gráfico. Recorre `zones` (no `incidents`)
// para incluir zonas con 0, y trae el NOMBRE que el chart necesita.
export function countByZone(
  incidents: Incident[],
  zones: Zone[],
): { zoneId: string; zoneName: string; count: number }[] {
  return zones.map((zone) => ({
    zoneId: zone.id,
    zoneName: zone.name,
    count: incidents.filter((incident) => incident.zoneId === zone.id).length,
  }));
}
