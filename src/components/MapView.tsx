import React, { useEffect, useRef } from "react";
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  useMap,
  Circle
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MissingPerson } from "../services/personService";

// Fix Leaflet marker icons
// @ts-ignore
import markerIcon from "leaflet/dist/images/marker-icon.png";
// @ts-ignore
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  cases: MissingPerson[];
  userLocation?: { lat: number, lng: number };
  onMarkerClick?: (c: MissingPerson) => void;
}

const SetViewOnClick = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
};

const MapView: React.FC<MapViewProps> = ({ cases, userLocation, onMarkerClick }) => {
  const defaultPos: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : [13.7563, 100.5018]; // Default to Bangkok or center

  return (
    <MapContainer 
      center={defaultPos} 
      zoom={13} 
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {userLocation && (
        <>
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>You are here</Popup>
          </Marker>
          <Circle 
            center={[userLocation.lat, userLocation.lng]} 
            radius={10000} 
            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.1, weight: 1, dashArray: '5, 5' }}
          />
        </>
      )}

      {cases.map((c) => (
        <Marker 
          key={c.id} 
          position={[c.lastSeenLocation.lat, c.lastSeenLocation.lng]}
          eventHandlers={{
            click: () => onMarkerClick?.(c),
          }}
        >
          <Popup>
            <div className="p-1">
              <p className="font-bold text-slate-900">{c.name}</p>
              <p className="text-xs text-slate-600 line-clamp-1">{c.lastSeenLocation.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {userLocation && <SetViewOnClick coords={[userLocation.lat, userLocation.lng]} />}
    </MapContainer>
  );
};

export default MapView;
