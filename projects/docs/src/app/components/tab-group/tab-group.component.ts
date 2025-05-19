import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabGroupComponent } from '../../../../../ui/src/lib/tab-group/tab-group.component';
import { IconComponent } from '../../../../../ui/src/lib/icons/icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, TabGroupComponent, IconComponent],
  templateUrl: './tab-group.component.html',
})
export class DocsTabGroupComponent {
  // Basic tab configuration
  basicTabs = [
    { id: 'account', label: 'Account' },
    { id: 'password', label: 'Password' },
    { id: 'settings', label: 'Settings' }
  ];
  
  // Tabs with icons
  iconTabs = [
    { id: 'profile', label: 'Profile', icon: 'user' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'security', label: 'Security', icon: 'shield' }
  ];
  
  // Sample tabs for orientation/variant demos
  demoTabs = [
    { id: 'general', label: 'General' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'developer', label: 'Developer' }
  ];
  
  // Selected variant for the demo
  selectedVariant: 'default' | 'minimal' | 'button' | 'pills' | 'underlined' = 'default';
  selectedOrientation: 'horizontal' | 'vertical' = 'horizontal';
  
  // Active tab ID for each demo section
  activeTabId = 'account';
  activeIconTabId = 'profile';
  activeVariantTabId = 'general';
  activeOrientationTabId = 'general';
  
  // Handle tab change events
  onTabChange(tab: any): void {
    console.log('Tab changed:', tab);
  }
}