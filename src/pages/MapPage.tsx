import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

const CABA_CENTER: [number, number] = [-34.6037, -58.3816];

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <MapContainer center={CABA_CENTER} zoom={12} className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}
