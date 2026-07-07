import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useAssets } from "@/hooks/useAssets";
import { Spinner } from "@/components/spinner/Spinner";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IncidentsLayer } from "@/components/map/IncidentsLayer";
import { MapFilters } from "@/components/map/MapFilters";
import { PageHeader } from "@/components/pageHeader/PageHeader";
import { ASSET_TYPE_LABELS, ASSET_STATUS_LABELS } from "@/lib/assetOptions";

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
        {isFetching && (
          <div className="absolute inset-0 z-1000 grid place-items-center bg-background/50">
            <Spinner />
          </div>
        )}
        {isError && (
          <div className="absolute inset-0 z-1000 grid place-items-center bg-background/80">
            <div className="flex flex-col items-center gap-3 text-center">
              <TriangleAlert className="size-8 text-destructive" />
              <p className="text-sm">
                Hubo un problema al cargar el mapa. Reintentá
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Reintentar
              </Button>
            </div>
          </div>
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
