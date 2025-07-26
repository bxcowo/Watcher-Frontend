import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';

/**
 * Configuración principal de la aplicación Angular
 * Configura los proveedores necesarios para el funcionamiento del sistema
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Manejo de errores globales del navegador
    provideBrowserGlobalErrorListeners(),
    
    // Optimización de detección de cambios
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Configuración de routing
    provideRouter(routes),
    
    // Cliente HTTP para comunicación con el backend
    provideHttpClient(withInterceptorsFromDi())
  ]
};
