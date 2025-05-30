import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'flex-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css'],
  animations: [
    trigger('tooltipAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('150ms ease-out',
          style({ opacity: 1, transform: 'scale(1)' })
        )
      ]),
      transition(':leave', [
        animate('100ms ease-in',
          style({ opacity: 0, transform: 'scale(0.8)' })
        )
      ])
    ])
  ]
})
export class TooltipComponent {
  @Input() text: string = ''; // Tooltip text
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'top'; // Tooltip position
  @Input() bgColor: string = '#FFFFFF'; // Tooltip background color (default white)
  @Input() textColor: string = '#000000'; // Tooltip text color (default black)
  @Input() maxWidth: string = '200px'; // Maximum tooltip width (default)
  @Input() variant: 'default' | 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success' = 'default'; // Default variant
  visible: boolean = false; // Tooltip visibility

  get variantClasses(): string {
    switch (this.variant) {
      case 'primary':
        return 'bg-primary border-primary text-white';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground';
      case 'ghost':
        return 'bg-gray-100 text-gray-800';
      case 'outline':
        return 'bg-white border border-gray-200 text-gray-800';
      case 'danger':
        return 'bg-red-500 border-red-500 text-white';
      case 'success':
        return 'bg-green-500 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  }

  get arrowClasses(): string {
    switch (this.position) {
      case 'top':
        return '-bottom-1 left-1/2 -translate-x-1/2 border-r border-b';
      case 'bottom':
        return '-top-1 left-1/2 -translate-x-1/2 border-l border-t';
      case 'left':
        return '-right-1 top-1/2 -translate-y-1/2 border-t border-r';
      case 'right':
        return '-left-1 top-1/2 -translate-y-1/2 border-l border-b';
      default:
        return '-bottom-1 left-1/2 -translate-x-1/2';
    }
  }
}