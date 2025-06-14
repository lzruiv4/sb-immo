import { Component, OnInit } from '@angular/core';
import { PropertyRecordService } from '../../services/connection.service';
import { AddressSearchComponent } from "../address-search/address-search.component";

@Component({
  selector: 'app-connection',
  imports: [],
  templateUrl: './connection.component.html',
  styleUrl: './connection.component.scss',
})
export class ConnectionComponent implements OnInit {
  constructor(private propertyRecordService: PropertyRecordService) {}

  ngOnInit(): void {
    this.propertyRecordService.getPropertyRecords().subscribe();
    this.propertyRecordService.propertyRecords$;
    console.log(this.propertyRecordService.propertyRecords$);
  }

  get propertyRecords$() {
    return this.propertyRecordService.propertyRecords$;
  }
}
