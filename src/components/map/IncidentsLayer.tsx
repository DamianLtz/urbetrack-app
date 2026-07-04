import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useIncidents } from "@/hooks/useIncidents";
import { useFilterStore } from "@/stores/filterStore";

const incidentIcon = L.divIcon({
  className: "",
  html: `<div class="size-4 rounded-full bg-red-600 border-2 border-white shadow"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export function IncidentsLayer() {
  const zoneId = useFilterStore((s) => s.zoneId);
  const status = useFilterStore((s) => s.status);
  const type = useFilterStore((s) => s.type);
  const { data: incidents } = useIncidents({ zoneId, status, type });

  if (!incidents) return null;

  return (
    <>
      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[incident.lat, incident.lng]}
          icon={incidentIcon}
        >
          <Popup>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold m-0!">
                Tipo: <span className="font-normal">{incident.type}</span>
              </p>
              <p className="text-xs font-semibold m-0!">
                Estado: <span className="font-normal">{incident.status}</span>
              </p>
              <p className="text-xs font-semibold m-0!">
                Descripción:{" "}
                <span className="font-normal">{incident.description}</span>
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
