import api from "./api";
import {
  AuthResponse,
  LoginCredentials,
  RegisterBeneficiaryData,
  RegisterEstablishmentData,
  GoogleAuthData,
  CompleteProfileData,
} from "../types/auth.types";

class AuthService {
  /**
   * Login con credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", {
        identifier: credentials.identifier,
        password: credentials.password,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Registrar beneficiario
   */
  async registerBeneficiary(
    data: RegisterBeneficiaryData
  ): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        "/auth/beneficiary/register",
        {
          email: data.email,
          username: data.username,
          documentNumber: data.documentNumber,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Registrar establecimiento
   */
  async registerEstablishment(
    data: RegisterEstablishmentData
  ): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        "/auth/establishment/register",
        {
          email: data.email,
          establishmentName: data.establishmentName,
          documentNumber: data.documentNumber,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Login con Google (flujo común - sin especificar tipo de usuario)
   */
  async loginWithGoogle(data: GoogleAuthData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/google/login", {
        email: data.email,
        name: data.name,
        picture: data.picture,
        googleId: data.googleId,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Completar perfil del usuario después de Google login
   */
  async completeGoogleProfile(
    data: CompleteProfileData
  ): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        "/auth/profile/complete",
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Refrescar token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/refresh", {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile() {
    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout
   */
  async logout() {
    try {
      await api.post("/auth/logout");
    } catch (error: any) {
      // No lanzar error si es 401 (unauthorized) o 403 (forbidden)
      // Ya que el token puede haber expirado
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        console.debug("Token expirado o inválido en logout - es esperado");
        return;
      }
      // Para otros errores de red, también es opcional
      console.debug(
        "Error al hacer logout en el servidor (ignorado):",
        error?.message
      );
    }
  }

  /**
   * Validar token
   */
  async validateToken(token: string) {
    try {
      const response = await api.post("/auth/validate-token", { token });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(oldPassword: string, newPassword: string) {
    try {
      const response = await api.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Manejar errores
   */
  private handleError(error: any): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error("Error desconocido en la autenticación");
  }
}

export default new AuthService();
