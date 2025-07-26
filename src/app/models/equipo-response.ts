/**
 * Respuesta del backend para datos básicos de equipos
 * Basado en el DTO EquipoResponse del backend WatcherBackend
 */
export interface IEquipoResponse {
    /** Identificador único del equipo */
    idEquipo: number;
    
    /** Nombre del equipo */
    nombre: string;
    
    /** Categoría del equipo */
    categoria: string;
    
    /** Cantidad disponible del equipo */
    cantidad: number | null;
    
    /** Descripción del equipo */
    descripcion: string;
    
    /** Marca del equipo */
    marca: string;
    
    /** Estado actual del equipo (disponible, en-uso, en-mantenimiento) */
    estado: string;
}