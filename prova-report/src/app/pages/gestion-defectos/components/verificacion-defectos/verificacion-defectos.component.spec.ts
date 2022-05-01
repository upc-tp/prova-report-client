import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacionDefectosComponent } from './verificacion-defectos.component';

describe('VerificacionDefectosComponent', () => {
  let component: VerificacionDefectosComponent;
  let fixture: ComponentFixture<VerificacionDefectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificacionDefectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificacionDefectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
