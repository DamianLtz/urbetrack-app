import { incidentInputSchema, isValidStatus } from "./schemas";
import type { IncidentInput } from "./schemas";

// Fixture: un input válido base. Cada test pisa solo el campo que quiere romper.
function makeInput(overrides: Partial<IncidentInput> = {}): IncidentInput {
  return {
    type: "OVERFLOW",
    description: "Contenedor desbordado",
    lat: -34.6037,
    lng: -58.3816,
    zoneId: "1",
    ...overrides,
  };
}

describe("incidentInputSchema", () => {
  it("acepta un input válido", () => {
    const result = incidentInputSchema.safeParse(makeInput());
    expect(result.success).toBe(true);
  });

  it("rechaza description vacía", () => {
    const result = incidentInputSchema.safeParse(
      makeInput({ description: "" }),
    );
    expect(result.success).toBe(false);
  });

  it("rechaza zoneId vacío", () => {
    const result = incidentInputSchema.safeParse(makeInput({ zoneId: "" }));
    expect(result.success).toBe(false);
  });

  it("rechaza un type fuera del enum", () => {
    const result = incidentInputSchema.safeParse({
      type: "FUEGO" as IncidentInput["type"],
      description: "Contenedor en llamas",
      lat: -34.6037,
      lng: -58.3816,
      zoneId: "1",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza si falta lat", () => {
    const result = incidentInputSchema.safeParse({
      ...makeInput(),
      lat: undefined,
    });
    expect(result.success).toBe(false);
  });
});

describe("isValidStatus", () => {
  it("reconoce un estado válido", () => {
    expect(isValidStatus("REPORTED")).toBe(true);
  });

  it("rechaza un string cualquiera", () => {
    expect(isValidStatus("INVALIDO")).toBe(false);
  });

  it("rechaza null / undefined", () => {
    expect(isValidStatus(null)).toBe(false);
    expect(isValidStatus(undefined)).toBe(false);
  });
});
