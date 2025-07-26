/**
 * Criterios específicos de filtrado para equipos
 * Utilizado dentro de IBusquedaFiltro
 */
export interface ICriterioFiltro {
    /** Estado del equipo (disponible, en-uso, en-mantenimiento) */
    estado?: string;
    
    /** Marca del equipo */
    marca?: string;
    
    /** Categoría del equipo */
    categoria?: string;
}