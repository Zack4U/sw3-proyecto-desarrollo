import api from './api';

export interface Department {
    departmentID: string;
    name: string;
}

export interface City {
    cityID: string;
    name: string;
    departmentID: string;
}

export const locationService = {
    getDepartments: async (): Promise<Department[]> => {
        const response = await api.get<Department[]>('/departments');
        return response.data;
    },
    getCitiesByDepartment: async (departmentID: string): Promise<City[]> => {
        const response = await api.get<City[]>(`/departments/${departmentID}/cities`);
        return response.data;
    },
};
