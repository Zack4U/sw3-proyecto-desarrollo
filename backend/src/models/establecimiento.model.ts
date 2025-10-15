import { UUID } from "crypto";

export class Establecimiento {
    establecimiento_id: string;
    direccion: string;
    tipo: string;
    ubicacion: string;
    fecha_registro: Date;
    user_id: string;
}