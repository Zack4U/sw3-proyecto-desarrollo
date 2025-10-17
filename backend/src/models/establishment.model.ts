import { Food } from "./food.model";

export class Establishment {
    establishmentId: string;
    name
    description
    phone
    email
    address
    location
    establismentType
    createdAt: Date;
    updatedAt: Date;

    // Relations
    foods?: Food[];

    //TBD
    userId: string;
}