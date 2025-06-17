import { Component, Input } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';
import { IContactDto } from '../../../models/dtos/contact.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-show',
  imports: [FieldsetModule, AvatarModule, CommonModule],
  templateUrl: './card-show.component.html',
  styleUrl: './card-show.component.scss',
})
export class CardShowComponent {
  @Input() contact: IContactDto | null = null;

  getFirstABC(firstname: string): string {
    return (firstname.charAt(0) || '').toUpperCase();
  }
}
