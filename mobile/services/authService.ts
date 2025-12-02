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
   * Registro básico con email y password
   */
  async registerBasic(data: {
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/register", {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
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
        token: data.token, // Required by backend DTO
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
   * Solicitar recuperación de contraseña (envía email con link de reseteo)
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>("/auth/forgot-password", {
        email,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Resetear contraseña usando token recibido por email
   */
  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword?: string
  ) {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
        confirmPassword,
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
    // Loguear información completa para debugging
    console.error('Error de respuesta (raw):', error?.response);

    const respData = error?.response?.data;

    // Si el backend envía un objeto con message y statusCode, construir un mensaje más informativo
    if (respData && (respData.message || respData.statusCode)) {
      let msg = respData.message || `Error en la solicitud (${error.response.status})`;
      if (respData.statusCode) {
        msg = `${msg} (code=${respData.statusCode})`;
      }
      // Incluir detalles adicionales si existen (p. ej. validation errors)
      if (respData.errors || respData.details) {
        try {
          const details = respData.errors || respData.details;
          msg = `${msg} - ${JSON.stringify(details)}`;
        } catch (error_) {
          // ignore stringify errors
        }
      }
      return new Error(msg);
    }

    if (error?.response?.status) {
      switch (error.response.status) {
        case 400:
          return new Error('Datos inválidos. Verifica la información ingresada.');
        case 401:
          return new Error('Credenciales inválidas');
        case 409:
          return new Error('El usuario ya existe');
        case 500:
          return new Error('Error interno del servidor. Intenta más tarde.');
        default:
          return new Error(`Error en la solicitud (${error.response.status})`);
      }
    }

    if (error?.message) {
      return new Error(error.message);
    }

    return new Error('Error desconocido en la autenticación');
  }
}

export default new AuthService();
