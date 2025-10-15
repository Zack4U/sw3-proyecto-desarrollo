import { Food } from "./food.model";

export class Establishment {
    establishment_id: string;
    address: string;
    type: string;
    location: string;
    registration_date: Date;
    user_id: string;
    foods: Food[];
}