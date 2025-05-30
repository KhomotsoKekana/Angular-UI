import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from '../icons/icon.component';

interface SubNavItem {
  url: string;
  isActive: boolean;
}

@Component({
  selector: 'flex-secondary-sidebar',
  standalone: true,
  templateUrl: './secondary-sidebar.component.html',
  styleUrls: ['./secondary-sidebar.component.css'],
  imports: [CommonModule, IconComponent, ButtonComponent, TranslateModule]
})
export class SecondarySidebarComponent implements OnInit {
  @Input() navItems: any[] = [];
  @Input() title: string = 'Settings'; // Default title

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveNavItems(event.urlAfterRedirects);
      }
    });

    // Initialize the active item based on the current URL
    this.updateActiveNavItems(this.router.url);
  }

  updateActiveNavItems(currentUrl: string): void {
    this.navItems.forEach(item => {
      item.isActive = item.url === currentUrl;
      if (item.subItems) {
        item.subItems.forEach((subItem: SubNavItem) => {
          subItem.isActive = currentUrl.includes(subItem.url);
          if (subItem.isActive) {
            item.isActive = true; // Ensure parent is active if any subItem is active
          }
        });
      }
    });
  }

  navigateTo(url: string): void {
    this.router.navigate([url]);
  }

  isActive(item: any): boolean {

    return item.subItems ? item.subItems.some((x: SubNavItem) => x.isActive) : item.isActive;

  }
}