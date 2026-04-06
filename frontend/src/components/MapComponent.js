import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom saffron/orange icon for temples
const templeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle marker click events
const MarkerWithNavigation = ({ temple }) => {
  const navigate = useNavigate();
  
  const handleMarkerClick = () => {
    navigate(`/temple/${temple.id}`);
  };

  return (
    <Marker
      position={[temple.location.lat, temple.location.lng]}
      icon={templeIcon}
      eventHandlers={{
        click: handleMarkerClick,
      }}
    >
      <Popup>
        <div className="font-outfit" data-testid={`map-popup-${temple.id}`}>
          <h3 className="font-cormorant text-lg font-bold text-temple-slate mb-1">{temple.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{temple.location.state}</p>
          <button
            onClick={handleMarkerClick}
            className="text-sm text-saffron-600 hover:text-saffron-700 font-medium cursor-pointer bg-transparent border-none p-0"
          >
            View Details →
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

export const MapComponent = ({ temples }) => {
  if (!temples || temples.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
        <p className="font-outfit text-gray-500">Loading map...</p>
      </div>
    );
  }

  // Center of India approximately
  const center = [22.5937, 78.9629];

  return (
    <div className="w-full h-96 md:h-[600px]" data-testid="map-container">
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {temples.map((temple) => (
          <MarkerWithNavigation key={temple.id} temple={temple} />
        ))}
      </MapContainer>
    </div>
  );
};
