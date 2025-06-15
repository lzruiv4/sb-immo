import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IContactDto } from '../../models/dtos/contact.dto';
import { ContactService } from '../../services/contact.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

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

  constructor(private contactService: ContactService) {}

  onSubmit(form: NgForm) {
    this.contactService.saveNewContact(this.contact).subscribe();
    this.closeDialog.emit();
    form.resetForm();
  }

  onCancel(form: NgForm): void {
    this.closeDialog.emit();
    form.resetForm();
  }
}
