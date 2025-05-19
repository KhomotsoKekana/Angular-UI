import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { DropdownComponent } from './dropdown.component';

@Component({
  selector: 'app-dropdown-trigger',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class DropdownTriggerComponent {
  constructor(private dropdown: DropdownComponent) { }
 
}