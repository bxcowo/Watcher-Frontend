import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { IUsuarioResponse } from '../../models/usuario.model';

/**
 * Componente de cabecera de la aplicación
 * Contiene el logo, título y controles de autenticación
 */
@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  /** Usuario actualmente autenticado */
  readonly usuarioActual = input<IUsuarioResponse | null>(null);
  
  /** Evento emitido para alternar el modal de login */
  readonly loginModalToggle = output<void>();
  
  /** Evento emitido para cerrar sesión */
  readonly logout = output<void>();

  /**
   * Abre el modal de login
   */
  abrirModalLogin(): void {
    this.loginModalToggle.emit();
  }
  
  /**
   * Cierra la sesión del usuario actual
   */
  cerrarSesion(): void {
    this.logout.emit();
  }
}
