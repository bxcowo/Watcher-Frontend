import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { IUsuarioResponse, ILoginCredentials } from '../models/usuario.model';
import { IErrorResponse } from '../models/error-response.model';
import { BASE_URL } from '../utils/constants';

/**
 * Servicio para operaciones relacionadas con usuarios
 * Maneja la autenticación y gestión de usuarios del sistema
 */
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly http = inject(HttpClient);
  
  /**
   * Autentica un usuario con sus credenciales
   * @param credenciales Correo y contraseña del usuario
   * @returns Observable con los datos del usuario autenticado
   */
  autenticarUsuario(credenciales: ILoginCredentials): Observable<IUsuarioResponse> {
    const params = new HttpParams()
      .set('correo', credenciales.correo)
      .set('password', credenciales.password);
    
    return this.http.get<IUsuarioResponse>(`${BASE_URL}/usuario/find/by/correo-and-password`, { params })
      .pipe(
        catchError(this.manejarError)
      );
  }
  
  /**
   * Obtiene todos los usuarios del sistema
   * @returns Observable con la lista de usuarios
   */
  obtenerTodosLosUsuarios(): Observable<IUsuarioResponse[]> {
    return this.http.get<IUsuarioResponse[]>(`${BASE_URL}/usuario`)
      .pipe(
        catchError(this.manejarError)
      );
  }
  
  /**
   * Maneja errores HTTP de forma centralizada
   * @param error Error HTTP recibido
   * @returns Observable que emite un error con mensaje descriptivo
   */
  private manejarError(error: HttpErrorResponse): Observable<never> {
    let mensajeError = 'Ha ocurrido un error inesperado';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      mensajeError = `Error de cliente: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 404:
          mensajeError = 'Usuario no encontrado o credenciales incorrectas';
          break;
        case 500:
          mensajeError = 'Error interno del servidor';
          break;
        default:
          if (error.error && (error.error as IErrorResponse).message) {
            mensajeError = (error.error as IErrorResponse).message;
          } else {
            mensajeError = `Error del servidor: Código ${error.status}`;
          }
      }
    }
    
    console.error('Error en UsuarioService:', error);
    return throwError(() => new Error(mensajeError));
  }
}