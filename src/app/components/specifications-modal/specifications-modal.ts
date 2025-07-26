import { Component, input, output, signal, computed, inject, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IEquipoResponse } from '../../models/equipo-response';
import { EspecificacionEquipo } from '../../models/especificaciones.model';
import { EquipoOps } from '../../services/equipo-ops';
import { obtenerClaseEstado, obtenerEtiquetaEstado } from '../../utils/estado.constants';

/**
 * Componente modal para mostrar especificaciones técnicas de equipos
 * Carga y muestra información detallada del equipo seleccionado
 */
@Component({
  selector: 'app-specifications-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './specifications-modal.html',
  styleUrl: './specifications-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpecificationsModal {
  /** Servicio para operaciones con equipos */
  private readonly equipoService = inject(EquipoOps);
  
  /** Estado de visibilidad del modal */
  readonly esVisible = input<boolean>(false);
  
  /** Equipo seleccionado para mostrar especificaciones */
  readonly equipoSeleccionado = input<IEquipoResponse | null>(null);
  
  /** Evento emitido al cerrar el modal */
  readonly modalClose = output<void>();
  
  /** Especificaciones técnicas del equipo */
  readonly especificaciones = signal<EspecificacionEquipo | null>(null);
  
  /** Estado de carga de especificaciones */
  readonly cargandoEspecificaciones = signal<boolean>(false);
  
  /** Mensaje de error al cargar especificaciones */
  readonly errorEspecificaciones = signal<string | null>(null);

  /** Información básica del equipo mostrada solo en la cabecera */
  readonly informacionCabecera = computed(() => {
    const equipo = this.equipoSeleccionado();
    if (!equipo) return [];
    
    return [
      { campo: 'Categoría', valor: equipo.categoria },
      { campo: 'Marca', valor: equipo.marca },
      { 
        campo: 'Estado', 
        valor: this.obtenerEtiquetaEstado(equipo.estado),
        esEstado: true 
      },
      { campo: 'Cantidad Disponible', valor: equipo.cantidad ?? 'Limitado' }
    ];
  });

  constructor() {
    // Efecto para cargar automáticamente las especificaciones cuando cambia el equipo
    effect(() => {
      const esVisible = this.esVisible();
      const equipo = this.equipoSeleccionado();
      
      // Cargar especificaciones automáticamente cuando se abre el modal con un equipo
      if (esVisible && equipo && !this.especificaciones() && !this.cargandoEspecificaciones()) {
        this.cargarEspecificaciones();
      }
    });
  }

  /**
   * Cierra el modal y limpia los datos
   */
  cerrarModal(): void {
    this.modalClose.emit();
    this.limpiarDatos();
  }

  /**
   * Carga las especificaciones técnicas del equipo
   */
  cargarEspecificaciones(): void {
    const equipo = this.equipoSeleccionado();
    if (!equipo) return;

    this.cargandoEspecificaciones.set(true);
    this.errorEspecificaciones.set(null);

    this.equipoService.obtenerEspecificacionesEquipo(equipo.idEquipo).subscribe({
      next: (especificaciones) => {
        this.especificaciones.set(especificaciones);
        this.cargandoEspecificaciones.set(false);
      },
      error: (error) => {
        this.errorEspecificaciones.set(error.message);
        this.cargandoEspecificaciones.set(false);
        console.error('Error al cargar especificaciones:', error);
      }
    });
  }

  /**
   * Obtiene la clase CSS para el estado del equipo
   * @param estado Estado del equipo (puede estar en UPPERCASE desde el backend)
   * @returns Nombre de la clase CSS correspondiente
   */
  obtenerClaseEstado(estado: string): string {
    return obtenerClaseEstado(estado);
  }

  /**
   * Obtiene la etiqueta de texto para el estado del equipo
   * @param estado Estado del equipo (puede estar en UPPERCASE desde el backend)
   * @returns Texto legible del estado
   */
  obtenerEtiquetaEstado(estado: string): string {
    return obtenerEtiquetaEstado(estado);
  }

  /**
   * Formatea las especificaciones técnicas para mostrar
   * @returns Array de pares campo-valor para mostrar en la interfaz
   */
  obtenerEspecificacionesFormateadas(): { campo: string, valor: string | number, esEnlace?: boolean }[] {
    const specs = this.especificaciones();
    if (!specs) return [];

    // Detectar tipo de especificación basado en propiedades disponibles
    if ('modelo' in specs && 'referencia' in specs) {
      // Especificaciones básicas (Mecánica, Eléctrica, Electrónica)
      return [
        { campo: 'Modelo', valor: specs.modelo },
        { 
          campo: 'Referencia', 
          valor: specs.referencia,
          esEnlace: this.esURL(specs.referencia)
        }
      ];
    }

    if ('areaDeTrabajo' in specs) {
      // Especificaciones CNC
      return [
        { campo: 'Área de Trabajo', valor: specs.areaDeTrabajo },
        { campo: 'Material de Grabado', valor: specs.materialDeGrabado },
        { campo: 'Velocidad Máx. de Corte', valor: `${specs.velocidadMaxCorte} mm/min` }
      ];
    }

    if ('volumenDeImpresion' in specs) {
      // Especificaciones Impresora 3D
      return [
        { campo: 'Volumen de Impresión', valor: specs.volumenDeImpresion },
        { campo: 'Material de Impresión', valor: specs.materialDeImpresion },
        { campo: 'Velocidad Máx. de Impresión', valor: `${specs.velocidadMaxImpresion} mm/s` }
      ];
    }

    if ('cpu' in specs) {
      // Especificaciones Software/Computadora
      return [
        { campo: 'CPU', valor: specs.cpu },
        { campo: 'GPU', valor: specs.gpu },
        { campo: 'RAM', valor: `${specs.ramGb} GB` }
      ];
    }

    return [];
  }

  /**
   * Verifica si un valor es una URL válida
   * @param valor Valor a verificar
   * @returns true si es una URL válida
   */
  private esURL(valor: string): boolean {
    try {
      new URL(valor);
      return true;
    } catch {
      // Si no es una URL completa, verificar si es un dominio válido
      const dominioRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
      return dominioRegex.test(valor) || valor.includes('www.') || valor.includes('http');
    }
  }

  /**
   * Abre un enlace externo en una nueva pestaña
   * @param enlace URL o referencia a abrir
   */
  abrirEnlace(enlace: string): void {
    let url = enlace;
    
    // Si no empieza con protocolo, añadir https://
    if (!enlace.startsWith('http://') && !enlace.startsWith('https://')) {
      url = `https://${enlace}`;
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Limpia los datos del modal
   */
  private limpiarDatos(): void {
    this.especificaciones.set(null);
    this.errorEspecificaciones.set(null);
    this.cargandoEspecificaciones.set(false);
  }
}
