import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { MessageService } from 'primeng/api';

describe('NotificationService', () => {
  let service: NotificationService;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MessageService', ['add', 'clear']);
    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MessageService, useValue: spy },
      ],
    });
    service = TestBed.inject(NotificationService);
    messageServiceSpy = TestBed.inject(
      MessageService
    ) as jasmine.SpyObj<MessageService>;
  });

  it('should call messageService.add with success severity', () => {
    service.success('Success', 'Operation completed');
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Operation completed',
      life: 3000,
    });
  });

  it('should call messageService.add with error severity', () => {
    service.error('Error', 'Something went wrong');
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Something went wrong',
      life: 5000,
    });
  });

  it('should call messageService.add with info severity', () => {
    service.info('Info', 'Just letting you know');
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Info',
      detail: 'Just letting you know',
      life: 10000,
    });
  });

  it('should call messageService.add with warn severity', () => {
    service.warn('Warning', 'Be careful');
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Be careful',
      life: 5000,
    });
  });

  it('should call messageService.clear', () => {
    service.clear();
    expect(messageServiceSpy.clear).toHaveBeenCalled();
  });
});
