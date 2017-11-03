import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingComponentComponent } from './landing-component.component';

describe('LandingComponentComponent', () => {
  let component: LandingComponentComponent;
  let fixture: ComponentFixture<LandingComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
