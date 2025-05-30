import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'flex-divider',
  standalone: true,
  imports: [CommonModule],
  template: '',
  styleUrls: ['./divider.component.css'],
})
export class DividerComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal'; // Default orientation
  @Input() color: string = 'rgba(0, 0, 0, 0.1)'; // Default color
  @Input() class: string = ''; // Allow additional classes

  // Set base classes dynamically for the host element
  @HostBinding('class')
  get hostClasses(): string {
    const base = 'bg-gray-200'; // Default background color
    const orientationClass =
      this.orientation === 'horizontal' ? 'block w-full h-[1px]' : 'block h-full w-[2px]';
    return `${base} ${orientationClass} ${this.class}`;
  }

  // Bind dynamic inline styles for background color
  @HostBinding('style.backgroundColor')
  get backgroundColor(): string {
    return this.color;
  }
}