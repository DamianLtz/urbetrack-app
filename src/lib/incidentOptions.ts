import type { IncidentStatus, IncidentType } from "@/lib/schemas";
import type { badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";

export const STATUS_OPTIONS: { value: IncidentStatus; label: string }[] = [
  { value: "REPORTED", label: "Reportado" },
  { value: "IN_PROGRESS", label: "En progreso" },
  { value: "RESOLVED", label: "Resuelto" },
];

export const TYPE_OPTIONS: { value: IncidentType; label: string }[] = [
  { value: "DAMAGE", label: "Daño" },
  { value: "LITTERING", label: "Basura fuera de lugar" },
  { value: "OVERFLOW", label: "Desborde" },
  { value: "OTHER", label: "Otro" },
];

export const STATUS_LABELS: Record<IncidentStatus, string> = Object.fromEntries(
  STATUS_OPTIONS.map((o) => [o.value, o.label]),
) as Record<IncidentStatus, string>;

export const TYPE_LABELS: Record<IncidentType, string> = Object.fromEntries(
  TYPE_OPTIONS.map((o) => [o.value, o.label]),
) as Record<IncidentType, string>;

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

export const STATUS_VARIANT: Record<IncidentStatus, BadgeVariant> = {
  REPORTED: "destructive",
  IN_PROGRESS: "default",
  RESOLVED: "secondary",
};
