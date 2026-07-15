import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useAssets } from "@/hooks/useAssets";
import { IncidentsLayer } from "@/components/map/IncidentsLayer";
import { MapFilters } from "@/components/map/MapFilters";
import { PageHeader } from "@/components/pageHeader/PageHeader";
import { ASSET_TYPE_LABELS, ASSET_STATUS_LABELS } from "@/lib/assetOptions";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";

const CABA_CENTER: [number, number] = [-34.6037, -58.3816];

export default function MapPage() {
  const { data: assets, isFetching, isError, refetch } = useAssets({});

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-4rem)]">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-4">
        <PageHeader
          title="Mapa operativo"
          subtitle="Mobiliario urbano e incidentes en CABA"
        />
        <MapFilters />
      </div>
      <div className="relative flex-1">
        {isFetching && <LoadingState text="Cargando mapa..." overlay />}
        {isError && (
          <ErrorState
            text="Hubo un problema al cargar el mapa. Reintentá"
            onRetry={refetch}
            overlay
          />
        )}
        <MapContainer center={CABA_CENTER} zoom={12} className="h-full w-full">
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MarkerClusterGroup chunkedLoading>
            {assets?.map((asset) => (
              <Marker key={asset.id} position={[asset.lat, asset.lng]}>
                <Popup>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold m-0!">
                      Tipo:{" "}
                      <span className="font-normal">
                        {ASSET_TYPE_LABELS[asset.type]}
                      </span>
                    </p>
                    <p className="text-xs font-semibold m-0!">
                      Estado:{" "}
                      <span className="font-normal">
                        {ASSET_STATUS_LABELS[asset.status]}
                      </span>
                    </p>
                    <p className="text-xs font-semibold m-0!">
                      Dirección:{" "}
                      <span className="font-normal">{asset.address}</span>
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
          <IncidentsLayer />
        </MapContainer>
      </div>
    </div>
  );
}
