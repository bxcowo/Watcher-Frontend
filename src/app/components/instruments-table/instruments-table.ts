import { Component, input, output, signal, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IEquipoResponse } from '../../models/equipo-response';
import { IBusquedaFiltro } from '../../models/busqueda-filtro';
import { IUsuarioResponse } from '../../models/usuario.model';
import { EquipoOps } from '../../services/equipo-ops';
import { CONFIGURACION_ESTADOS, obtenerClaseEstado, obtenerEtiquetaEstado, normalizarEstado, convertirEstadoParaBackend } from '../../utils/estado.constants';

/**
 * Componente para mostrar la tabla de instrumentos del laboratorio
 * Permite filtrar, ver especificaciones y cambiar estados de equipos
 */
@Component({
  selector: 'app-instruments-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './instruments-table.html',
  styleUrl: './instruments-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstrumentsTable implements OnInit {
  /** Servicio para operaciones con equipos */
  private readonly equipoService = inject(EquipoOps);
  
  /** Filtros de búsqueda aplicados desde el componente padre */
  readonly filtrosBusqueda = input<IBusquedaFiltro | null>(null);
  
  /** Usuario autenticado actualmente */
  readonly usuarioActual = input<IUsuarioResponse | null>(null);
  
  /** Evento emitido cuando cambia el estado de un equipo */
  readonly cambioEstado = output<{equipo: IEquipoResponse, nuevoEstado: string}>();
  
  /** Evento emitido cuando se solicita mostrar especificaciones */
  readonly mostrarEspecificaciones = output<IEquipoResponse>();
  
  /** Evento emitido cuando se actualizan los datos de equipos */
  readonly equiposActualizados = output<IEquipoResponse[]>();
  
  /** Evento emitido cuando se necesita mostrar el modal de login */
  readonly solicitarLogin = output<void>();
  
  /** Lista completa de equipos obtenida del backend */
  readonly equipos = signal<IEquipoResponse[]>([]);
  
  /** Estado de carga de datos */
  readonly cargandoDatos = signal<boolean>(true);
  
  /** Mensaje de error si ocurre algún problema */
  readonly mensajeError = signal<string | null>(null);

  /** Estados disponibles para el selector de cambio de estado */
  readonly estadosDisponiblesSelect = CONFIGURACION_ESTADOS;

  /** Lista filtrada de equipos basada en los criterios de búsqueda */
  readonly equiposFiltrados = computed(() => {
    const equiposBase = this.equipos();
    const filtros = this.filtrosBusqueda();
    
    if (!filtros) return equiposBase;

    return equiposBase.filter(equipo => {
      const coincideBusqueda = !filtros.terminoBusqueda || 
        equipo.nombre.toLowerCase().includes(filtros.terminoBusqueda.toLowerCase()) ||
        equipo.descripcion.toLowerCase().includes(filtros.terminoBusqueda.toLowerCase()) ||
        equipo.marca.toLowerCase().includes(filtros.terminoBusqueda.toLowerCase());

      // Normalizar estado para comparación (backend usa UPPERCASE)
      const coincideEstado = !filtros.filtros.estado || 
        equipo.estado.toLowerCase() === filtros.filtros.estado.toLowerCase();

      // Comparación case-insensitive para categoria y marca
      const coincideCategoria = !filtros.filtros.categoria || 
        equipo.categoria.toLowerCase() === filtros.filtros.categoria.toLowerCase();

      const coincideMarca = !filtros.filtros.marca || 
        equipo.marca.toLowerCase() === filtros.filtros.marca.toLowerCase();

      return coincideBusqueda && coincideEstado && coincideCategoria && coincideMarca;
    });
  });

  ngOnInit(): void {
    this.cargarEquipos();
  }

  /**
   * Carga la lista de equipos desde el backend
   */
  cargarEquipos(): void {
    this.cargandoDatos.set(true);
    this.mensajeError.set(null);
    
    this.equipoService.obtenerTodosLosEquipos().subscribe({
      next: (equipos) => {
        this.equipos.set(equipos);
        this.cargandoDatos.set(false);
        // Emitir los datos para compartir con otros componentes
        this.equiposActualizados.emit(equipos);
      },
      error: (error) => {
        this.mensajeError.set(error.message);
        this.cargandoDatos.set(false);
        console.error('Error al cargar equipos:', error);
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
   * Verifica si el usuario está autenticado
   * @returns true si hay un usuario autenticado
   */
  estaAutenticado(): boolean {
    return this.usuarioActual() !== null;
  }

  /**
   * Verifica si un equipo está en uso y no se puede cambiar su estado
   * @param equipo Equipo a verificar
   * @returns true si el equipo está en uso
   */
  equipoEnUso(equipo: IEquipoResponse): boolean {
    const estadoNormalizado = normalizarEstado(equipo.estado);
    return estadoNormalizado === 'EN USO';
  }

  /**
   * Maneja el intento de cambio de estado de un equipo
   * Verifica autenticación antes de proceder
   * @param equipo Equipo al que se le cambia el estado
   * @param evento Evento del select con el nuevo estado
   */
  onCambiarEstado(equipo: IEquipoResponse, evento: Event): void {
    // Verificar autenticación
    if (!this.estaAutenticado()) {
      const select = evento.target as HTMLSelectElement;
      // Revertir el select al estado anterior
      select.value = this.normalizarEstadoParaSelect(equipo.estado);
      // Solicitar login
      this.solicitarLogin.emit();
      return;
    }

    const select = evento.target as HTMLSelectElement;
    const nuevoEstado = select.value;
    const usuario = this.usuarioActual();
    
    if (!usuario) {
      select.value = this.normalizarEstadoParaSelect(equipo.estado);
      this.solicitarLogin.emit();
      return;
    }
    
    // Convertir estado a formato que espera el backend
    const estadoParaBackend = convertirEstadoParaBackend(nuevoEstado);
    
    // Solicitar préstamo usando el nuevo endpoint
    this.equipoService.solicitarPrestamo(usuario.idUsuario, equipo.idEquipo, estadoParaBackend).subscribe({
      next: (prestacionResponse) => {
        // Crear un objeto IEquipoResponse actualizado basado en la respuesta del préstamo
        const equipoActualizado: IEquipoResponse = {
          ...equipo,
          estado: estadoParaBackend
        };
        
        // Actualizar localmente el equipo
        const equiposActuales = this.equipos();
        const indice = equiposActuales.findIndex(e => e.idEquipo === equipo.idEquipo);
        if (indice !== -1) {
          equiposActuales[indice] = equipoActualizado;
          this.equipos.set([...equiposActuales]);
        }
        
        // Emitir evento para notificar al componente padre
        this.cambioEstado.emit({ equipo: equipoActualizado, nuevoEstado: estadoParaBackend });
        
        console.log('Préstamo solicitado exitosamente:', prestacionResponse);
      },
      error: (error) => {
        console.error('Error al solicitar préstamo:', error);
        // Revertir el select al estado anterior
        select.value = this.normalizarEstadoParaSelect(equipo.estado);
        // Mostrar mensaje de error al usuario
        this.mensajeError.set(`Error al cambiar estado: ${error.message}`);
      }
    });
  }

  /**
   * Normaliza el estado del backend para mostrarlo en el select
   * @param estado Estado del backend (UPPERCASE)
   * @returns Estado normalizado para el select
   */
  normalizarEstadoParaSelect(estado: string): string {
    return normalizarEstado(estado) || estado.toLowerCase();
  }

  /**
   * Maneja la solicitud de mostrar especificaciones de un equipo
   * @param equipo Equipo del cual mostrar especificaciones
   */
  onMostrarEspecificaciones(equipo: IEquipoResponse): void {
    this.mostrarEspecificaciones.emit(equipo);
  }
}
