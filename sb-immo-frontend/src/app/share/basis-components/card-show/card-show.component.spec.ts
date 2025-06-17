import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardShowComponent } from './card-show.component';

describe('CardShowComponent', () => {
  let component: CardShowComponent;
  let fixture: ComponentFixture<CardShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
