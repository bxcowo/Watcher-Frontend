import { Component, input, output, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ICriterioFiltro } from '../../models/criterio-filtro';
import { IBusquedaFiltro } from '../../models/busqueda-filtro';
import { IEquipoResponse } from '../../models/equipo-response';
import { obtenerEtiquetaEstado, normalizarEstado } from '../../utils/estado.constants';

/**
 * Componente para filtros de búsqueda de equipos
 * Permite buscar por término general y filtrar por criterios específicos
 * Genera opciones dinámicamente basadas en los datos disponibles
 */
@Component({
  selector: 'app-search-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-filter.html',
  styleUrl: './search-filter.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFilter {
  /** Lista de equipos para generar opciones dinámicas */
  readonly equipos = input<IEquipoResponse[]>([]);
  
  /** Evento emitido cuando cambian los criterios de búsqueda */
  readonly cambioBusqueda = output<IBusquedaFiltro>();

  /** Término de búsqueda general */
  readonly terminoBusqueda = signal<string>('');
  
  /** Filtros específicos para equipos */
  readonly filtros = signal<ICriterioFiltro>({
    estado: undefined,
    marca: undefined,
    categoria: undefined
  });

  /** Estados disponibles extraídos dinámicamente de los equipos */
  readonly estadosDisponibles = computed(() => {
    const equipos = this.equipos();
    if (!equipos.length) return [];
    
    const estados = [...new Set(equipos.map(equipo => equipo.estado.toLowerCase()))]
      .map(estado => normalizarEstado(estado))
      .filter((estado): estado is string => estado !== null)
      .sort()
      .map(estado => ({
        valor: estado,
        etiqueta: obtenerEtiquetaEstado(estado)
      }));
    
    return estados;
  });

  /** Categorías disponibles extraídas dinámicamente de los equipos */
  readonly categoriasDisponibles = computed(() => {
    const equipos = this.equipos();
    if (!equipos.length) return [];
    
    return [...new Set(equipos.map(equipo => equipo.categoria))]
      .filter(categoria => categoria && categoria.trim() !== '')
      .sort();
  });

  /** Marcas disponibles extraídas dinámicamente de los equipos */
  readonly marcasDisponibles = computed(() => {
    const equipos = this.equipos();
    if (!equipos.length) return [];
    
    return [...new Set(equipos.map(equipo => equipo.marca))]
      .filter(marca => marca && marca.trim() !== '')
      .sort();
  });

  /**
   * Maneja cambios en el término de búsqueda
   */
  onBusqueda(): void {
    this.emitirCambioBusqueda();
  }

  /**
   * Maneja cambios en los filtros específicos
   */
  onCambioFiltro(): void {
    this.emitirCambioBusqueda();
  }

  /**
   * Limpia todos los filtros y términos de búsqueda
   */
  limpiarFiltros(): void {
    this.terminoBusqueda.set('');
    this.filtros.set({
      estado: undefined,
      marca: undefined,
      categoria: undefined
    });
    this.emitirCambioBusqueda();
  }

  /**
   * Actualiza el término de búsqueda
   * @param termino Nuevo término de búsqueda
   */
  actualizarTerminoBusqueda(termino: string): void {
    this.terminoBusqueda.set(termino);
    this.emitirCambioBusqueda();
  }

  /**
   * Actualiza el filtro de estado
   * @param estado Nuevo estado para filtrar
   */
  actualizarFiltroEstado(estado: string): void {
    this.filtros.update(filtros => ({
      ...filtros,
      estado: estado || undefined
    }));
    this.emitirCambioBusqueda();
  }

  /**
   * Actualiza el filtro de marca
   * @param marca Nueva marca para filtrar
   */
  actualizarFiltroMarca(marca: string): void {
    this.filtros.update(filtros => ({
      ...filtros,
      marca: marca || undefined
    }));
    this.emitirCambioBusqueda();
  }

  /**
   * Actualiza el filtro de categoría
   * @param categoria Nueva categoría para filtrar
   */
  actualizarFiltroCategoria(categoria: string): void {
    this.filtros.update(filtros => ({
      ...filtros,
      categoria: categoria || undefined
    }));
    this.emitirCambioBusqueda();
  }


  /**
   * Emite el evento de cambio de búsqueda con los filtros actuales
   */
  private emitirCambioBusqueda(): void {
    const busquedaFiltro: IBusquedaFiltro = {
      terminoBusqueda: this.terminoBusqueda(),
      filtros: { ...this.filtros() }
    };
    
    this.cambioBusqueda.emit(busquedaFiltro);
  }
}
