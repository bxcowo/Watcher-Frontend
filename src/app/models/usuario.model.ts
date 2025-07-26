/**
 * Modelo para el usuario del sistema de monitorización
 * Basado en la entidad Usuario del backend WatcherBackend
 */
export interface IUsuario {
  /** Identificador único del usuario */
  idUsuario: number;
  
  /** Nombres del usuario */
  nombres: string;
  
  /** Apellidos del usuario */
  apellidos: string;
  
  /** Facultad a la que pertenece el usuario */
  facultad: string;
  
  /** Correo electrónico del usuario (usado para autenticación) */
  correo: string;
  
  /** Contraseña del usuario */
  password?: string; // Opcional para evitar exponerla en el frontend
}

/**
 * Respuesta del backend para datos de usuario
 * DTO simplificado que no incluye información sensible
 */
export interface IUsuarioResponse {
  /** Identificador único del usuario */
  idUsuario: number;
  
  /** Correo electrónico del usuario */
  correo: string;
  
  /** Nombres del usuario */
  nombres: string;
  
  /** Apellidos del usuario */
  apellidos: string;
}

/**
 * Datos de autenticación para login
 */
export interface ILoginCredentials {
  /** Correo electrónico del usuario */
  correo: string;
  
  /** Contraseña del usuario */
  password: string;
}