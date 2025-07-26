import { Component, input, output, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { ILoginCredentials, IUsuarioResponse } from '../../models/usuario.model';

/**
 * Componente modal para autenticación de usuarios
 * Permite el login con correo y contraseña
 */
@Component({
  selector: 'app-login-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginModal {
  /** Servicio para operaciones de usuario */
  private readonly usuarioService = inject(UsuarioService);
  
  /** Estado de visibilidad del modal */
  readonly esVisible = input<boolean>(false);
  
  /** Evento emitido al cerrar el modal */
  readonly modalClose = output<void>();
  
  /** Evento emitido cuando el login es exitoso */
  readonly loginExitoso = output<IUsuarioResponse>();
  
  /** Credenciales de acceso del usuario */
  readonly credenciales = signal<ILoginCredentials>({
    correo: '',
    password: ''
  });
  
  /** Estado de proceso de autenticación */
  readonly autenticando = signal<boolean>(false);
  
  /** Mensaje de error en caso de fallo de autenticación */
  readonly mensajeError = signal<string | null>(null);

  /**
   * Cierra el modal y limpia el formulario
   */
  cerrarModal(): void {
    this.modalClose.emit();
    this.limpiarFormulario();
  }

  /**
   * Maneja el envío del formulario de login
   */
  onLogin(): void {
    const creds = this.credenciales();
    
    if (!creds.correo || !creds.password) {
      this.mensajeError.set('Por favor ingrese correo y contraseña');
      return;
    }

    this.autenticando.set(true);
    this.mensajeError.set(null);

    this.usuarioService.autenticarUsuario(creds).subscribe({
      next: (usuario) => {
        this.autenticando.set(false);
        this.loginExitoso.emit(usuario);
        this.limpiarFormulario();
      },
      error: (error) => {
        this.autenticando.set(false);
        this.mensajeError.set(error.message);
      }
    });
  }

  /**
   * Actualiza el correo en las credenciales
   * @param correo Nuevo correo electrónico
   */
  actualizarCorreo(correo: string): void {
    this.credenciales.update(creds => ({ ...creds, correo }));
  }

  /**
   * Actualiza la contraseña en las credenciales
   * @param password Nueva contraseña
   */
  actualizarPassword(password: string): void {
    this.credenciales.update(creds => ({ ...creds, password }));
  }

  /**
   * Limpia el formulario de credenciales
   */
  private limpiarFormulario(): void {
    this.credenciales.set({ correo: '', password: '' });
    this.mensajeError.set(null);
  }
}
