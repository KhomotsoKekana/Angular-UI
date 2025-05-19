import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'; // Spinner size
  @Input() color: 'blue' | 'green' | 'red' | 'gray' | 'yellow' | 'primary' = 'blue'; // Spinner color
  @Input() speed: 'slow' | 'normal' | 'fast' = 'normal'; // Spin speed
  @Input() variant: 'default' | 'linear' = 'default'

  get sizeClass(): string {
    switch (this.size) {
      case 'xs':
        return 'h-4 w-4 border-[3px]';
      case 'sm':
        return 'h-6 w-6 border-[3px]';
      case 'lg':
        return 'h-16 w-16 border-[3px]';
      case 'xl':
        return 'h-24 w-24 border-[4px]';
      case 'md':
      default:
        return 'h-10 w-10 border-[3px]';
    }
  }

  get borderColorLinear(): string {
    return `border-${this.color} border-b-transparent border-l-transparent border-r-transparent`;
  }

  get borderColorDefault(): string {
    return `border-${this.color} border-b-gray-200 border-l-gray-200 border-r-gray-200`;
  }
  get speedClass(): string {
    switch (this.speed) {
      case 'slow':
        return 'animate-spin-slow';
      case 'fast':
        return 'animate-spin-fast';
      case 'normal':
      default:
        return 'animate-spin';
    }
  }
}
