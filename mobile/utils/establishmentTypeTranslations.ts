export const ESTABLISHMENT_TYPES = {
  // Food and Beverages
  RESTAURANT: "Restaurante",
  COFFEE_SHOP: "Cafetería",
  BAR: "Bar",
  NIGHTCLUB: "Discoteca",
  BAKERY: "Panadería",
  SUPERMARKET: "Supermercado",
  GROCERY_STORE: "Tienda de Abarrotes",
  FRUIT_SHOP: "Frutería",
  BUTCHER_SHOP: "Carnicería",
  FOOD_TRUCK: "Food Truck",

  // Accommodation
  HOTEL: "Hotel",
  HOSTEL: "Hostal",
  MOTEL: "Motel",
  APART_HOTEL: "Apart Hotel",

  // Retail
  CLOTHING_STORE: "Tienda de Ropa",
  SHOE_STORE: "Zapatería",
  JEWELRY_STORE: "Joyería",
  BOOKSTORE: "Librería",
  STATIONERY_STORE: "Papelería",
  TOY_STORE: "Juguetería",
  ELECTRONICS_STORE: "Tienda de Electrónica",
  SPORTS_STORE: "Tienda de Deportes",
  PHARMACY: "Farmacia",
  HARDWARE_STORE: "Ferretería",
  PET_STORE: "Tienda de Mascotas",
  NURSERY: "Guardería",

  // Services
  HAIR_SALON: "Salón de Belleza",
  BARBER_SHOP: "Barbería",
  BEAUTY_CENTER: "Centro de Belleza",
  SPA: "Spa",
  GYM: "Gimnasio",
  LAUNDRY: "Lavandería",
  AUTO_REPAIR_SHOP: "Taller de Autos",
  MEDICAL_OFFICE: "Consultorio Médico",
  DENTAL_OFFICE: "Consultorio Dental",
  VETERINARY: "Veterinaria",
  CORPORATE_OFFICE: "Oficina Corporativa",
  EDUCATIONAL_CENTER: "Centro Educativo",

  // Entertainment and Culture
  CINEMA: "Cine",
  THEATER: "Teatro",
  MUSEUM: "Museo",
  ART_GALLERY: "Galería de Arte",
  EVENT_CENTER: "Centro de Eventos",
  AMUSEMENT_PARK: "Parque de Diversiones",
  BOWLING_ALLEY: "Boliche",

  // Others
  SHOPPING_MALL: "Centro Comercial",
  PARKING: "Estacionamiento",
  OTHER: "Otro",
} as const;

export type EstablishmentTypeKey = keyof typeof ESTABLISHMENT_TYPES;

export const getEstablishmentTypeLabel = (key: string): string => {
  return ESTABLISHMENT_TYPES[key as EstablishmentTypeKey] || key;
};

export const getEstablishmentTypeOptions = () => {
  return Object.entries(ESTABLISHMENT_TYPES).map(([key, label]) => ({
    label,
    value: key,
  }));
};
