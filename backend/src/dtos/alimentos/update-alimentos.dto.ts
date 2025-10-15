export class UpdateAlimentoDto {
    readonly nombre?: string;
    readonly categoria?: string
    readonly cantidad?: number;
    readonly unidad_peso?: string
    readonly fecha_caducidad?: Date;
    readonly estado?: string;
    readonly descripcion?: string;
    readonly establecimiento_id?: string;
    readonly imagen?: string; // URL o nombre de archivo de la imagen
}

