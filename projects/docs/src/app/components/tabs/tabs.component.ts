import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from '../../../../../ui/src/lib/tabs/tabs.component';
import { TabContentComponent } from '../../../../../ui/src/lib/tabs/tab-content/tab-content.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, TabsComponent, TabContentComponent, FormsModule],
  templateUrl: './tabs.component.html',
})
export class DocsTabsComponent {
  currentTab = 0;
  selectedVariant: 'underline' | 'pill' | 'pill-square' | 'step' = 'underline';
  
  // Basic tabs
  basicTabs = [
    { key: 'account', label: 'Account' },
    { key: 'password', label: 'Password' },
    { key: 'settings', label: 'Settings' }
  ];
  
  // Tabs with icons
  iconTabs = [
    { key: 'profile', label: 'Profile', leadingIcon: 'user' },
    { key: 'notifications', label: 'Notifications', leadingIcon: 'bell' },
    { key: 'security', label: 'Security', leadingIcon: 'shield' }
  ];
  
  // Step tabs
  stepTabs = [
    { key: 'details', label: 'Details' },
    { key: 'address', label: 'Address' },
    { key: 'payment', label: 'Payment' },
    { key: 'confirm', label: 'Confirm' }
  ];
  
  // Grouped tabs
  groupedTabs = [
    { key: 'general', label: 'General', group: 'Main' },
    { key: 'appearance', label: 'Appearance', group: 'Main' },
    { key: 'advanced', label: 'Advanced', group: 'More' },
    { key: 'developer', label: 'Developer', group: 'More' }
  ];
}