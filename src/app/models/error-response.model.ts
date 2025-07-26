/**
 * Modelo para las respuestas de error del backend
 * Basado en ErrorResponse del backend WatcherBackend
 */
export interface IErrorResponse {
  /** Mensaje de error devuelto por el backend */
  message: string;
}