/**
 * Tipos y interfaces para la autenticación
 */

export type UserRole = "BENEFICIARY" | "ESTABLISHMENT";

export interface User {
  userId: string;
  email: string;
  username?: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  picture?: string;
  documentNumber?: string;
  establishmentId?: string; // ID del establecimiento si el usuario es ESTABLISHMENT
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  email: string;
  establishmentId?: string; // ID del establecimiento si el usuario es ESTABLISHMENT
}

export interface LoginCredentials {
  identifier: string; // username, email o documentNumber
  password: string;
}

export interface RegisterBeneficiaryData {
  email: string;
  username?: string;
  documentNumber?: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterEstablishmentData {
  email: string;
  establishmentName: string;
  documentNumber?: string;
  password: string;
  confirmPassword: string;
}

export interface GoogleAuthData {
  token: string; // Google ID token (JWT)
  email: string;
  name?: string;
  picture?: string;
  googleId?: string;
}

export interface CompleteProfileDataBeneficiary {
  role: "BENEFICIARY";
  googleId?: string;
  username?: string;
  name: string;
  lastName: string;
  phone?: string;
  documentType?: string;
  documentNumber?: string;
}

export interface CompleteProfileDataEstablishment {
  role: "ESTABLISHMENT";
  googleId?: string;
  username?: string;
  name: string;
  phone?: string;
  documentNumber?: string;
  address: string;
  neighborhood?: string;
  cityId: string;
  description?: string;
  establishmentType?: string;
}

export type CompleteProfileData =
  | CompleteProfileDataBeneficiary
  | CompleteProfileDataEstablishment;

export interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresAt: number; // timestamp en ms cuando expira el access token
  refreshExpiresAt: number; // timestamp en ms cuando expira el refresh token
}

export interface ValidateTokenResponse {
  valid: boolean;
  user?: User;
  expiresIn?: number;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitializing: boolean;
  accessToken: string | null;
  error: string | null;

  // Métodos
  login: (credentials: LoginCredentials) => Promise<void>;
  registerBasic: (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  registerBeneficiary: (data: RegisterBeneficiaryData) => Promise<void>;
  registerEstablishment: (data: RegisterEstablishmentData) => Promise<void>;
  loginWithGoogle: (data: GoogleAuthData) => Promise<void>;
  completeGoogleProfile: (data: CompleteProfileData) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  validateStoredSession: () => Promise<boolean>;
  clearError: () => void;
}
