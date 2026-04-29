import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lookbook } from './lookbook';

describe('Lookbook', () => {
  let component: Lookbook;
  let fixture: ComponentFixture<Lookbook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lookbook],
    }).compileComponents();

    fixture = TestBed.createComponent(Lookbook);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
