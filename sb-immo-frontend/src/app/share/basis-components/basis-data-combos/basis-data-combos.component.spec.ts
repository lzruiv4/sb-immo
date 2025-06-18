import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasisDataCombosComponent } from './basis-data-combos.component';

describe('BasisDataCombosComponent', () => {
  let component: BasisDataCombosComponent;
  let fixture: ComponentFixture<BasisDataCombosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasisDataCombosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasisDataCombosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
