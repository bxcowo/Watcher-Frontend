import { TestBed } from '@angular/core/testing';

import { EquipoOps } from './equipo-ops';

describe('EquipoOps', () => {
  let service: EquipoOps;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipoOps);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
