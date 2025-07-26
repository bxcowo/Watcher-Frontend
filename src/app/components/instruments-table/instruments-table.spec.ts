import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentsTable } from './instruments-table';

describe('InstrumentsTable', () => {
  let component: InstrumentsTable;
  let fixture: ComponentFixture<InstrumentsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstrumentsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstrumentsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
