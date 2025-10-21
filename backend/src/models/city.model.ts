import { Department } from './department.model';
import { Establishment } from './establishment.model';

export class City {
  cityId: string;
  name: string;
  departmentId: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  department?: Department;
  establishments?: Establishment[];
}
