import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'flex-card-body',
  standalone:true,
  imports: [CommonModule],
  template: `
    <div
      [class]="class"
      [ngClass]="{
        'p-2': true
      }"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class CardBodyComponent {
  @Input() class: string = '';
}