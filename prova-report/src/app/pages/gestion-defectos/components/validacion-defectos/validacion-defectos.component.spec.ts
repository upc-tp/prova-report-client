import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacionDefectosComponent } from './validacion-defectos.component';

describe('ValidacionDefectosComponent', () => {
  let component: ValidacionDefectosComponent;
  let fixture: ComponentFixture<ValidacionDefectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidacionDefectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidacionDefectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
