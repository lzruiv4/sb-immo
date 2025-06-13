import { Component, OnInit } from '@angular/core';
import { PrimeNG } from 'primeng/config';
import { HomeLayoutComponent } from './layout/home-layout/home-layout.component';

@Component({
  selector: 'app-root',
  imports: [HomeLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  // constructor(private primeng: PrimeNG) {}

  // ngOnInit() {
  //   this.primeng.ripple.set(true);
  // }
}
