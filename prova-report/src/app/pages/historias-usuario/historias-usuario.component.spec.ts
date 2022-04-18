import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriasUsuarioComponent } from './historias-usuario.component';

describe('HistoriasUsuarioComponent', () => {
  let component: HistoriasUsuarioComponent;
  let fixture: ComponentFixture<HistoriasUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriasUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriasUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
