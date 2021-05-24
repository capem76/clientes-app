import { Region } from "src/app/clientes/region";

export interface Cliente {
    
    id: number;
    nombre: string;
    apellido: string;
    createAt: string;
    email: string;
    foto: string;
    region: Region;
}


