import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'flex-dropdown-section',
  standalone: true,
  imports:[CommonModule],
  template: `
    <div>
      <div *ngIf="title" class="px-4 py-2 text-sm font-semibold text-gray-800">
        {{ title }}
      </div>
      <div>
        <ng-content></ng-content>
      </div>
      <hr *ngIf="showDivider" class="my-2 border-gray-300" />
    </div>
  `,
})
export class DropdownSectionComponent {
  @Input() title?: string;
  @Input() showDivider: boolean = false;
}