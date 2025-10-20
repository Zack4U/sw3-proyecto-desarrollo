import { City } from './city.model';

export class Department {
  departmentId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  cities?: City[];
}
