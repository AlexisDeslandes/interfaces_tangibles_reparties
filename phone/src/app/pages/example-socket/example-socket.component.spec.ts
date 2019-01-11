import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleSocketComponent } from './example-socket.component';

describe('ExampleSocketComponent', () => {
  let component: ExampleSocketComponent;
  let fixture: ComponentFixture<ExampleSocketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExampleSocketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleSocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
