
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { reverseGeocode } from "./ReverseGeocode";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function ChangeView({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 16, {
      animate: true,
    });
  }, [position, map]);

  return null;
}

function LocationMarker({
  position,
  setPosition,
  onLocationChange,
}) {

  useMapEvents({
    async click(e) {

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setPosition([lat, lng]);

      const location = await reverseGeocode(lat, lng);

      if (location) {
        onLocationChange(location);
      }
    },
  });

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        async dragend(e) {

          const marker = e.target;

          const latlng = marker.getLatLng();

          setPosition([
            latlng.lat,
            latlng.lng,
          ]);

          const location = await reverseGeocode(
            latlng.lat,
            latlng.lng
          );

          if (location) {
            onLocationChange(location);
          }
        },
      }}
    />
  );
}

export default function StoreMap({
  position,
  onLocationChange,
}) {

  const [markerPosition, setMarkerPosition] =
    useState(position);

  useEffect(() => {
    setMarkerPosition(position);
  }, [position]);

  return (
    <MapContainer
      center={markerPosition}
      zoom={15}
      style={{
        height: "350px",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <TileLayer
        attribution="OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ChangeView position={markerPosition} />

      <LocationMarker
        position={markerPosition}
        setPosition={setMarkerPosition}
        onLocationChange={onLocationChange}
      />
    </MapContainer>
  );
}