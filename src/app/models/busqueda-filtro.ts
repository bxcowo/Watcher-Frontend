import { ICriterioFiltro } from "./criterio-filtro";

/**
 * Modelo para los filtros de búsqueda de equipos
 * Utilizado para filtrar la tabla de instrumentos
 */
export interface IBusquedaFiltro {
    /** Término de búsqueda general */
    terminoBusqueda: string;
    
    /** Filtros específicos para equipos */
    filtros: ICriterioFiltro;
}