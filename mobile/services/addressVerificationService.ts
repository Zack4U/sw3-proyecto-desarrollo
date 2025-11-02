import api from "./api";
import * as Location from "expo-location";

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  placeId?: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface LocationResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  addressComponents?: any[];
  location: {
    type: "Point";
    coordinates: [number, number];
  };
}

export const addressVerificationService = {
  /**
   * Obtiene permisos de ubicación del dispositivo
   */
  requestLocationPermission: async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error requesting location permission:", error);
      return false;
    }
  },

  /**
   * Obtiene la ubicación actual del dispositivo
   */
  getCurrentLocation: async (): Promise<{
    latitude: number;
    longitude: number;
  } | null> => {
    try {
      const hasPermission =
        await addressVerificationService.requestLocationPermission();
      if (!hasPermission) {
        console.warn("Location permission not granted");
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error("Error getting current location:", error);
      return null;
    }
  },

  /**
   * Geocodifica una dirección (dirección -> coordenadas)
   * @param address - Dirección a geocodificar
   * @param city - Ciudad (opcional)
   * @param department - Departamento (opcional)
   */
  verifyAddress: async (
    address: string,
    city?: string,
    department?: string
  ): Promise<GeocodeResult> => {
    try {
      const response = await api.post<GeocodeResult>(
        "/geolocation/verify-address",
        {
          address,
          city,
          department,
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Error verifying address. Please check the address and try again."
      );
    }
  },

  /**
   * Reverse geocodifica coordenadas (coordenadas -> dirección)
   * @param latitude - Latitud
   * @param longitude - Longitud
   * @param address - Dirección (opcional, solo para referencia)
   */
  verifyCoordinates: async (
    latitude: number,
    longitude: number,
    address?: string
  ): Promise<LocationResult> => {
    try {
      const response = await api.post<LocationResult>(
        "/geolocation/verify-coordinates",
        {
          latitude,
          longitude,
          address,
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Error verifying coordinates. Please try again."
      );
    }
  },

  /**
   * Obtiene dirección desde coordenadas usando el dispositivo
   * (sin pasar por el servidor)
   */
  reverseGeocodeLocal: async (
    latitude: number,
    longitude: number
  ): Promise<Location.LocationGeocodedAddress | null> => {
    try {
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address.length > 0) {
        return address[0];
      }
      return null;
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      return null;
    }
  },
};
