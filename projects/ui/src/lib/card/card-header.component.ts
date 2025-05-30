import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'flex-card-header',
  standalone:true, 
  imports: [CommonModule],
  template: `
    <div
      [class]="class"
      [ngClass]="{
        'p-2 border-b border-gray-200 flex items-center relative': true
      }"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class CardHeaderComponent {
  @Input() class: string = '';
}