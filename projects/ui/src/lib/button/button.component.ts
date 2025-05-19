import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { ClassCombinePipe } from '../core/class-combine.pipe';
import { IconComponent } from '../icons/icon.component';
import { ButtonDirective } from './button.directive';

@Component({
  selector: 'flex-button',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonDirective],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  providers: [ClassCombinePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: ButtonDirective,
      inputs: ['variant', 'size', 'disabled', 'loading', 'class', 'buttonContentPosition']
    }
  ]
})
export class ButtonComponent {
  @Input() variant: 'default' | 'primary' | 'primaryGhost' | 'secondary' | 'neutral' | 'ghost' | 'outline' | 'danger' | 'warning' | 'success' = 'default';
  @Input() size: 'xs' | 'small' | 'medium' | 'large' = 'small';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() class: string = '';
  @Input() buttonContentPosition: 'start' | 'center' | 'end' = 'center';
  @Input() type: 'button' | 'submit' | 'reset' = 'button'; // Default type is 'button'

  constructor() {}

  // The directive now handles the styling and animations
}
