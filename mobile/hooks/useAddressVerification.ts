import { useState, useCallback } from "react";
import {
  addressVerificationService,
  GeocodeResult,
  LocationResult,
} from "../services/addressVerificationService";

interface UseAddressVerificationState {
  loading: boolean;
  error: string | null;
  result: GeocodeResult | LocationResult | null;
}

interface UseAddressVerificationReturn extends UseAddressVerificationState {
  verifyAddress: (
    address: string,
    city?: string,
    department?: string
  ) => Promise<void>;
  verifyCoordinates: (
    latitude: number,
    longitude: number,
    address?: string
  ) => Promise<void>;
  getCurrentLocation: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useAddressVerification = (): UseAddressVerificationReturn => {
  const [state, setState] = useState<UseAddressVerificationState>({
    loading: false,
    error: null,
    result: null,
  });

  const verifyAddress = useCallback(
    async (address: string, city?: string, department?: string) => {
      setState({ loading: true, error: null, result: null });
      try {
        const result = await addressVerificationService.verifyAddress(
          address,
          city,
          department
        );
        setState({ loading: false, error: null, result });
      } catch (error: any) {
        setState({
          loading: false,
          error: error.message || "Error verifying address",
          result: null,
        });
      }
    },
    []
  );

  const verifyCoordinates = useCallback(
    async (latitude: number, longitude: number, address?: string) => {
      setState({ loading: true, error: null, result: null });
      try {
        const result = await addressVerificationService.verifyCoordinates(
          latitude,
          longitude,
          address
        );
        setState({ loading: false, error: null, result });
      } catch (error: any) {
        setState({
          loading: false,
          error: error.message || "Error verifying coordinates",
          result: null,
        });
      }
    },
    []
  );

  const getCurrentLocation = useCallback(async () => {
    setState({ loading: true, error: null, result: null });
    try {
      const location = await addressVerificationService.getCurrentLocation();
      if (location) {
        // Obtener la dirección desde las coordenadas
        const reverseGeocode =
          await addressVerificationService.reverseGeocodeLocal(
            location.latitude,
            location.longitude
          );

        const result: LocationResult = {
          latitude: location.latitude,
          longitude: location.longitude,
          formattedAddress: reverseGeocode
            ? `${reverseGeocode.street || ""} ${
                reverseGeocode.streetNumber || ""
              }, ${reverseGeocode.city || ""}`
            : "Address not found",
          location: {
            type: "Point",
            coordinates: [location.longitude, location.latitude],
          },
        };

        setState({ loading: false, error: null, result });
      } else {
        setState({
          loading: false,
          error: "Unable to get current location",
          result: null,
        });
      }
    } catch (error: any) {
      setState({
        loading: false,
        error: error.message || "Error getting current location",
        result: null,
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, result: null });
  }, []);

  return {
    ...state,
    verifyAddress,
    verifyCoordinates,
    getCurrentLocation,
    clearError,
    reset,
  };
};
