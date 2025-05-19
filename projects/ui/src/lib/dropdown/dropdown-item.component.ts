import { CommonModule } from '@angular/common';
import { Component, Host, HostBinding, HostListener, Input, TemplateRef } from '@angular/core';
import { DropdownService } from './dropdown.service';
import { IconComponent } from '../icons/icon.component';

@Component({
  selector: 'app-dropdown-item',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `

  <ng-content></ng-content>
  <app-icon *ngIf="this.active" class="text-primary ms-auto h-4 w-4" icon="check"/>
        
  `,
})
export class DropdownItemComponent {
  @Input() label: string = '';
  @Input() description?: string;
  // @Input() shortcut?: string;
  @Input() startContent?: TemplateRef<any>;
  @Input() color?: string; // Additional styles for colors
  @Input() disabled?: boolean;
  @Input() active: boolean = false;
  @Input() class: string = '';

  @HostBinding('class')
  get hostClasses() {
    const disabledStyles = this.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

    const base = "flex relative w-full items-center px-2 py-1.5 sm:px-4 sm:py-2 gap-x-2 text-sm text-gray-700 cursor-pointer border-l-2";
    const stateStyles = this.active 
      ? "bg-primary/10 border-primary" 
      : "hover:bg-primary/10 border-transparent hover:border-primary";

    return `${base} ${stateStyles} ${disabledStyles} ${this.class}`;
  }

  constructor(private dropdownService: DropdownService) { }

  @HostListener('click')
  onClick() {
    this.dropdownService.onClick(this.label);
  }
}