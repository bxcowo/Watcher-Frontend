/**
 * Modelo para las categorías de equipos
 * Basado en la entidad Categoria del backend WatcherBackend
 */
export interface ICategoria {
  /** Identificador único de la categoría */
  idCategoria: number;
  
  /** Nombre de la categoría */
  nombreCategoria: string;
}