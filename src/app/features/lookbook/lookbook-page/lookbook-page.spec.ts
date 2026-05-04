import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookbookPage } from './lookbook-page';

describe('LookbookPage', () => {
  let component: LookbookPage;
  let fixture: ComponentFixture<LookbookPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LookbookPage],
    }).compileComponents();

    fixture = TestBed.createComponent(LookbookPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
