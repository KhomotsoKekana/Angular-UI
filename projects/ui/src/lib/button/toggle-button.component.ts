import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClassCombinePipe } from '../core/class-combine.pipe';
import { IconComponent } from '../icons/icon.component';
import { ButtonDirective } from './button.directive';

export type ButtonStyle = 'solid' | 'outline';
export type ButtonVariant = 'default' | 'primary' | 'primaryGhost' | 'secondary' | 'neutral' | 'ghost' | 'outline' | 'danger' | 'warning' | 'success';

@Component({
  selector: 'flex-toggle-button',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonDirective],
  template: `
    <div class="flex items-center relative"
         [class]="class"
         [class.opacity-50]="disabled">
      <button 
        #buttonElement
        [attr.aria-pressed]="checked" 
        [attr.disabled]="disabled ? true : null"
        [type]="type"
        flexButtonBase
        [variant]="getVariant()"
        [size]="size"
        [disabled]="disabled"
        [class]="getButtonClasses()"
        (click)="onToggle()">
        <flex-icon *ngIf="loading" icon="loading" class="animate-spin rounded-full h-4 w-4" />
        <ng-content></ng-content>
      </button>
    </div>
  `,
  styleUrl: './button.component.css',
  providers: [ClassCombinePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleButtonComponent implements OnInit {
  @Input() checked: boolean = false;
  @Input() size: 'xs' | 'small' | 'medium' | 'large' = 'small';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() class: string = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant?: ButtonVariant;
  @Input() activeVariant: ButtonVariant = 'primary';
  @Input() inactiveVariant: ButtonVariant = 'ghost';
  @Input() shape: 'rounded' | 'full' = 'rounded';
  @Input() activeStyle: ButtonStyle = 'solid';
  @Input() inactiveStyle: ButtonStyle = 'solid';

  @Output() checkedChange = new EventEmitter<boolean>();
  
  constructor(
    private classCombinePipe: ClassCombinePipe,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    // If a single variant is provided, use it for both active and inactive states
    if (this.variant) {
      this.activeVariant = this.variant;
      this.inactiveVariant = this.variant;
      
      // When using a single variant, inactive state should be more subtle
      this.activeStyle = 'solid';
      this.inactiveStyle = 'outline';
    }
  }

  getButtonClasses(): string {
    // Shape classes
    const shapeClasses = this.shape === 'full' ? 'rounded-full' : 'rounded-md';
    
    // Handle width stability - prevent the button from changing width when toggled
    const widthClass = 'w-auto';
    
    // Base classes for transition with fixed width to prevent stuttering
    const baseClasses = `transition-all duration-300 ${shapeClasses} ${widthClass}`;
    
    return this.classCombinePipe.transform(baseClasses, '');
  }

  // Helper method to determine variant based on checked state and style
  getVariant(): ButtonVariant {
    const variant = this.checked ? this.activeVariant : this.inactiveVariant;
    const style = this.checked ? this.activeStyle : this.inactiveStyle;
    
    if (style === 'solid') {
      return variant;
    } else if (style === 'outline') {
      if (variant === 'primary') return 'outline';
      if (variant === 'danger') return 'outline'; // We'll need custom color handling
      if (variant === 'success') return 'outline'; // We'll need custom color handling
      if (variant === 'warning') return 'outline'; // We'll need custom color handling
      return 'outline';
    }
    
    return variant;
  }

  onToggle(): void {
    if (!this.disabled && !this.loading) {
      this.checked = !this.checked;
      this.checkedChange.emit(this.checked);
    }
  }
}