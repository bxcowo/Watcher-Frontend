import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationsModal } from './specifications-modal';

describe('SpecificationsModal', () => {
  let component: SpecificationsModal;
  let fixture: ComponentFixture<SpecificationsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecificationsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecificationsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
