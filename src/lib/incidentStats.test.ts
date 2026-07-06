import {
  countByStatus,
  countByType,
  totalIncidents,
  countByZone,
} from "./incidentStats";
import type { Incident, Zone } from "@/lib/schemas";

// Fixture: función helper para no repetir todos los campos del Incident.
// Solo nos importan status/type/zoneId en estos tests; el resto lo rellenamos.
function makeIncident(overrides: Partial<Incident>): Incident {
  return {
    id: "1",
    type: "OVERFLOW",
    status: "REPORTED",
    description: "test",
    lat: 0,
    lng: 0,
    zoneId: "1",
    createdAt: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

// TESTS:

describe("countByStatus", () => {
  it("devuelve todo en 0 con lista vacía", () => {
    expect(countByStatus([])).toEqual({
      REPORTED: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
    });
  });

  it("cuenta cada estado", () => {
    const incidents = [
      makeIncident({ status: "REPORTED" }),
      makeIncident({ status: "REPORTED" }),
      makeIncident({ status: "RESOLVED" }),
    ];
    expect(countByStatus(incidents)).toEqual({
      REPORTED: 2,
      IN_PROGRESS: 0,
      RESOLVED: 1,
    });
  });
});

describe("totalIncidents", () => {
  it("devuelve 0 con lista vacía", () => {
    expect(totalIncidents([])).toBe(0);
  });

  it("devuelve la cantidad de incidentes", () => {
    const incidents = [makeIncident({}), makeIncident({}), makeIncident({})];
    expect(totalIncidents(incidents)).toBe(3);
  });
});

describe("countByType", () => {
  it("devuelve todo en 0 con lista vacía", () => {
    expect(countByType([])).toEqual({
      OVERFLOW: 0,
      DAMAGE: 0,
      LITTERING: 0,
      OTHER: 0,
    });
  });

  it("cuenta cada tipo", () => {
    const incidents = [
      makeIncident({ type: "DAMAGE" }),
      makeIncident({ type: "DAMAGE" }),
      makeIncident({ type: "OVERFLOW" }),
      makeIncident({ type: "OTHER" }),
    ];
    expect(countByType(incidents)).toEqual({
      DAMAGE: 2,
      OVERFLOW: 1,
      LITTERING: 0,
      OTHER: 1,
    });
  });
});

describe("countByZone", () => {
  // Fixture de zonas para estos casos.
  const zones: Zone[] = [
    { id: "1", name: "Microcentro" },
    { id: "2", name: "Palermo" },
  ];

  it("devuelve todas las zonas en 0 con lista vacía de incidentes", () => {
    expect(countByZone([], zones)).toEqual([
      { zoneId: "1", zoneName: "Microcentro", count: 0 },
      { zoneId: "2", zoneName: "Palermo", count: 0 },
    ]);
  });

  it("cuenta los incidentes de cada zona e incluye las zonas sin incidentes", () => {
    const incidents = [
      makeIncident({ zoneId: "1" }),
      makeIncident({ zoneId: "1" }),
      // zona "2" queda sin incidentes -> debe aparecer con count 0
    ];
    expect(countByZone(incidents, zones)).toEqual([
      { zoneId: "1", zoneName: "Microcentro", count: 2 },
      { zoneId: "2", zoneName: "Palermo", count: 0 },
    ]);
  });
});
