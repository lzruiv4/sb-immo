import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindContactsComponent } from './find-contacts.component';

describe('FindContactsComponent', () => {
  let component: FindContactsComponent;
  let fixture: ComponentFixture<FindContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindContactsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
