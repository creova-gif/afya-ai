import { MapPin, Phone, Clock, DollarSign, Navigation, ExternalLink } from 'lucide-react';
import { Gym } from '../data/tanzania-gyms';
import { useState } from 'react';

interface NearbyGymsProps {
  gyms: Gym[];
  language: 'sw' | 'en';
  onViewAll?: () => void;
}

export function NearbyGyms({ gyms, language, onViewAll }: NearbyGymsProps) {
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);

  const text = language === 'sw' ? {
    title: 'Gym za Karibu',
    viewAll: 'Angalia Zote',
    away: 'mbali',
    budget: 'Bei nafuu',
    moderate: 'Wastani',
    premium: 'Bei ya juu',
    noGyms: 'Hakuna gym zilizopo karibu',
    searchOther: 'Tafuta maeneo mengine',
    call: 'Piga Simu',
    directions: 'Mwelekeo',
    close: 'Funga',
    amenities: 'Vifaa',
    about: 'Kuhusu',
    contact: 'Mawasiliano',
    hours: 'Saa za Kufungua',
  } : {
    title: 'Nearby Gyms',
    viewAll: 'View All',
    away: 'away',
    budget: 'Budget',
    moderate: 'Moderate',
    premium: 'Premium',
    noGyms: 'No gyms found nearby',
    searchOther: 'Search other areas',
    call: 'Call',
    directions: 'Directions',
    close: 'Close',
    amenities: 'Amenities',
    about: 'About',
    contact: 'Contact',
    hours: 'Hours',
  };

  const priceLabels = {
    budget: text.budget,
    moderate: text.moderate,
    premium: text.premium,
  };

  const priceColors = {
    budget: 'bg-[#1EB53A]/10 text-[#0F7A28]',
    moderate: 'bg-[#00A3DD]/10 text-[#0077A3]',
    premium: 'bg-[#FF6B35]/10 text-[#E85A2A]',
  };

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

  if (gyms.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 border border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg text-[#111827]" style={{ fontWeight: 600 }}>
            {text.title}
          </h2>
          <MapPin className="w-5 h-5 text-[#9CA3AF]" />
        </div>
        <div className="text-center py-6">
          <div className="w-12 h-12 mx-auto mb-3 bg-[#F3F4F6] rounded-full flex items-center justify-center">
            <MapPin className="w-6 h-6 text-[#9CA3AF]" />
          </div>
          <p className="text-sm text-[#6B7280] mb-2">{text.noGyms}</p>
          <button className="text-xs text-[#1EB53A]" style={{ fontWeight: 600 }}>
            {text.searchOther}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 border border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg text-[#111827]" style={{ fontWeight: 600 }}>
            {text.title}
          </h2>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs sm:text-sm text-[#1EB53A] hover:text-[#0F7A28] transition-colors active:scale-95"
              style={{ fontWeight: 600 }}
            >
              {text.viewAll} →
            </button>
          )}
        </div>

        <div className="space-y-3">
          {gyms.map((gym) => (
            <div
              key={gym.id}
              onClick={() => handleGymClick(gym)}
              className="p-3 sm:p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] hover:border-[#1EB53A]/30 hover:shadow-md transition-all cursor-pointer active:scale-98"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base text-[#111827] mb-1 truncate" style={{ fontWeight: 600 }}>
                    {language === 'sw' ? gym.nameSw : gym.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{gym.location}</span>
                  </div>
                </div>
                <span className={`ml-2 px-2 py-1 rounded-lg text-[10px] whitespace-nowrap ${priceColors[gym.priceRange]}`} style={{ fontWeight: 600 }}>
                  {priceLabels[gym.priceRange]}
                </span>
              </div>

              {/* Distance */}
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

              {/* Amenities */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {(language === 'sw' ? gym.amenitiesSw : gym.amenities).slice(0, 3).map((amenity, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-white rounded-lg border border-[#E5E7EB] text-[10px] text-[#6B7280]"
                  >
                    {amenity}
                  </span>
                ))}
                {gym.amenities.length > 3 && (
                  <span className="px-2 py-0.5 text-[10px] text-[#9CA3AF]">
                    +{gym.amenities.length - 3}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
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

      {/* Gym Details Modal */}
      {selectedGym && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
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
              {/* Price Badge */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">{text.about}</span>
                <span className={`px-3 py-1.5 rounded-xl text-sm ${priceColors[selectedGym.priceRange]}`} style={{ fontWeight: 600 }}>
                  {priceLabels[selectedGym.priceRange]}
                </span>
              </div>

              {/* Amenities */}
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

              {/* Contact Info */}
              <div>
                <h3 className="text-sm text-[#6B7280] mb-3" style={{ fontWeight: 600 }}>
                  {text.contact}
                </h3>
                <div className="space-y-3">
                  {selectedGym.hours && (
                    <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#00A3DD] to-[#0077A3] rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-[#9CA3AF] mb-0.5">{text.hours}</div>
                        <div className="text-sm text-[#111827]" style={{ fontWeight: 600 }}>
                          {selectedGym.hours}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedGym.contact && (
                    <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#1EB53A] to-[#0F7A28] rounded-xl flex items-center justify-center">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-[#9CA3AF] mb-0.5">{text.call}</div>
                        <div className="text-sm text-[#111827] truncate" style={{ fontWeight: 600 }}>
                          {selectedGym.contact}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
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
    </>
  );
}