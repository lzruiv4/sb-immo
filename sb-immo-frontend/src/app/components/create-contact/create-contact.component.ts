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
    if (this.contactService.isContactDuplicated(this.contact)) {
      this.notificationService.warn('warn', 'Create: Contact is duplicated');
    } else {
      this.contactService.saveNewContact(this.contact).subscribe({
        next: (response) => {
          this.notificationService.success(
            'success',
            'Create: Contact create successful'
          );
        },
        error: (error) => {
          console.log(error);
          this.notificationService.error(
            'error',
            'Create: Contact create failed',
            error
          );
        },
      });
      this.closeDialog.emit();
    }

    form.resetForm();
  }

  onCancel(form: NgForm): void {
    this.closeDialog.emit();
    form.resetForm();
  }
}
