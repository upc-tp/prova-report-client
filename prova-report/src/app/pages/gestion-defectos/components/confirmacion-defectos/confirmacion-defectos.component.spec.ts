import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionDefectosComponent } from './confirmacion-defectos.component';

describe('ConfirmacionDefectosComponent', () => {
  let component: ConfirmacionDefectosComponent;
  let fixture: ComponentFixture<ConfirmacionDefectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmacionDefectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionDefectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
