import { Component, Input } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { IPropertyRecord } from '../../../models/property-record.model';

@Component({
  selector: 'app-card-show',
  imports: [FieldsetModule, AvatarModule, CommonModule],
  templateUrl: './card-show.component.html',
  styleUrl: './card-show.component.scss',
})
export class CardShowComponent {
  @Input() propertyRecord!: IPropertyRecord;

  getFirstLetterAsImage(firstname: string): string {
    return (firstname.charAt(0) || '').toUpperCase();
  }
}
