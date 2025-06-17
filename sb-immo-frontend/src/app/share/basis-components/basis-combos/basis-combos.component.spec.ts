import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasisCombosComponent } from './basis-combos.component';

describe('BasisComboxComponent', () => {
  let component: BasisCombosComponent;
  let fixture: ComponentFixture<BasisCombosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasisCombosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BasisCombosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
