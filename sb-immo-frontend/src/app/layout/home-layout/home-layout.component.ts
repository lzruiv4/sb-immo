import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuBarComponent } from '../menu-bar/menu-bar.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-home-layout',
  imports: [RouterOutlet, MenuBarComponent, ToastModule],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.scss',
})
export class HomeLayoutComponent {}
