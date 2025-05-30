import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'flex-card-footer',
  standalone:true,
  imports: [CommonModule],
  template: `
    <div
      [class]="class"
      [ngClass]="{
        'p-4 w-full border-t border-gray-200': true,
        'backdrop-blur-sm': isBlurred
      }"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class CardFooterComponent {
  @Input() class: string = '';
  @Input() isBlurred: boolean = false;
}