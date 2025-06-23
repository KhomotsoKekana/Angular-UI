import { Component, ViewChild, ContentChild, ElementRef, AfterViewInit, AfterContentInit, Input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { TabGroupComponent } from '../tab-group/tab-group.component';

@Component({
  selector: 'flex-code-block',
  imports: [MatTabsModule, CommonModule, TabGroupComponent],
  templateUrl: './code-block.component.html',
})
export class CodeBlockComponent  {
  @ViewChild('previewContainer', { static: false }) previewContainer!: ElementRef;

  basicTabs = [
    { id: 'preview', label: 'Preview' },
    { id: 'code', label: 'Code' }
  ];

  activeTabId = 'preview';

  showCode = false;
  isDark = false;
  isPrimary = false;
  
  @Input() code: string = ''
  copySuccess = false;

  constructor(private host: ElementRef) {}

  onTabChange(tab: any): void {
    console.log('Tab changed: ', tab);
    this.activeTabId = tab.id;
  }

  toggleCode() {
    this.showCode = !this.showCode;
  }

  toggleDark() {
    this.isDark = !this.isDark;
  }

  togglePrimary() {
    this.isPrimary = !this.isPrimary;
  }

  copyCode() {
    navigator.clipboard.writeText(this.code).then(() => {
      this.copySuccess = true;
      setTimeout(() => this.copySuccess = false, 1500);
    }).catch(err => {
      console.error('Failed to copy code', err);
    });
  }


}
