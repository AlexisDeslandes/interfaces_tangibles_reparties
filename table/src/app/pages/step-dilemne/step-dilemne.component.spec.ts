import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepDilemneComponent } from './step-dilemne.component';

describe('StepDilemneComponent', () => {
  let component: StepDilemneComponent;
  let fixture: ComponentFixture<StepDilemneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepDilemneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepDilemneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
