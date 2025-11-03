import api from "./api";

export interface UserProfile {
  userId: string;
  email: string;
  username: string;
  phone: string | null;
  picture: string | null;
  documentNumber: string | null;
  documentType: string | null;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EstablishmentProfile {
  establishmentId: string;
  userId: string;
  name: string;
  description: string | null;
  address: string;
  neighborhood: string | null;
  establishmentType: string;
  cityId: string | null;
  location: {
    type: "Point";
    coordinates: [number, number];
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateEstablishmentProfileData {
  email?: string;
  phone?: string;
  username?: string;
  documentNumber?: string;
  name?: string;
  description?: string;
  address?: string;
  neighborhood?: string;
  establishmentType?: string;
  cityId?: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
}

const profileService = {
  async getUserProfile(): Promise<{
    user: UserProfile;
    establishment?: EstablishmentProfile;
  }> {
    try {
      const response = await api.get("/users/profile");
      console.log(
        "📱 profileService.getUserProfile() - Response:",
        response.data
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error loading profile";
      console.error("❌ profileService.getUserProfile() - Error:", message);
      throw new Error(message);
    }
  },

  async updateEstablishmentProfile(data: UpdateEstablishmentProfileData) {
    try {
      const response = await api.put("/users/establishment/profile", data);
      return response.data;
    } catch (error: any) {
      let message = "Error updating profile";

      if (error.response?.status === 400) {
        message = error.response.data?.message || "Invalid data";
      } else if (error.response?.status === 401) {
        message = "Session expired";
      } else if (error.response?.status === 403) {
        message = "Permission denied";
      } else if (error.response?.status === 404) {
        message = "Not found";
      } else if (error.response?.status === 409) {
        message = error.response.data?.message || "Conflict with existing data";
      } else if (!error.response) {
        message = "Network error";
      }

      throw new Error(message);
    }
  },

  async updateUserProfile(data: Partial<UserProfile>) {
    try {
      const response = await api.put("/users/profile", data);
      return response.data;
    } catch (error: any) {
      let message = "Error updating profile";

      if (error.response?.status === 400) {
        message = error.response.data?.message || "Invalid data";
      } else if (error.response?.status === 401) {
        message = "Session expired";
      } else if (error.response?.status === 409) {
        message = error.response.data?.message || "Conflict with existing data";
      } else if (!error.response) {
        message = "Network error";
      }

      throw new Error(message);
    }
  },
};

export { profileService };
