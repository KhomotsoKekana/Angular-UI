import { Component } from '@angular/core';
import { DropdownComponent } from './dropdown.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports:[CommonModule],
  template: `
      <ng-content></ng-content>
  `,
})
export class DropdownMenuComponent {
  constructor(public dropdown: DropdownComponent) {}
}