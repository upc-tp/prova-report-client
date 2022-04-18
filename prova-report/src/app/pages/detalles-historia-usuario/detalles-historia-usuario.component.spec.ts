import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesHistoriaUsuarioComponent } from './detalles-historia-usuario.component';

describe('DetallesHistoriaUsuarioComponent', () => {
  let component: DetallesHistoriaUsuarioComponent;
  let fixture: ComponentFixture<DetallesHistoriaUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallesHistoriaUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesHistoriaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
