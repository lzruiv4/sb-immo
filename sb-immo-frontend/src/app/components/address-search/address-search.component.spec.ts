import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressSearchComponent } from './address-search.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InputComponent', () => {
  let component: AddressSearchComponent;
  let fixture: ComponentFixture<AddressSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressSearchComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
