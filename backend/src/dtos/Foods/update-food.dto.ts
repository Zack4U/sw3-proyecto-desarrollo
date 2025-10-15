export class UpdateFoodDto {
    readonly name?: string;
    readonly category?: string;
    readonly quantity?: number;
    readonly weight_unit?: string;
    readonly expiration_date?: Date;
    readonly status?: string;
    readonly description?: string;
    readonly establishment_id?: string;
    readonly image?: string; // URL o nombre de archivo de la imagen
}

