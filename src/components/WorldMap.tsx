import { memo, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import type { Company } from '../types';
import 'leaflet/dist/leaflet.css';

interface WorldMapProps {
  companies: Company[];
  onCountryClick: (country: string) => void;
  selectedCountries: string[];
}

// Geographic coordinates for innovation hubs
const hubCoordinates: Record<string, { lat: number; lng: number; name: string }> = {
  'USA': { lat: 39.8283, lng: -98.5795, name: 'United States' },
  'Canada': { lat: 56.1304, lng: -106.3468, name: 'Canada' },
  'Sweden': { lat: 60.1282, lng: 18.6435, name: 'Sweden' },
  'Denmark': { lat: 56.2639, lng: 9.5018, name: 'Denmark' },
  'Germany': { lat: 51.1657, lng: 10.4515, name: 'Germany' },
  'France': { lat: 46.2276, lng: 2.2137, name: 'France' },
  'Switzerland': { lat: 46.8182, lng: 8.2275, name: 'Switzerland' },
  'Lithuania': { lat: 55.1694, lng: 23.8813, name: 'Lithuania' },
  'Finland': { lat: 61.9241, lng: 25.7482, name: 'Finland' },
  'India': { lat: 20.5937, lng: 78.9629, name: 'India' },
  'China': { lat: 35.8617, lng: 104.1954, name: 'China' },
  'Australia': { lat: -25.2744, lng: 133.7751, name: 'Australia' },
  'Singapore': { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
  'Argentina': { lat: -38.4161, lng: -63.6167, name: 'Argentina' },
  'Israel': { lat: 31.0461, lng: 34.8516, name: 'Israel' },
  'Japan': { lat: 36.2048, lng: 138.2529, name: 'Japan' },
  'UK': { lat: 55.3781, lng: -3.4360, name: 'United Kingdom' },
  'Netherlands': { lat: 52.1326, lng: 5.2913, name: 'Netherlands' },
  'Brazil': { lat: -14.2350, lng: -51.9253, name: 'Brazil' },
  'Global': { lat: 20, lng: 0, name: 'Global' },
};

// Map company country strings to hub keys
const countryMapping: Record<string, string> = {
  'Sweden': 'Sweden',
  'Denmark': 'Denmark',
  'Switzerland': 'Switzerland',
  'Argentina/Australia': 'Argentina',
  'Singapore/Australia': 'Singapore',
  'France': 'France',
  'Finland': 'Finland',
  'Germany': 'Germany',
  'Australia': 'Australia',
  'India': 'India',
  'Canada': 'Canada',
  'Lithuania': 'Lithuania',
  'USA/Global': 'USA',
  'USA/Israel': 'USA',
  'USA': 'USA',
  'China': 'China',
  'Japan': 'Japan',
  'UK': 'UK',
  'Netherlands': 'Netherlands',
  'Brazil': 'Brazil',
  'Israel': 'Israel',
  'Global': 'Global',
};


// Hub data interface
interface HubData {
  country: string;
  name: string;
  lat: number;
  lng: number;
  count: number;
  companies: string[];
}

export const WorldMap = memo(function WorldMap({
  companies,
  onCountryClick,
  selectedCountries,
}: WorldMapProps) {
  // Aggregate companies by hub
  const hubData = useMemo(() => {
    const hubs: Record<string, HubData> = {};

    companies.forEach((company) => {
      // Handle multi-country entries like "USA/Global"
      const countryParts = company.country.split('/');
      const primaryCountry = countryParts[0].trim();
      const mappedCountry = countryMapping[company.country] || countryMapping[primaryCountry] || primaryCountry;

      if (hubCoordinates[mappedCountry]) {
        if (!hubs[mappedCountry]) {
          hubs[mappedCountry] = {
            country: mappedCountry,
            name: hubCoordinates[mappedCountry].name,
            lat: hubCoordinates[mappedCountry].lat,
            lng: hubCoordinates[mappedCountry].lng,
            count: 0,
            companies: [],
          };
        }
        hubs[mappedCountry].count++;
        hubs[mappedCountry].companies.push(company.name);
      }
    });

    return Object.values(hubs);
  }, [companies]);

  // Calculate marker radius based on company count
  const getRadius = (count: number): number => {
    if (count >= 6) return 20;
    if (count >= 4) return 16;
    if (count >= 2) return 12;
    return 8;
  };

  // Get marker color
  const getColor = (country: string): string => {
    const isSelected = selectedCountries.some(
      (sc) => countryMapping[sc] === country || sc === country
    );
    return isSelected ? '#f59e0b' : '#22c55e';
  };

  // Total stats
  const totalCountries = hubData.length;
  const totalCompanies = hubData.reduce((sum, hub) => sum + hub.count, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Global Innovation Hubs
          </h3>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <span className="font-bold text-gray-900 dark:text-gray-100">{totalCountries}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">countries</span>
          </div>
          <div className="text-center">
            <span className="font-bold text-gray-900 dark:text-gray-100">{totalCompanies}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">companies</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700" style={{ height: '400px' }}>
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={1}
          maxZoom={10}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {hubData.map((hub) => (
            <CircleMarker
              key={hub.country}
              center={[hub.lat, hub.lng]}
              radius={getRadius(hub.count)}
              pathOptions={{
                fillColor: getColor(hub.country),
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8,
              }}
              eventHandlers={{
                click: () => onCountryClick(hub.country),
              }}
            >
              <Popup>
                <div className="text-center min-w-[150px]">
                  <h4 className="font-bold text-gray-900 text-base mb-1">{hub.name}</h4>
                  <p className="text-green-600 font-semibold mb-2">
                    {hub.count} {hub.count === 1 ? 'company' : 'companies'}
                  </p>
                  <div className="text-left text-xs text-gray-600 max-h-32 overflow-y-auto">
                    {hub.companies.map((name, i) => (
                      <div key={i} className="py-0.5 border-b border-gray-100 last:border-0">
                        {name}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => onCountryClick(hub.country)}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Filter by {hub.name}
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>1 company</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500" />
          <span>2-3</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-green-500" />
          <span>4-5</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-500" />
          <span>6+</span>
        </div>
        <div className="flex items-center gap-2 pl-4 border-l border-gray-300 dark:border-gray-600">
          <div className="w-4 h-4 rounded-full bg-amber-500" />
          <span>Selected</span>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
        Click on a marker to see companies • Scroll to zoom • Drag to pan
      </p>
    </div>
  );
});

export default WorldMap;
