export class Food {
    foodId: string;
    name: string;
    description: string;
    category: string;
    quantity: number;
    weightOfUnit: string;
    status: string;
    imageUrl: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;

    // Relations
    establishmentId: string;
}