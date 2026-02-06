export interface Gym {
  id: string;
  name: string;
  nameSw: string;
  location: string;
  city: string;
  region: string;
  amenities: string[];
  amenitiesSw: string[];
  priceRange: 'budget' | 'moderate' | 'premium';
  distance?: number; // in km
  coordinates: {
    lat: number;
    lng: number;
  };
  contact?: string;
  hours?: string;
}

// Comprehensive Tanzania Gyms Database
export const tanzaniaGyms: Gym[] = [
  // DAR ES SALAAM
  {
    id: 'gym-dsm-001',
    name: 'Colosseum Fitness Club',
    nameSw: 'Colosseum Fitness Club',
    location: 'Msasani Peninsula, Oyster Bay',
    city: 'Dar es Salaam',
    region: 'Dar es Salaam',
    amenities: ['Modern equipment', 'Group classes', 'Personal training', 'Sauna', 'Swimming pool'],
    amenitiesSw: ['Vifaa vya kisasa', 'Mazoezi ya kikundi', 'Mwalimu binafsi', 'Sauna', 'Bwawa la kuogelea'],
    priceRange: 'premium',
    coordinates: { lat: -6.7614, lng: 39.2694 },
    contact: '+255 22 260 1234',
    hours: '5:00 - 22:00',
  },
  {
    id: 'gym-dsm-002',
    name: 'Slipway Fitness Centre',
    nameSw: 'Kituo cha Mazoezi Slipway',
    location: 'Slipway, Msasani',
    city: 'Dar es Salaam',
    region: 'Dar es Salaam',
    amenities: ['Gym equipment', 'Yoga classes', 'Cardio zone', 'Locker rooms'],
    amenitiesSw: ['Vifaa vya gym', 'Mazoezi ya yoga', 'Eneo la cardio', 'Vyumba vya kuhifadhi'],
    priceRange: 'moderate',
    coordinates: { lat: -6.7654, lng: 39.2734 },
    contact: '+255 22 260 0893',
    hours: '6:00 - 21:00',
  },
  {
    id: 'gym-dsm-003',
    name: 'Gold\'s Gym Tanzania',
    nameSw: 'Gold\'s Gym Tanzania',
    location: 'Mlimani City, Sam Nujoma Road',
    city: 'Dar es Salaam',
    region: 'Dar es Salaam',
    amenities: ['Weight training', 'Cardio machines', 'Group fitness', 'Nutrition advice'],
    amenitiesSw: ['Mazoezi ya uzito', 'Mashine za cardio', 'Mazoezi ya kikundi', 'Ushauri wa lishe'],
    priceRange: 'moderate',
    coordinates: { lat: -6.7732, lng: 39.2472 },
    contact: '+255 767 123 456',
    hours: '5:30 - 22:00',
  },
  {
    id: 'gym-dsm-004',
    name: 'Fitness Pro Gym',
    nameSw: 'Fitness Pro Gym',
    location: 'Mikocheni, Regent Estate',
    city: 'Dar es Salaam',
    region: 'Dar es Salaam',
    amenities: ['Free weights', 'Treadmills', 'CrossFit area', 'Showers'],
    amenitiesSw: ['Mizigo ya bure', 'Mashine za kukimbia', 'Eneo la CrossFit', 'Shawa'],
    priceRange: 'budget',
    coordinates: { lat: -6.7689, lng: 39.2589 },
    contact: '+255 713 456 789',
    hours: '6:00 - 21:00',
  },
  {
    id: 'gym-dsm-005',
    name: 'City Gym & Fitness',
    nameSw: 'City Gym & Fitness',
    location: 'Kariakoo, Uhuru Street',
    city: 'Dar es Salaam',
    region: 'Dar es Salaam',
    amenities: ['Basic equipment', 'Affordable rates', 'Friendly staff'],
    amenitiesSw: ['Vifaa vya msingi', 'Bei nafuu', 'Wafanyakazi wapole'],
    priceRange: 'budget',
    coordinates: { lat: -6.8176, lng: 39.2753 },
    contact: '+255 765 234 567',
    hours: '6:00 - 20:00',
  },
  {
    id: 'gym-dsm-006',
    name: 'Oysterbay Fitness Club',
    nameSw: 'Oysterbay Fitness Club',
    location: 'Oysterbay, Haile Selassie Road',
    city: 'Dar es Salaam',
    region: 'Dar es Salaam',
    amenities: ['Swimming pool', 'Tennis courts', 'Gym', 'Spa services'],
    amenitiesSw: ['Bwawa la kuogelea', 'Viwanja vya tenisi', 'Gym', 'Huduma za spa'],
    priceRange: 'premium',
    coordinates: { lat: -6.7598, lng: 39.2701 },
    contact: '+255 22 266 7890',
    hours: '5:00 - 22:00',
  },

  // ARUSHA
  {
    id: 'gym-aru-001',
    name: 'Impala Hotel Fitness Centre',
    nameSw: 'Kituo cha Mazoezi Impala Hotel',
    location: 'Impala Hotel, Old Moshi Road',
    city: 'Arusha',
    region: 'Arusha',
    amenities: ['Hotel gym', 'Swimming pool', 'Modern equipment', 'Sauna'],
    amenitiesSw: ['Gym ya hoteli', 'Bwawa la kuogelea', 'Vifaa vya kisasa', 'Sauna'],
    priceRange: 'premium',
    coordinates: { lat: -3.3694, lng: 36.6839 },
    contact: '+255 27 250 8448',
    hours: '6:00 - 21:00',
  },
  {
    id: 'gym-aru-002',
    name: 'Arusha Fitness Hub',
    nameSw: 'Kituo cha Mazoezi Arusha',
    location: 'Njiro, Dodoma Road',
    city: 'Arusha',
    region: 'Arusha',
    amenities: ['Weight training', 'Cardio', 'Group classes', 'Personal training'],
    amenitiesSw: ['Mazoezi ya uzito', 'Cardio', 'Mazoezi ya kikundi', 'Mwalimu binafsi'],
    priceRange: 'moderate',
    coordinates: { lat: -3.3863, lng: 36.6828 },
    contact: '+255 754 123 456',
    hours: '6:00 - 21:00',
  },
  {
    id: 'gym-aru-003',
    name: 'Mountain Fitness Gym',
    nameSw: 'Mountain Fitness Gym',
    location: 'Kilombero, Stadium Area',
    city: 'Arusha',
    region: 'Arusha',
    amenities: ['Outdoor training', 'CrossFit', 'Boxing ring', 'Affordable'],
    amenitiesSw: ['Mazoezi nje', 'CrossFit', 'Rundo la ndondi', 'Bei nafuu'],
    priceRange: 'budget',
    coordinates: { lat: -3.3722, lng: 36.6876 },
    contact: '+255 768 345 678',
    hours: '6:00 - 20:00',
  },

  // MWANZA
  {
    id: 'gym-mwa-001',
    name: 'Tilapia Hotel Gym',
    nameSw: 'Gym ya Tilapia Hotel',
    location: 'Tilapia Hotel, Capri Point',
    city: 'Mwanza',
    region: 'Mwanza',
    amenities: ['Lake view', 'Swimming pool', 'Gym equipment', 'Yoga classes'],
    amenitiesSw: ['Mandhari ya ziwa', 'Bwawa la kuogelea', 'Vifaa vya gym', 'Mazoezi ya yoga'],
    priceRange: 'premium',
    coordinates: { lat: -2.5164, lng: 32.9175 },
    contact: '+255 28 250 0517',
    hours: '6:00 - 21:00',
  },
  {
    id: 'gym-mwa-002',
    name: 'Mwanza Fitness Centre',
    nameSw: 'Kituo cha Mazoezi Mwanza',
    location: 'Isamilo, Station Road',
    city: 'Mwanza',
    region: 'Mwanza',
    amenities: ['Modern equipment', 'Group training', 'Zumba classes', 'Showers'],
    amenitiesSw: ['Vifaa vya kisasa', 'Mazoezi ya kikundi', 'Mazoezi ya Zumba', 'Shawa'],
    priceRange: 'moderate',
    coordinates: { lat: -2.5212, lng: 32.9025 },
    contact: '+255 755 678 901',
    hours: '6:00 - 21:00',
  },
  {
    id: 'gym-mwa-003',
    name: 'Rock City Gym',
    nameSw: 'Rock City Gym',
    location: 'Nyamagana, Kenyatta Road',
    city: 'Mwanza',
    region: 'Mwanza',
    amenities: ['Basic gym', 'Affordable', 'Friendly community'],
    amenitiesSw: ['Gym ya msingi', 'Bei nafuu', 'Jamii ya kirafiki'],
    priceRange: 'budget',
    coordinates: { lat: -2.5167, lng: 32.9001 },
    contact: '+255 769 234 567',
    hours: '6:00 - 20:00',
  },

  // DODOMA
  {
    id: 'gym-dod-001',
    name: 'Capital Fitness Club',
    nameSw: 'Klabu ya Mazoezi Dodoma',
    location: 'Makole, Near State House',
    city: 'Dodoma',
    region: 'Dodoma',
    amenities: ['Modern gym', 'Air conditioned', 'Personal trainers', 'Nutritionist'],
    amenitiesSw: ['Gym ya kisasa', 'Ina AC', 'Waalimu binafsi', 'Mtaalamu wa lishe'],
    priceRange: 'moderate',
    coordinates: { lat: -6.1731, lng: 35.7419 },
    contact: '+255 756 789 012',
    hours: '6:00 - 21:00',
  },
  {
    id: 'gym-dod-002',
    name: 'Dodoma Sports Complex Gym',
    nameSw: 'Gym ya Ukumbi wa Michezo Dodoma',
    location: 'Iyumbu, Sports Complex',
    city: 'Dodoma',
    region: 'Dodoma',
    amenities: ['Public gym', 'Track field access', 'Budget friendly', 'Clean facilities'],
    amenitiesSw: ['Gym ya umma', 'Uwanja wa mbio', 'Bei nafuu', 'Vifaa safi'],
    priceRange: 'budget',
    coordinates: { lat: -6.1833, lng: 35.7586 },
    contact: '+255 757 890 123',
    hours: '6:00 - 19:00',
  },

  // MBEYA
  {
    id: 'gym-mbe-001',
    name: 'Highlands Fitness Centre',
    nameSw: 'Kituo cha Mazoezi Highlands',
    location: 'Iyunga, Mbeya-Tunduma Road',
    city: 'Mbeya',
    region: 'Mbeya',
    amenities: ['Mountain view', 'Outdoor training', 'CrossFit', 'Boxing'],
    amenitiesSw: ['Mandhari ya milima', 'Mazoezi nje', 'CrossFit', 'Ndondi'],
    priceRange: 'moderate',
    coordinates: { lat: -8.9094, lng: 33.4606 },
    contact: '+255 758 901 234',
    hours: '6:00 - 20:00',
  },
  {
    id: 'gym-mbe-002',
    name: 'Mbeya Power Gym',
    nameSw: 'Mbeya Power Gym',
    location: 'Mbalizi, Near Bus Stand',
    city: 'Mbeya',
    region: 'Mbeya',
    amenities: ['Bodybuilding focus', 'Free weights', 'Protein bar', 'Affordable'],
    amenitiesSw: ['Mazoezi ya kujenga mwili', 'Mizigo ya bure', 'Kinywaji cha protini', 'Bei nafuu'],
    priceRange: 'budget',
    coordinates: { lat: -8.8953, lng: 33.4438 },
    contact: '+255 769 012 345',
    hours: '6:00 - 21:00',
  },

  // MOROGORO
  {
    id: 'gym-mor-001',
    name: 'Morogoro Fitness Hub',
    nameSw: 'Kituo cha Mazoezi Morogoro',
    location: 'Kihonda, Old Dar Road',
    city: 'Morogoro',
    region: 'Morogoro',
    amenities: ['Student friendly', 'Affordable rates', 'Group classes', 'Good ventilation'],
    amenitiesSw: ['Rafiki kwa wanafunzi', 'Bei nafuu', 'Mazoezi ya kikundi', 'Hewa safi'],
    priceRange: 'budget',
    coordinates: { lat: -6.8246, lng: 37.6619 },
    contact: '+255 759 123 456',
    hours: '6:00 - 21:00',
  },

  // MOSHI
  {
    id: 'gym-mos-001',
    name: 'Kilimanjaro Fitness Centre',
    nameSw: 'Kituo cha Mazoezi Kilimanjaro',
    location: 'Rau, Kilimanjaro Road',
    city: 'Moshi',
    region: 'Kilimanjaro',
    amenities: ['Mountain view', 'Altitude training', 'Cardio', 'Functional fitness'],
    amenitiesSw: ['Mandhari ya mlima', 'Mazoezi ya juu', 'Cardio', 'Mazoezi ya kazi'],
    priceRange: 'moderate',
    coordinates: { lat: -3.3488, lng: 37.3395 },
    contact: '+255 760 234 567',
    hours: '6:00 - 20:00',
  },

  // TANGA
  {
    id: 'gym-tan-001',
    name: 'Tanga Fitness Club',
    nameSw: 'Klabu ya Mazoezi Tanga',
    location: 'Ngamiani, Independence Avenue',
    city: 'Tanga',
    region: 'Tanga',
    amenities: ['Beach proximity', 'Outdoor training', 'Boxing', 'Swimming'],
    amenitiesSw: ['Karibu na pwani', 'Mazoezi nje', 'Ndondi', 'Kuogelea'],
    priceRange: 'moderate',
    coordinates: { lat: -5.0689, lng: 39.0986 },
    contact: '+255 761 345 678',
    hours: '6:00 - 20:00',
  },
];

// Helper function to calculate distance (simplified Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// City coordinates (approximate centers)
export const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  'Dar es Salaam': { lat: -6.7924, lng: 39.2083 },
  'Arusha': { lat: -3.3869, lng: 36.6830 },
  'Mwanza': { lat: -2.5164, lng: 32.9175 },
  'Dodoma': { lat: -6.1731, lng: 35.7419 },
  'Mbeya': { lat: -8.9094, lng: 33.4606 },
  'Morogoro': { lat: -6.8246, lng: 37.6619 },
  'Moshi': { lat: -3.3488, lng: 37.3395 },
  'Tanga': { lat: -5.0689, lng: 39.0986 },
  'Zanzibar': { lat: -6.1659, lng: 39.2026 },
  'Iringa': { lat: -7.7765, lng: 35.6965 },
  'Songea': { lat: -10.6833, lng: 35.6500 },
  'Kigoma': { lat: -4.8770, lng: 29.6280 },
  'Tabora': { lat: -5.0170, lng: 32.8000 },
  'Mtwara': { lat: -10.2692, lng: 40.1833 },
};

// Get nearby gyms based on user location
export function getNearbyGyms(
  userLocation: string,
  maxResults: number = 3
): Gym[] {
  const userCoords = cityCoordinates[userLocation];
  
  if (!userCoords) {
    // Return gyms from Dar es Salaam as fallback
    return tanzaniaGyms.filter(g => g.city === 'Dar es Salaam').slice(0, maxResults);
  }

  // Calculate distances and sort
  const gymsWithDistance = tanzaniaGyms.map(gym => ({
    ...gym,
    distance: calculateDistance(
      userCoords.lat,
      userCoords.lng,
      gym.coordinates.lat,
      gym.coordinates.lng
    ),
  }));

  // Sort by distance and return closest
  return gymsWithDistance
    .sort((a, b) => a.distance! - b.distance!)
    .slice(0, maxResults);
}
