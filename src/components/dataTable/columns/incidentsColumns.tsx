import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";
import type { Incident } from "@/lib/schemas";
import {
  STATUS_LABELS,
  TYPE_LABELS,
  STATUS_VARIANT,
} from "@/lib/incidentOptions";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/formatDate";

export function getIncidentsColumns(
  zonesById: Map<string, string>,
): ColumnDef<Incident>[] {
  return [
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => TYPE_LABELS[row.original.type],
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={STATUS_VARIANT[status]}>
            {STATUS_LABELS[status]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Descripción",
      cell: ({ row }) => (
        <span className="line-clamp-1 max-w-xs">
          {row.original.description}
        </span>
      ),
    },
    {
      accessorKey: "zoneId",
      header: "Zona",
      cell: ({ row }) =>
        zonesById.get(row.original.zoneId) ?? row.original.zoneId,
    },
    {
      accessorKey: "createdAt",
      header: "Fecha",
      cell: ({ row }) => formatDateTime(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <Link
          to={`/incidentes/${row.original.id}`}
          className="text-primary hover:underline"
        >
          Ver
        </Link>
      ),
    },
  ];
}
