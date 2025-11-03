import { Injectable } from '@nestjs/common';
import { Client } from '@googlemaps/google-maps-services-js';

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  placeId?: string;
}

export interface LocationData {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

@Injectable()
export class GeolocationService {
  private client: Client;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('GOOGLE_MAPS_API_KEY environment variable is not set');
    }
    this.client = new Client({});
  }

  /**
   * Convierte una dirección a coordenadas geográficas
   * @param address - Dirección a geocodificar
   * @param city - Ciudad (opcional)
   * @param department - Departamento (opcional)
   * @returns Coordenadas y dirección formateada
   */
  async geocodeAddress(
    address: string,
    city?: string,
    department?: string,
  ): Promise<GeocodeResult> {
    try {
      let searchAddress = address;
      if (city) searchAddress += `, ${city}`;
      if (department) searchAddress += `, ${department}`;
      searchAddress += ', Colombia'; // Asumimos que es Colombia

      const response = await this.client.geocode({
        params: {
          address: searchAddress,
          key: this.apiKey,
          language: 'es', // Respuestas en español
          region: 'CO', // Región Colombia
        },
      });

      if (response.data.results.length === 0) {
        throw new Error('No geocoding results found for the provided address');
      }

      const result = response.data.results[0];
      const { lat, lng } = result.geometry.location;

      return {
        latitude: lat,
        longitude: lng,
        formattedAddress: result.formatted_address,
        placeId: result.place_id,
      };
    } catch (error) {
      throw new Error(`Geocoding failed: ${error.message}`);
    }
  }

  /**
   * Reversa geocodificación: obtiene dirección desde coordenadas
   * @param latitude - Latitud
   * @param longitude - Longitud
   * @returns Dirección y componentes
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<any> {
    try {
      const response = await this.client.reverseGeocode({
        params: {
          latlng: `${latitude},${longitude}`,
          key: this.apiKey,
          language: 'es' as any,
        },
      });

      if (response.data.results.length === 0) {
        throw new Error('No reverse geocoding results found');
      }

      return response.data.results[0];
    } catch (error) {
      throw new Error(`Reverse geocoding failed: ${error.message}`);
    }
  }

  /**
   * Convierte GeocodeResult a LocationData para guardar en la BD
   * @param geocodeResult - Resultado de geocodificación
   * @returns Datos de ubicación en formato GeoJSON
   */
  toLocationData(geocodeResult: GeocodeResult): LocationData {
    return {
      type: 'Point',
      coordinates: [geocodeResult.longitude, geocodeResult.latitude],
    };
  }

  /**
   * Valida que las coordenadas estén dentro de los límites de Colombia
   * @param latitude - Latitud
   * @param longitude - Longitud
   * @returns true si está en Colombia, false si no
   */
  isWithinColombia(latitude: number, longitude: number): boolean {
    // Límites aproximados de Colombia
    const minLat = -4.227;
    const maxLat = 12.461;
    const minLng = -77.802;
    const maxLng = -66.871;

    return latitude >= minLat && latitude <= maxLat && longitude >= minLng && longitude <= maxLng;
  }
}
