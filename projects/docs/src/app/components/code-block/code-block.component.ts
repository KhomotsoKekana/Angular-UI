import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import {CodeBlockComponent} from '../../../../../ui/src/lib/code-block/code-block.component';
import { ButtonComponent } from '../../../../../ui/src/public-api';
import { TabGroupComponent } from '../../../../../ui/src/lib/tab-group/tab-group.component';


@Component({
  standalone:true,
  imports: [CodeBlockComponent,CommonModule, ButtonComponent,TabGroupComponent],
  templateUrl: './code-block.component.html',
})
export class DocsCodeBlockComponent {
  basicTabs = [
    {id: 'preview', label: 'Preview'},
    {id: 'code', label: 'Code'}
  ]

    demoTabs = [
    { id: 'general', label: 'General' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'developer', label: 'Developer' }
  ];

  activeTabId = 'preview';

  onTabChange(tab: any): void {
    console.log('Tab changed: ', tab);
    this.activeTabId = tab.id;
  }

  isDark = false;
  isPrimary = false;

  toggleDark() {
      this.isDark = !this.isDark;
  }
  togglePrimary() {
    this.isPrimary = !this.isPrimary;
  }
  
}
