/**
 * Modelos para las especificaciones técnicas de diferentes tipos de equipos
 * Basados en los DTOs del backend WatcherBackend
 */

/**
 * Especificaciones para equipos mecánicos
 */
export interface IMecanicaDTO {
  /** Modelo del equipo mecánico */
  modelo: string;
  
  /** Referencia del equipo mecánico */
  referencia: string;
}

/**
 * Especificaciones para equipos eléctricos
 */
export interface IElectricaDTO {
  /** Modelo del equipo eléctrico */
  modelo: string;
  
  /** Referencia del equipo eléctrico */
  referencia: string;
}

/**
 * Especificaciones para equipos electrónicos
 */
export interface IElectronicaDTO {
  /** Modelo del equipo electrónico */
  modelo: string;
  
  /** Referencia del equipo electrónico */
  referencia: string;
}

/**
 * Especificaciones para máquinas CNC
 */
export interface ICNCDTO {
  /** Área de trabajo de la máquina CNC */
  areaDeTrabajo: string;
  
  /** Material de grabado soportado */
  materialDeGrabado: string;
  
  /** Velocidad máxima de corte */
  velocidadMaxCorte: number;
}

/**
 * Especificaciones para impresoras 3D
 */
export interface IImpresora3DDTO {
  /** Volumen de impresión de la impresora 3D */
  volumenDeImpresion: string;
  
  /** Material de impresión soportado */
  materialDeImpresion: string;
  
  /** Velocidad máxima de impresión */
  velocidadMaxImpresion: number;
}

/**
 * Especificaciones para equipos de software/computadoras
 */
export interface ISoftwareDTO {
  /** Procesador del equipo */
  cpu: string;
  
  /** Tarjeta gráfica del equipo */
  gpu: string;
  
  /** Memoria RAM en GB */
  ramGb: number;
}

/**
 * Tipo unión para todas las especificaciones posibles
 */
export type EspecificacionEquipo = 
  | IMecanicaDTO 
  | IElectricaDTO 
  | IElectronicaDTO 
  | ICNCDTO 
  | IImpresora3DDTO 
  | ISoftwareDTO;