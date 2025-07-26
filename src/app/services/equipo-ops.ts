import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { IEquipoResponse } from '../models/equipo-response';
import { EspecificacionEquipo } from '../models/especificaciones.model';
import { IErrorResponse } from '../models/error-response.model';
import { IPrestacionRequest } from '../models/prestacion-request';
import { IPrestacionResponse } from '../models/prestacion-response';
import { BASE_URL } from '../utils/constants';

/**
 * Servicio para operaciones relacionadas con equipos
 * Maneja la comunicación con la API backend de WatcherBackend
 */
@Injectable({
  providedIn: 'root'
})
export class EquipoOps {
  private readonly http = inject(HttpClient);
  
  /**
   * Obtiene todos los equipos del sistema
   * @returns Observable con la lista de equipos
   */
  obtenerTodosLosEquipos(): Observable<IEquipoResponse[]> {
    return this.http.get<IEquipoResponse[]>(`${BASE_URL}/equipo`)
      .pipe(
        catchError(this.manejarError)
      );
  }
  
  /**
   * Obtiene las especificaciones técnicas de un equipo específico
   * @param idEquipo ID del equipo
   * @returns Observable con las especificaciones del equipo
   */
  obtenerEspecificacionesEquipo(idEquipo: number): Observable<EspecificacionEquipo> {
    return this.http.get<EspecificacionEquipo>(`${BASE_URL}/equipo/${idEquipo}/especificaciones`)
      .pipe(
        catchError(this.manejarError)
      );
  }
  
  /**
   * Actualiza el estado de un equipo
   * @param idEquipo ID del equipo
   * @param nuevoEstado Nuevo estado del equipo
   * @returns Observable con los datos actualizados del equipo
   */
  actualizarEstadoEquipo(idEquipo: number, nuevoEstado: string): Observable<IEquipoResponse> {
    const requestBody = { estado: nuevoEstado };
    
    return this.http.patch<IEquipoResponse>(`${BASE_URL}/equipo/${idEquipo}/estado`, requestBody)
      .pipe(
        catchError(this.manejarError)
      );
  }

  /**
   * Solicita un préstamo de equipo usando el nuevo endpoint
   * @param idUsuario ID del usuario que solicita
   * @param idEquipo ID del equipo a prestar
   * @param estadoEquipo Estado del equipo
   * @returns Observable con la respuesta del préstamo
   */
  solicitarPrestamo(idUsuario: number, idEquipo: number, estadoEquipo: string): Observable<IPrestacionResponse> {
    const prestacionRequest: IPrestacionRequest = {
      idUsuario,
      idEquipo,
      estadoEquipo
    };
    
    return this.http.post<IPrestacionResponse>(`${BASE_URL}/prestamos/solicitar`, prestacionRequest)
      .pipe(
        catchError(this.manejarError)
      );
  }

  /**
   * Obtiene todos los registros de préstamos
   * @returns Observable con la lista de préstamos
   */
  obtenerTodosPrestamos(): Observable<IPrestacionResponse[]> {
    return this.http.get<IPrestacionResponse[]>(`${BASE_URL}/prestamos`)
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
    
    console.error('Error completo en EquipoOps:', error);
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente (red, CORS, etc.)
      mensajeError = `Error de conexión: ${error.error.message}`;
    } else if (error.status === 0) {
      // Error de conectividad/CORS
      mensajeError = 'Error de conexión: No se puede conectar al servidor. Verifica tu conexión a internet.';
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 404:
          mensajeError = 'Recurso no encontrado';
          break;
        case 500:
          mensajeError = 'Error interno del servidor';
          break;
        case 401:
          mensajeError = 'No autorizado. Inicia sesión para continuar.';
          break;
        case 403:
          mensajeError = 'No tienes permisos para realizar esta acción.';
          break;
        default:
          if (error.error && (error.error as IErrorResponse).message) {
            mensajeError = (error.error as IErrorResponse).message;
          } else {
            mensajeError = `Error del servidor: Código ${error.status}`;
          }
      }
    }
    
    return throwError(() => new Error(mensajeError));
  }
}
