import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiCheck } from './api-check';

describe('ApiCheck', () => {
  let component: ApiCheck;
  let fixture: ComponentFixture<ApiCheck>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiCheck],
    }).compileComponents();

    fixture = TestBed.createComponent(ApiCheck);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
