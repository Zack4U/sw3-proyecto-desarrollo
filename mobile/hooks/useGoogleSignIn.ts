import { useState, useEffect } from "react";
import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";

export interface GoogleUser {
  email: string;
  name?: string;
  picture?: string;
  id: string;
  idToken?: string; // Google ID token (JWT)
  accessToken?: string;
}

/**
 * Hook para manejar Google Sign-In con @react-native-google-signin/google-signin
 * Retorna la información del usuario si fue autenticado exitosamente
 */
export const useGoogleSignIn = () => {
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar GoogleSignin al montar el componente
  useEffect(() => {
    const initGoogleSignIn = async () => {
      try {
        await GoogleSignin.hasPlayServices();

        GoogleSignin.configure({
          webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
          iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
          offlineAccess: true,
          profileImageSize: 120,
          scopes: ["profile", "email"],
        });
      } catch (err) {
        if (isErrorWithCode(err)) {
          if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            setError("Google Play Services no disponibles");
          } else {
            setError("Error inicializando Google Sign-In");
          }
        }
        console.error("GoogleSignIn initialization error:", err);
      }
    };

    initGoogleSignIn();
  }, []);

  const signIn = async () => {
    try {
      setError(null);
      setIsLoading(true);

      await GoogleSignin.hasPlayServices();

      // Forzar selector de cuenta: si ya hay sesión previa, cerrar sesión primero
      const hasPrev = (GoogleSignin as any).hasPreviousSignIn
        ? (GoogleSignin as any).hasPreviousSignIn()
        : false;
      if (hasPrev) {
        await GoogleSignin.signOut();
      }

      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { idToken, user } = response.data;
        const { name, email, photo } = user;
        setGoogleUser({
          id: user.id,
          name: name || undefined,
          email,
          picture: photo || undefined,
          idToken: idToken || undefined,
        });
      }
    } catch (err) {
      if (isErrorWithCode(err)) {
        if (err.code === statusCodes.SIGN_IN_CANCELLED) {
          setError("Inicio de sesión cancelado");
        } else if (err.code === statusCodes.IN_PROGRESS) {
          setError("Inicio de sesión en progreso");
        } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          setError("Google Play Services no disponibles");
        } else {
          setError("Error al iniciar sesión con Google");
        }
      } else {
        setError("Error desconocido al iniciar sesión");
      }
      console.error("Google sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await GoogleSignin.signOut();
      setGoogleUser(null);
      setError(null);
    } catch (err) {
      setError("Error al cerrar sesión");
      console.error("Google sign out error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setGoogleUser(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    googleUser,
    isLoading,
    error,
    signIn,
    signOut,
    resetState,
  };
};
