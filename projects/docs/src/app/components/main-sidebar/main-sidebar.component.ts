import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainSidebarComponent as UiMainSidebarComponent } from '../../../../../ui/src/lib/main-sidebar/main-sidebar.component'; // Assuming library path
import { TranslateModule } from '@ngx-translate/core';
import { MainSidebarItem } from '../../../../../ui/src/lib/main-sidebar/main-sidebar.model';
import { CodeBlockComponent } from "../../../../../ui/src/lib/code-block/code-block.component";

@Component({
  selector: 'app-doc-main-sidebar',
  standalone: true,
  imports: [CommonModule, UiMainSidebarComponent, TranslateModule, CodeBlockComponent],
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.css']
})
export class MainSidebarDocumentationComponent {
  basicNavItems: MainSidebarItem[] = [
    { title: 'SIDEBAR.DASHBOARD', url: '/components/main-sidebar', icon: 'layoutDashboard', isActive: true, allowMobile: true },
    { title: 'SIDEBAR.REPORTS', url: '/components/main-sidebar', icon: 'fileAnalytics', isActive: false, allowMobile: true },
    { title: 'SIDEBAR.SETTINGS', url: '/components/main-sidebar', icon: 'settings', isActive: false, allowMobile: true, position: 'bottom' },
    { title: 'SIDEBAR.HIDDEN_ITEM', url: '/components/main-sidebar', icon: 'eyeOff', isActive: false, allowMobile: false, hidden: true },
    { title: 'SIDEBAR.WITH_BADGE', url: '/components/main-sidebar', icon: 'mail', isActive: false, allowMobile: true, badge: 5 },
  ];

  // Simulate translation for the documentation page
  // In a real app, these would come from translation files
  translations: any = {
    'SIDEBAR.DASHBOARD': 'Dashboard',
    'SIDEBAR.REPORTS': 'Reports',
    'SIDEBAR.SETTINGS': 'Settings',
    'SIDEBAR.HIDDEN_ITEM': 'Hidden Item',
    'SIDEBAR.WITH_BADGE': 'Messages',
    'SIDEBAR.TOGGLE_SIDEBAR': 'Toggle Sidebar'
  };

  // Mock translate pipe for documentation purposes
  public translate(key: string): string {
    return this.translations[key] || key;
  }
}
