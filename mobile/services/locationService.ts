import api from "./api";

export interface Department {
  departmentId: string;
  name: string;
}

export interface City {
  cityId: string;
  name: string;
  departmentId: string;
}

export const locationService = {
  getDepartments: async (): Promise<Department[]> => {
    const response = await api.get<Department[]>("/departments");
    return response.data.map((dept) => ({
      departmentId: (dept as any).departmentID || dept.departmentId,
      name: dept.name,
    }));
  },
  getCitiesByDepartment: async (departmentId: string): Promise<City[]> => {
    const response = await api.get<City[]>(
      `/cities/department/${departmentId}`
    );
    return response.data.map((city) => ({
      cityId: (city as any).cityID || city.cityId,
      name: city.name,
      departmentId: (city as any).departmentID || city.departmentId,
    }));
  },
};
