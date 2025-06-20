import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IContactDto } from '../../models/dtos/contact.dto';
import { ContactService } from '../../services/contact.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-create-contact',
  imports: [
    DialogModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './create-contact.component.html',
  styleUrl: './create-contact.component.scss',
})
export class CreateContactComponent {
  @Input() visible = false;
  @Output() closeDialog = new EventEmitter<void>();

  contact: IContactDto = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    notes: '',
  };

  constructor(
    private contactService: ContactService,
    private notificationService: NotificationService
  ) {}

  onSubmit(form: NgForm) {
    this.contactService.saveNewContact(this.contact).subscribe({
      next: (response) => {
        this.closeDialog.emit();
        form.resetForm();
        this.notificationService.success(
          'success',
          'Create contact successful'
        );
      },
      error: (error) => {
        this.notificationService.error('error', 'Create contact failed', error);
      },
    });
  }

  onCancel(form: NgForm): void {
    this.closeDialog.emit();
    form.resetForm();
  }
}
