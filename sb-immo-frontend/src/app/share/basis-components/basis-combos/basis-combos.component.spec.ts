import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasisCombosComponent } from './basis-combos.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ITag } from '../../models/tag.model';
import { PropertyStatusType } from '../../../models/enums/property-status.enum';

describe('BasisCombosComponent', () => {
  let component: BasisCombosComponent<PropertyStatusType>;
  let fixture: ComponentFixture<BasisCombosComponent<PropertyStatusType>>;

  // 模拟输入的 suggestions 数据
  const mockSuggestions: Record<PropertyStatusType, ITag> = {
    [PropertyStatusType.AVAILABLE]: { label: 'AVAILABLE', severity: 'success' },
    [PropertyStatusType.RENTED]: { label: 'MAINTENANCE', severity: 'warn' },
    [PropertyStatusType.MAINTENANCE]: { label: 'RENTED', severity: 'info' },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoCompleteModule, FormsModule],
      declarations: [BasisCombosComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture =
      TestBed.createComponent<BasisCombosComponent<PropertyStatusType>>(
        BasisCombosComponent
      );
    component = fixture.componentInstance;

    // 设定输入属性
    component.suggestions = mockSuggestions;
    component.current = PropertyStatusType.AVAILABLE;
    fixture.detectChanges(); // 触发 ngOnInit 和 ngOnChanges
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize selectedStatus from current on ngOnInit', () => {
    component.ngOnInit();
    expect(component.selectedStatus).toBe(PropertyStatusType.AVAILABLE);
  });

  it('should update statusOptions on ngOnChanges', () => {
    component.ngOnChanges();
    expect(component.statusOptions.length).toBe(3);
    expect(component.statusOptions[0]).toEqual({
      value: PropertyStatusType.AVAILABLE,
      label: 'AVAILABLE',
      severity: 'success',
    });
  });

  it('should filter statuses correctly', () => {
    component.ngOnChanges();
    component.filterStatus({ query: 'pen' });
    expect(component.filteredStatuses.length).toBe(2);
    expect(component.filteredStatuses.some((s) => s.label === 'Open')).toBe(
      true
    );
    expect(component.filteredStatuses.some((s) => s.label === 'Pending')).toBe(
      true
    );
  });

  it('should emit selected status on selected()', () => {
    spyOn(component.statusSelected, 'emit');
    const event = { value: PropertyStatusType.RENTED };
    component.selected(event as any);
    expect(component.statusSelected.emit).toHaveBeenCalledWith(
      PropertyStatusType.RENTED
    );
  });

  it('should render p-autocomplete and bind selectedStatus', () => {
    // 触发变更检测
    fixture.detectChanges();

    const autoComplete = fixture.debugElement.query(By.css('p-autocomplete'));
    expect(autoComplete).toBeTruthy();

    // 模拟输入框内容绑定到 selectedStatus
    component.selectedStatus = PropertyStatusType.MAINTENANCE;
    fixture.detectChanges();

    // 断言 ngModel 绑定
    const inputEl = autoComplete.nativeElement.querySelector('input');
    expect(inputEl.value).toContain('Pending'); // 取决于 PrimeNG 如何显示，但一般会有label

    // 模拟触发 completeMethod 事件调用 filterStatus
    component.filterStatus({ query: 'clo' });
    expect(component.filteredStatuses.length).toBe(1);
    expect(component.filteredStatuses[0].label).toBe('Closed');
  });
});
