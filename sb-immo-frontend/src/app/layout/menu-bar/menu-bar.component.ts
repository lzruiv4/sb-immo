import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu-bar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss',
})
export class MenuBarComponent {
  menuItems = [
    { icon: 'pi-chart-line', path: '' },
    { icon: 'pi-user', path: '/contact' },
    { icon: 'pi-home', path: '/property' },
    { icon: 'pi-sitemap', path: '/propertyRecord' },
  ];
}
