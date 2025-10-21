import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import {
  AuthContextType,
  User,
  LoginCredentials,
  RegisterBeneficiaryData,
  RegisterEstablishmentData,
  GoogleAuthData,
  CompleteProfileData,
  StoredAuth,
} from "../types/auth.types";
import authService from "../services/authService";
import api, { setRefreshFailedCallback } from "../services/api";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isInitializing: boolean;
};

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | {
      type: "LOGIN_SUCCESS";
      payload: {
        user: User;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      };
    }
  | { type: "LOGOUT" }
  | { type: "RESTORE_SESSION"; payload: { user: User; accessToken: string } }
  | { type: "RESTORE_SESSION_FAILED" }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_INITIALIZING"; payload: boolean };

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  isInitializing: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "RESTORE_SESSION":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        isAuthenticated: true,
        isInitializing: false,
      };
    case "RESTORE_SESSION_FAILED":
      return {
        ...state,
        isInitializing: false,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "SET_INITIALIZING":
      return { ...state, isInitializing: action.payload };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Guardar tokens en almacenamiento seguro
   */
  const saveTokens = useCallback(
    async (accessToken: string, refreshToken: string, expiresIn: number) => {
      try {
        const expiresAt = Date.now() + expiresIn * 1000;
        await SecureStore.setItemAsync("accessToken", accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken);
        await SecureStore.setItemAsync("expiresAt", expiresAt.toString());
      } catch (error) {
        console.error("Error guardando tokens:", error);
      }
    },
    []
  );

  /**
   * Guardar información del usuario
   */
  const saveUser = useCallback(async (user: User) => {
    try {
      await SecureStore.setItemAsync("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error guardando usuario:", error);
    }
  }, []);

  /**
   * Obtener información almacenada
   */
  const getStoredAuth = useCallback(async (): Promise<StoredAuth | null> => {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      const userStr = await SecureStore.getItemAsync("user");
      const expiresAt = await SecureStore.getItemAsync("expiresAt");

      if (!accessToken || !refreshToken || !userStr) {
        return null;
      }

      return {
        accessToken,
        refreshToken,
        user: JSON.parse(userStr),
        expiresAt: parseInt(expiresAt || "0"),
        refreshExpiresAt: 0, // TODO: calcular si es necesario
      };
    } catch (error) {
      console.error("Error obteniendo auth almacenado:", error);
      return null;
    }
  }, []);

  /**
   * Limpiar tokens del almacenamiento
   */
  const clearTokens = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("expiresAt");
      await SecureStore.deleteItemAsync("user");
    } catch (error) {
      console.error("Error limpiando tokens:", error);
    }
  }, []);

  /**
   * Validar si el token no ha expirado
   */
  const isTokenValid = useCallback((expiresAt: number): boolean => {
    // Si expira en menos de 5 minutos, consideramos que necesita refresh
    const refreshThreshold = 5 * 60 * 1000; // 5 minutos
    return Date.now() + refreshThreshold < expiresAt;
  }, []);

  /**
   * Refrescar tokens
   */
  const refreshTokens = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");

      if (!refreshToken) {
        return false;
      }

      const response = await authService.refreshToken(refreshToken);
      await saveTokens(
        response.accessToken,
        response.refreshToken,
        response.expiresIn
      );

      dispatch({
        type: "RESTORE_SESSION",
        payload: {
          user: {
            userId: response.userId,
            email: response.email,
            role: "BENEFICIARY", // TODO: obtener del servicio
            isActive: true,
            isVerified: true,
          },
          accessToken: response.accessToken,
        },
      });

      return true;
    } catch (error) {
      console.error("Error refrescando tokens:", error);
      return false;
    }
  }, [saveTokens]);

  /**
   * Validar sesión almacenada al iniciar la app
   */
  const validateStoredSession = useCallback(async (): Promise<boolean> => {
    try {
      dispatch({ type: "SET_INITIALIZING", payload: true });
      const storedAuth = await getStoredAuth();

      if (!storedAuth) {
        dispatch({ type: "RESTORE_SESSION_FAILED" });
        return false;
      }

      // Verificar si el token necesita refresh
      if (!isTokenValid(storedAuth.expiresAt)) {
        const refreshSuccess = await refreshTokens();
        if (!refreshSuccess) {
          await clearTokens();
          dispatch({ type: "RESTORE_SESSION_FAILED" });
          return false;
        }
        return true;
      }

      // Token válido, restaurar sesión
      dispatch({
        type: "RESTORE_SESSION",
        payload: {
          user: storedAuth.user,
          accessToken: storedAuth.accessToken,
        },
      });

      return true;
    } catch (error) {
      console.error("Error validando sesión:", error);
      dispatch({ type: "RESTORE_SESSION_FAILED" });
      return false;
    }
  }, [getStoredAuth, isTokenValid, refreshTokens, clearTokens]);

  /**
   * Login
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await authService.login(credentials);

        // Guardar tokens y usuario
        await saveTokens(
          response.accessToken,
          response.refreshToken,
          response.expiresIn
        );
        const user: User = {
          userId: response.userId,
          email: response.email,
          role: "BENEFICIARY", // Obtener del backend si es posible
          isActive: true,
          isVerified: true,
        };
        await saveUser(user);

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiresIn: response.expiresIn,
          },
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error al iniciar sesión";
        dispatch({ type: "SET_ERROR", payload: message });
        throw error;
      }
    },
    [saveTokens, saveUser]
  );

  /**
   * Registrar beneficiario
   */
  const registerBeneficiary = useCallback(
    async (data: RegisterBeneficiaryData) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await authService.registerBeneficiary(data);

        // Guardar tokens y usuario
        await saveTokens(
          response.accessToken,
          response.refreshToken,
          response.expiresIn
        );
        const user: User = {
          userId: response.userId,
          email: response.email,
          username: data.username,
          role: "BENEFICIARY",
          isActive: true,
          isVerified: true,
        };
        await saveUser(user);

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiresIn: response.expiresIn,
          },
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Error al registrar beneficiario";
        dispatch({ type: "SET_ERROR", payload: message });
        throw error;
      }
    },
    [saveTokens, saveUser]
  );

  /**
   * Registrar establecimiento
   */
  const registerEstablishment = useCallback(
    async (data: RegisterEstablishmentData) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await authService.registerEstablishment(data);

        // Guardar tokens y usuario
        await saveTokens(
          response.accessToken,
          response.refreshToken,
          response.expiresIn
        );
        const user: User = {
          userId: response.userId,
          email: response.email,
          username: data.establishmentName,
          role: "ESTABLISHMENT",
          isActive: true,
          isVerified: true,
        };
        await saveUser(user);

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiresIn: response.expiresIn,
          },
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Error al registrar establecimiento";
        dispatch({ type: "SET_ERROR", payload: message });
        throw error;
      }
    },
    [saveTokens, saveUser]
  );

  /**
   * Login con Google - flujo común sin especificar tipo
   */
  const loginWithGoogle = useCallback(
    async (data: GoogleAuthData) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await authService.loginWithGoogle(data);

        // Guardar tokens
        await saveTokens(
          response.accessToken,
          response.refreshToken,
          response.expiresIn
        );

        // Usar el isActive que retorna el backend
        // Si isActive = false, necesita completar perfil
        // Si isActive = true, puede acceder directamente
        const decodedToken: any = jwtDecode(response.accessToken);
        const user: User = {
          userId: response.userId,
          email: response.email,
          username: decodedToken.username || data.name,
          picture: data.picture,
          role: decodedToken.role || "BENEFICIARY",
          isActive: decodedToken.isActive ?? false, // Usar el estado del backend
          isVerified: true,
        };

        await saveUser(user);

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiresIn: response.expiresIn,
          },
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Error al iniciar sesión con Google";
        dispatch({ type: "SET_ERROR", payload: message });
        throw error;
      }
    },
    [saveTokens, saveUser]
  );

  /**
   * Completar perfil del usuario después de Google login
   */
  const completeGoogleProfile = useCallback(
    async (data: CompleteProfileData) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await authService.completeGoogleProfile(data);

        // Actualizar tokens y usuario
        await saveTokens(
          response.accessToken,
          response.refreshToken,
          response.expiresIn
        );
        const user: User = {
          userId: response.userId,
          email: response.email,
          username: data.username || data.name,
          role: data.role,
          isActive: true, // Ahora está activo
          isVerified: true,
        };
        await saveUser(user);

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiresIn: response.expiresIn,
          },
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error al completar perfil";
        dispatch({ type: "SET_ERROR", payload: message });
        throw error;
      }
    },
    [saveTokens, saveUser]
  );

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      // Obtener el token ANTES de limpiar
      const accessToken = await SecureStore.getItemAsync("accessToken");

      if (accessToken) {
        // Notificar al backend CON el token
        try {
          await authService.logout();
        } catch (err) {
          // Ignorar errores al notificar al servidor
          console.debug("Error al notificar logout al servidor:", err);
        }
      }

      // Limpiar almacenamiento local al final
      await clearTokens();

      // Despachar logout completado
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Error al logout local:", error);
      // Aún así, logout localmente
      await clearTokens();
      dispatch({ type: "LOGOUT" });
    }
  }, [clearTokens]);

  /**
   * Limpiar errores
   */
  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  /**
   * Configurar callback para cuando el refresh falle
   * IMPORTANTE: Se configura UNA SOLA VEZ para evitar loops
   */
  useEffect(() => {
    const refreshFailedHandler = () => {
      // Limpiar tokens y desautenticar SIN llamar a logout()
      // para evitar loop infinito
      clearTokens().then(() => {
        dispatch({ type: "LOGOUT" });
      });
    };

    setRefreshFailedCallback(refreshFailedHandler);
  }, [clearTokens]);

  /**
   * Validar sesión al iniciar la app
   */
  useEffect(() => {
    validateStoredSession();
  }, [validateStoredSession]);

  const value: AuthContextType = {
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    isInitializing: state.isInitializing,
    accessToken: state.accessToken,
    error: state.error,
    login,
    registerBeneficiary,
    registerEstablishment,
    loginWithGoogle,
    completeGoogleProfile,
    logout,
    refreshTokens,
    validateStoredSession,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
