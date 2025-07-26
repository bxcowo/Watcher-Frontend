/**
 * Constantes para estados de equipos
 * Centraliza las definiciones de estados para mantener consistencia
 */

interface EstadoConfig {
  readonly valor: string;
  readonly etiqueta: string;
  readonly clase: string;
  readonly variaciones: readonly string[];
}

/** Configuración completa de estados */
const ESTADOS_CONFIG: readonly EstadoConfig[] = [
  {
    valor: 'DISPONIBLE',
    etiqueta: 'Disponible',
    clase: 'status-available',
    variaciones: ['disponible', 'available']
  },
  {
    valor: 'EN USO',
    etiqueta: 'En uso',
    clase: 'status-in-use',
    variaciones: ['en-uso', 'en uso', 'enuso', 'en_uso']
  }
] as const;

/** Estados disponibles para usar en el código */
export const ESTADOS = Object.fromEntries(
  ESTADOS_CONFIG.map(estado => [estado.valor, estado.valor])
) as Record<string, string>;

/** Configuración de estados para dropdowns y UI */
export const CONFIGURACION_ESTADOS = ESTADOS_CONFIG.map(({ valor, etiqueta, clase }) => ({
  valor,
  etiqueta,
  clase
}));

/** Mapa de variaciones para normalización rápida */
const VARIACIONES_MAP = new Map(
  ESTADOS_CONFIG.flatMap(estado => 
    estado.variaciones.map(variacion => [variacion.toLowerCase(), estado.valor])
  )
);

/**
 * Normaliza un estado del backend a un estado estándar
 * @param estado Estado del backend (puede estar en cualquier formato/case)
 * @returns Estado normalizado o null si no se reconoce
 */
export function normalizarEstado(estado: string): string | null {
  return VARIACIONES_MAP.get(estado.toLowerCase().trim()) || null;
}

/**
 * Obtiene la configuración de un estado
 * @param estado Estado a buscar
 * @returns Configuración del estado o null si no se encuentra
 */
export function obtenerConfiguracionEstado(estado: string) {
  const estadoNormalizado = normalizarEstado(estado);
  return CONFIGURACION_ESTADOS.find(config => config.valor === estadoNormalizado) || null;
}

/**
 * Obtiene la etiqueta de texto para mostrar de un estado
 * @param estado Estado del equipo
 * @returns Texto legible del estado
 */
export function obtenerEtiquetaEstado(estado: string): string {
  const config = obtenerConfiguracionEstado(estado);
  return config?.etiqueta || estado.charAt(0).toUpperCase() + estado.slice(1);
}

/**
 * Obtiene la clase CSS para un estado
 * @param estado Estado del equipo
 * @returns Nombre de la clase CSS
 */
export function obtenerClaseEstado(estado: string): string {
  const config = obtenerConfiguracionEstado(estado);
  return config?.clase || 'status-unknown';
}

/**
 * Convierte un estado UI a formato backend
 * @param estadoUI Estado seleccionado en la UI
 * @returns Estado en formato para el backend
 */
export function convertirEstadoParaBackend(estadoUI: string): string {
  return estadoUI; // Ya está en formato correcto (DISPONIBLE, EN_USO)
}