import { MapPin, Phone, Navigation, X, Filter } from 'lucide-react';
import { useState } from 'react';
import { Gym, tanzaniaGyms, getNearbyGyms } from '../data/tanzania-gyms';

interface AllGymsModalProps {
  userLocation: string;
  language: 'sw' | 'en';
  onClose: () => void;
}

export function AllGymsModal({ userLocation, language, onClose }: AllGymsModalProps) {
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [filterPrice, setFilterPrice] = useState<'all' | 'budget' | 'moderate' | 'premium'>('all');
  const [filterCity, setFilterCity] = useState<string>('all');

  const text = language === 'sw' ? {
    title: 'Gym Zote',
    close: 'Funga',
    filter: 'Chuja',
    all: 'Zote',
    city: 'Jiji',
    priceRange: 'Bei',
    budget: 'Bei nafuu',
    moderate: 'Wastani',
    premium: 'Bei ya juu',
    gymsFound: 'gym zimepatikana',
    away: 'mbali',
    call: 'Piga Simu',
    directions: 'Mwelekeo',
    amenities: 'Vifaa',
    about: 'Kuhusu',
    contact: 'Mawasiliano',
    hours: 'Saa za Kufungua',
    nearby: 'Karibu Nawe',
  } : {
    title: 'All Gyms',
    close: 'Close',
    filter: 'Filter',
    all: 'All',
    city: 'City',
    priceRange: 'Price',
    budget: 'Budget',
    moderate: 'Moderate',
    premium: 'Premium',
    gymsFound: 'gyms found',
    away: 'away',
    call: 'Call',
    directions: 'Directions',
    amenities: 'Amenities',
    about: 'About',
    contact: 'Contact',
    hours: 'Hours',
    nearby: 'Near You',
  };

  const priceLabels = {
    budget: text.budget,
    moderate: text.moderate,
    premium: text.premium,
  };

  const priceColors = {
    budget: 'bg-[#1EB53A]/10 text-[#0F7A28] border-[#1EB53A]/20',
    moderate: 'bg-[#00A3DD]/10 text-[#0077A3] border-[#00A3DD]/20',
    premium: 'bg-[#FF6B35]/10 text-[#E85A2A] border-[#FF6B35]/20',
  };

  // Get all unique cities
  const cities = ['all', ...Array.from(new Set(tanzaniaGyms.map(g => g.city)))];

  // Filter gyms
  const filteredGyms = getNearbyGyms(userLocation, 100).filter(gym => {
    if (filterPrice !== 'all' && gym.priceRange !== filterPrice) return false;
    if (filterCity !== 'all' && gym.city !== filterCity) return false;
    return true;
  });

  const handleCall = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Direct tel: link - works on all devices
    const telLink = document.createElement('a');
    telLink.href = `tel:${phone}`;
    telLink.click();
  };

  const handleDirections = (gym: Gym, e: React.MouseEvent) => {
    e.stopPropagation();
    // Open Google Maps with directions
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${gym.coordinates.lat},${gym.coordinates.lng}`;
    const link = document.createElement('a');
    link.href = googleMapsUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  const handleGymClick = (gym: Gym) => {
    setSelectedGym(gym);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] text-white p-4 sm:p-6 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl mb-1" style={{ fontWeight: 600 }}>
                {text.title}
              </h2>
              <p className="text-white/90 text-sm">
                {filteredGyms.length} {text.gymsFound}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex-shrink-0 p-4 border-b border-[#E5E7EB] bg-white">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-[#6B7280]" />
            <span className="text-sm text-[#6B7280]" style={{ fontWeight: 600 }}>
              {text.filter}
            </span>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {/* Price Filter */}
            <button
              onClick={() => setFilterPrice('all')}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                filterPrice === 'all'
                  ? 'bg-[#1EB53A] text-white'
                  : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
              }`}
              style={{ fontWeight: 600 }}
            >
              {text.all}
            </button>
            <button
              onClick={() => setFilterPrice('budget')}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                filterPrice === 'budget'
                  ? 'bg-[#1EB53A] text-white'
                  : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
              }`}
              style={{ fontWeight: 600 }}
            >
              {text.budget}
            </button>
            <button
              onClick={() => setFilterPrice('moderate')}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                filterPrice === 'moderate'
                  ? 'bg-[#1EB53A] text-white'
                  : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
              }`}
              style={{ fontWeight: 600 }}
            >
              {text.moderate}
            </button>
            <button
              onClick={() => setFilterPrice('premium')}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                filterPrice === 'premium'
                  ? 'bg-[#1EB53A] text-white'
                  : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
              }`}
              style={{ fontWeight: 600 }}
            >
              {text.premium}
            </button>

            {/* City Pills */}
            <div className="h-6 w-px bg-[#E5E7EB] mx-1" />
            {cities.slice(0, 4).map(city => (
              <button
                key={city}
                onClick={() => setFilterCity(city)}
                className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                  filterCity === city
                    ? 'bg-[#00A3DD] text-white'
                    : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
                }`}
                style={{ fontWeight: 600 }}
              >
                {city === 'all' ? text.all : city}
              </button>
            ))}
          </div>
        </div>

        {/* Gym List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredGyms.map((gym) => (
            <div
              key={gym.id}
              onClick={() => handleGymClick(gym)}
              className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] hover:border-[#1EB53A]/30 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base text-[#111827] mb-1 truncate" style={{ fontWeight: 600 }}>
                    {language === 'sw' ? gym.nameSw : gym.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{gym.location}</span>
                  </div>
                </div>
                <span className={`ml-2 px-2 py-1 rounded-lg text-[10px] whitespace-nowrap border ${priceColors[gym.priceRange]}`} style={{ fontWeight: 600 }}>
                  {priceLabels[gym.priceRange]}
                </span>
              </div>

              {gym.distance !== undefined && (
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-[#1EB53A] to-[#0F7A28] rounded-lg flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs text-[#1EB53A]" style={{ fontWeight: 600 }}>
                    {gym.distance < 1 
                      ? `${Math.round(gym.distance * 1000)}m ${text.away}`
                      : `${gym.distance.toFixed(1)}km ${text.away}`
                    }
                  </span>
                </div>
              )}

              <div className="flex gap-2 mt-3">
                {gym.contact && (
                  <button
                    onClick={(e) => handleCall(gym.contact!, e)}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] text-white rounded-lg hover:shadow-lg transition-all text-xs active:scale-95 flex items-center justify-center gap-1.5"
                    style={{ fontWeight: 600 }}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {text.call}
                  </button>
                )}
                <button
                  onClick={(e) => handleDirections(gym, e)}
                  className="flex-1 py-2 px-3 bg-[#00A3DD] text-white rounded-lg hover:shadow-lg transition-all text-xs active:scale-95 flex items-center justify-center gap-1.5"
                  style={{ fontWeight: 600 }}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  {text.directions}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gym Details Modal (overlay on top) */}
      {selectedGym && (
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedGym(null)}
        >
          <div 
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] text-white p-6 rounded-t-3xl">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl mb-2" style={{ fontWeight: 600 }}>
                    {language === 'sw' ? selectedGym.nameSw : selectedGym.name}
                  </h2>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{selectedGym.location}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGym(null)}
                  className="w-8 h-8 flex-shrink-0 ml-3 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  ✕
                </button>
              </div>
              {selectedGym.distance !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <Navigation className="w-4 h-4" />
                  <span>
                    {selectedGym.distance < 1 
                      ? `${Math.round(selectedGym.distance * 1000)}m ${text.away}`
                      : `${selectedGym.distance.toFixed(1)}km ${text.away}`
                    }
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">{text.about}</span>
                <span className={`px-3 py-1.5 rounded-xl text-sm border ${priceColors[selectedGym.priceRange]}`} style={{ fontWeight: 600 }}>
                  {priceLabels[selectedGym.priceRange]}
                </span>
              </div>

              <div>
                <h3 className="text-sm text-[#6B7280] mb-3" style={{ fontWeight: 600 }}>
                  {text.amenities}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(language === 'sw' ? selectedGym.amenitiesSw : selectedGym.amenities).map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] text-sm text-[#374151]"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {selectedGym.contact && (
                  <button
                    onClick={() => handleCall(selectedGym.contact!, {} as any)}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] text-white rounded-xl hover:shadow-lg transition-all text-sm active:scale-95 flex items-center justify-center gap-2"
                    style={{ fontWeight: 600 }}
                  >
                    <Phone className="w-4 h-4" />
                    {text.call}
                  </button>
                )}
                <button
                  onClick={() => handleDirections(selectedGym, {} as any)}
                  className="flex-1 py-3 px-4 bg-[#00A3DD] text-white rounded-xl hover:shadow-lg transition-all text-sm active:scale-95 flex items-center justify-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  <Navigation className="w-4 h-4" />
                  {text.directions}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}