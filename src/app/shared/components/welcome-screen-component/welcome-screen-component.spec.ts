import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeScreenComponent } from './welcome-screen-component';

describe('WelcomeScreenComponent', () => {
  let component: WelcomeScreenComponent;
  let fixture: ComponentFixture<WelcomeScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeScreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeScreenComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
