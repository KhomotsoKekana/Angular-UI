import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondarySidebarComponent as UiSecondarySidebarComponent } from '../../../../../ui/src/lib/secondary-sidebar/secondary-sidebar.component'; // Adjusted path
import { TranslateModule } from '@ngx-translate/core'; // Assuming you use ngx-translate
import { RouterModule } from '@angular/router'; // For routerLink in examples
import { IconComponent } from '../../../../../ui/src/lib/icons/icon.component'; // If icons are used in examples directly
import { ButtonComponent } from '../../../../../ui/src/lib/button/button.component'; // If buttons are used in examples directly
import { CodeBlockComponent } from '../../../../../ui/src/lib/code-block/code-block.component';

@Component({
  selector: 'flex-doc-secondary-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Added for routerLink in example templates
    UiSecondarySidebarComponent,
    TranslateModule,
    // IconComponent, // Added if needed for examples
    // ButtonComponent, // Added if needed for examples
    CodeBlockComponent
  ],
  templateUrl: './secondary-sidebar.component.html',
  // styleUrls: ['./secondary-sidebar.component.css'] // Add if specific styles are needed
})
export class SecondarySidebarDocumentationComponent {
  // Mock data for navItems examples
  basicNavItems = [
    { title: 'Profile', url: '/components/secondary-sidebar/profile', icon: 'user', isActive: false, subItems: [] },
    { title: 'Account', url: '/components/secondary-sidebar/account', icon: 'settings', isActive: true, subItems: [] },
    { title: 'Appearance', url: '/components/secondary-sidebar/appearance', icon: 'eye', isActive: false, subItems: [] }
  ];

  navItemsWithSub = [
    {
      title: 'General Settings',
      url: '/components/secondary-sidebar/general',
      icon: 'settingsCog',
      isActive: false,
      subItems: [
        { title: 'Language', url: '/components/secondary-sidebar/general/language', isActive: false },
        { title: 'Timezone', url: '/components/secondary-sidebar/general/timezone', isActive: false }
      ]
    },
    {
      title: 'User Management',
      url: '/components/secondary-sidebar/users',
      icon: 'users',
      isActive: true,
      subItems: [
        { title: 'All Users', url: '/components/secondary-sidebar/users/all', isActive: true },
        { title: 'Roles', url: '/components/secondary-sidebar/users/roles', isActive: false },
        { title: 'Permissions', url: '/components/secondary-sidebar/users/permissions', isActive: false }
      ]
    },
    { title: 'Billing', url: '/components/secondary-sidebar/billing', icon: 'creditCard', isActive: false, subItems: [] }
  ];

  // Mock translate pipe for documentation display if needed, or rely on TranslateModule
  translations: any = {
    'SIDEBAR.PROFILE': 'Profile',
    'SIDEBAR.ACCOUNT': 'Account Settings',
    'SIDEBAR.APPEARANCE': 'Appearance',
    'SIDEBAR.GENERAL': 'General Settings',
    'SIDEBAR.LANGUAGE': 'Language',
    'SIDEBAR.TIMEZONE': 'Timezone',
    'SIDEBAR.USERS': 'User Management',
    'SIDEBAR.ALL_USERS': 'All Users',
    'SIDEBAR.ROLES': 'Roles',
    'SIDEBAR.PERMISSIONS': 'Permissions',
    'SIDEBAR.BILLING': 'Billing',
    'CUSTOM_TITLE': 'My Sidebar Title'
  };

  public translate(key: string): string {
    return this.translations[key] || key;
  }

  constructor() {}

  // Helper for example interactivity if needed
  toggleActive(item: any, items: any[]): void {
    items.forEach(i => i.isActive = false);
    item.isActive = true;
    if (item.subItems && item.subItems.length > 0) {
      // Optionally activate the first sub-item or handle as needed
    }
  }

  toggleSubItemActive(subItem: any, parentItem: any, allItems: any[]): void {
    allItems.forEach(p => {
      if (p.subItems) {
        p.subItems.forEach((si: any) => si.isActive = false);
      }
      // Deactivate parent if it's not the current parent
      if (p !== parentItem) p.isActive = false;
    });
    parentItem.isActive = true;
    subItem.isActive = true;
  }
}
