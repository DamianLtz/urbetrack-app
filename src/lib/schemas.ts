import { z } from "zod";

// INCIDENTS:

export const incidentTypeSchema = z.enum([
  "OVERFLOW",
  "DAMAGE",
  "LITTERING",
  "OTHER",
]);
export const incidentStatusSchema = z.enum([
  "REPORTED",
  "IN_PROGRESS",
  "RESOLVED",
]);

export const incidentSchema = z.object({
  id: z.string(),
  type: incidentTypeSchema,
  status: incidentStatusSchema,
  description: z.string(),
  lat: z.number(),
  lng: z.number(),
  zoneId: z.string(),
  createdAt: z.string(),
});
export type Incident = z.infer<typeof incidentSchema>;

export const incidentInputSchema = z.object({
  type: incidentTypeSchema,
  description: z.string().min(1, "La descripción es obligatoria"),
  lat: z.number(),
  lng: z.number(),
  zoneId: z.string().min(1, "Elegí una zona"),
});
export type IncidentInput = z.infer<typeof incidentInputSchema>;

// Asset:

export const assetTypeSchema = z.enum(["BIN", "CONTAINER", "BENCH"]);
export const assetStatusSchema = z.enum([
  "OK",
  "DAMAGED",
  "FULL",
  "OUT_OF_SERVICE",
]);

export const assetSchema = z.object({
  id: z.string(),
  type: assetTypeSchema,
  status: assetStatusSchema,
  lat: z.number(),
  lng: z.number(),
  address: z.string(),
  zoneId: z.string(),
});

export type Asset = z.infer<typeof assetSchema>;

// VEHICLE:

export const vehicleTypeSchema = z.enum(["TRUCK", "VAN", "PICKUP"]);
export const vehicleStatusSchema = z.enum([
  "ACTIVE",
  "MAINTENANCE",
  "OUT_OF_SERVICE",
]);

export const vehicleSchema = z.object({
  id: z.string(),
  plate: z.string(),
  type: vehicleTypeSchema,
  status: vehicleStatusSchema,
  capacity: z.number(),
  zoneId: z.string(),
});

export type Vehicle = z.infer<typeof vehicleSchema>;

// ZONE:

export const zoneSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type Zone = z.infer<typeof zoneSchema>;
