import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { TooltipModule } from '../tooltip/tooltip.module';
import { MainSidebarItem } from './main-sidebar.model';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleChanges, OnChanges } from '@angular/core';
import { IconComponent } from '../icons/icon.component';

@Component({
  selector: 'app-main-sidebar',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent, RouterLink, TooltipModule, TranslateModule],
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.css']
})
export class MainSidebarComponent implements OnInit, OnChanges {
  @Input() width: number = 256; // Full width
  @Input() collapsedWidth: number = 56; // Collapsed width
  @Input() disabled: boolean = false;
  @Input() navItems: MainSidebarItem[] = [];
  collapsed = true; // Tracks the expanded/collapsed state of the sidebar

  // Sample data for the sidebar
  user = {
    name: 'Brandon Bishop',
    email: 'brandon.bishop@aheeva.com',
    avatar: '/assets/avatar.jpg',
  };

  navMain: any[] = [

  ];

  constructor(private router: Router) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['navItems']) {
      const newNavItems: MainSidebarItem[] = changes['navItems'].currentValue;
      this.navMain.forEach(item => {
        const updatedItem = newNavItems.find(newItem => newItem.url === item.url);
        if (updatedItem) {
          item.badge = updatedItem.badge;
        }
      });
    }
  }


  ngOnInit(): void {

    this.navMain = this.navItems

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveNavItem(event.urlAfterRedirects);
      }
    });

    // Initialize the active item based on the current URL
    this.updateActiveNavItem(this.router.url);
  }

  updateActiveNavItem(currentUrl: string): void {

    this.navMain.forEach(item => {
      item.isActive = currentUrl.split('/')[1] === item.url.split('/')[1];
    });
  }

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }

  @Output() widthChange = new EventEmitter<number>();

  getCurrentWidth(): number {
    return this.collapsed ? this.collapsedWidth : this.width;
  }
}
