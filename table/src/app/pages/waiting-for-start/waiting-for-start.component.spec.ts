import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingForStartComponent } from './waiting-for-start.component';

describe('WaitingForStartComponent', () => {
  let component: WaitingForStartComponent;
  let fixture: ComponentFixture<WaitingForStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingForStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingForStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
