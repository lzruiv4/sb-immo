import { Component, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PropertyService } from '../../services/property.service';
import { AvatarModule } from 'primeng/avatar';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-property',
  imports: [
    AvatarModule,
    FormsModule,
    TableModule,
    TagModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    MultiSelectModule,
    SelectModule,
    CommonModule,
    ButtonModule,
  ],
  // standalone: true,
  templateUrl: './property.component.html',
  styleUrl: './property.component.scss',
})
export class PropertyComponent implements OnInit {
  constructor(
    private propertyService: PropertyService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.propertyService.getProperties();
    this.propertyService.properties$.subscribe();
    this.contactService.getContacts();
    this.contactService.contacts$.subscribe();
    console.log('sss', this.contactService.contacts$);
  }

  get properties$() {
    return this.propertyService.properties$;
  }

  get contact$() {
    return this.contactService.contacts$;
  }

  columnDefs = [
    { field: 'firstname', header: 'Firstname' },
    { field: 'lastname', header: 'Lastname' },
    { field: 'email', header: 'Email' },
    { field: 'phone', header: 'Phone' },
    { field: 'note', header: 'Note' },
  ];

  onSave(contact: any) {
    console.log('保存数据：', contact);
    // 调用服务更新后端
  }

  onCancel(contact: any) {
    console.log('取消编辑：', contact);
    // 可撤销临时数据
  }
}
