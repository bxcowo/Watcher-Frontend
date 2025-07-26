import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { Header } from './components/header/header';
import { LoginModal } from './components/login-modal/login-modal';
import { SearchFilter } from './components/search-filter/search-filter';
import { InstrumentsTable } from './components/instruments-table/instruments-table';
import { SpecificationsModal } from './components/specifications-modal/specifications-modal';
import { IEquipoResponse } from './models/equipo-response';
import { IBusquedaFiltro } from './models/busqueda-filtro';
import { IUsuarioResponse } from './models/usuario.model';

/**
 * Componente principal de la aplicación de monitorización OTI UNI Tech Lab
 * Gestiona el estado global y la comunicación entre componentes
 */
@Component({
  selector: 'app-root',
  imports: [
    Header,
    LoginModal,
    SearchFilter,
    InstrumentsTable,
    SpecificationsModal
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  /** Título de la aplicación */
  readonly title = 'OTI UNI Tech Lab - Monitorización';
  
  /** Estado de visibilidad del modal de login */
  readonly mostrarModalLogin = signal<boolean>(false);
  
  /** Estado de visibilidad del modal de especificaciones */
  readonly mostrarModalEspecificaciones = signal<boolean>(false);
  
  /** Filtros de búsqueda actuales */
  readonly filtrosBusqueda = signal<IBusquedaFiltro | null>(null);
  
  /** Equipo seleccionado para mostrar especificaciones */
  readonly equipoSeleccionado = signal<IEquipoResponse | null>(null);
  
  /** Usuario autenticado actualmente */
  readonly usuarioActual = signal<IUsuarioResponse | null>(null);
  
  /** Datos de equipos compartidos entre componentes */
  readonly equiposData = signal<IEquipoResponse[]>([]);

  /**
   * Maneja cambios en los filtros de búsqueda
   * @param filtrosBusqueda Nuevos filtros aplicados
   */
  onCambioBusqueda(filtrosBusqueda: IBusquedaFiltro): void {
    this.filtrosBusqueda.set(filtrosBusqueda);
  }

  /**
   * Maneja cambios de estado de equipos
   * @param evento Datos del equipo y nuevo estado
   */
  onCambioEstado(evento: {equipo: IEquipoResponse, nuevoEstado: string}): void {
    console.log('Estado cambiado:', evento);
    // Actualizar el estado del equipo localmente
    evento.equipo.estado = evento.nuevoEstado;
  }

  /**
   * Maneja la solicitud de mostrar especificaciones de un equipo
   * @param equipo Equipo del cual mostrar especificaciones
   */
  onMostrarEspecificaciones(equipo: IEquipoResponse): void {
    this.equipoSeleccionado.set(equipo);
    this.mostrarModalEspecificaciones.set(true);
  }
  
  /**
   * Maneja la apertura/cierre del modal de login
   */
  onToggleModalLogin(): void {
    this.mostrarModalLogin.update(estado => !estado);
  }
  
  /**
   * Maneja el cierre del modal de especificaciones
   */
  onCerrarModalEspecificaciones(): void {
    this.mostrarModalEspecificaciones.set(false);
    this.equipoSeleccionado.set(null);
  }
  
  /**
   * Maneja el login exitoso de un usuario
   * @param usuario Datos del usuario autenticado
   */
  onLoginExitoso(usuario: IUsuarioResponse): void {
    this.usuarioActual.set(usuario);
    this.mostrarModalLogin.set(false);
  }
  
  /**
   * Maneja el logout del usuario
   */
  onLogout(): void {
    this.usuarioActual.set(null);
  }
  
  /**
   * Actualiza los datos de equipos compartidos
   * @param equipos Nueva lista de equipos
   */
  onEquiposActualizados(equipos: IEquipoResponse[]): void {
    this.equiposData.set(equipos);
  }
}
