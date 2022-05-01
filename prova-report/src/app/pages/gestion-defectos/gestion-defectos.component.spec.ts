import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDefectosComponent } from './gestion-defectos.component';

describe('GestionDefectosComponent', () => {
  let component: GestionDefectosComponent;
  let fixture: ComponentFixture<GestionDefectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionDefectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionDefectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
