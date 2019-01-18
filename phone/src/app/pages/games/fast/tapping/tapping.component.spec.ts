import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TappingComponent } from './tapping.component';

describe('TappingComponent', () => {
  let component: TappingComponent;
  let fixture: ComponentFixture<TappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
