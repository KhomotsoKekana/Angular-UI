import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * Angular component that creates a customizable anchor/link element.
 * 
 * @input href - The URL that the hyperlink points to.
 * @input disabled - When true, disables the anchor, preventing clicks and showing a disabled style.
 * @input isExternal - When true, indicates that the link points to an external resource.
 * @input isUnderlined - When true, applies an underline style to the anchor text.
 * @input variant - Controls the color scheme of the anchor.
 */
@Component({
  selector: 'flex-anchor',
  imports: [CommonModule],
  templateUrl: './anchor.component.html',
  styleUrl: './anchor.component.css'
})

/*
TODO: AnchorComponent
 - Add external link icon when isExternal is true
*/

export class AnchorComponent {

  @Input() href: string = '';
  @Input() disabled: boolean = false;
  @Input() isExternal: boolean = false;
  @Input() isUnderlined: boolean = false;
  @Input() variant: 'info' | 'primary' | 'danger' | 'warning' | 'success' | 'neutral' = 'info';

  private readonly variantStyles = {
    info: 'text-info hover:text-info-hover',
    primary: 'text-primary hover:text-primary/80',
    neutral: 'text-foreground hover:text-foreground/80',
    danger: 'text-danger hover:text-danger-hover',
    warning: 'text-warning hover:text-warning-hover',
    success: 'text-success hover:text-success-hover',

  };

  getAnchorClasses(): Record<string, boolean> {
    // Common classes that are always applied
    const baseClasses = {
      'transition-colors duration-300 ease-in-out text-sm': true,
      'underline': this.isUnderlined,
      'cursor-pointer': !this.disabled,
      'cursor-not-allowed': this.disabled,
    };

    // Variant classes or disabled state
    const stateClasses = this.disabled 
      ? { 'text-gray-400 pointer-events-none': true }
      : this.variantStyles[this.variant].split(' ').reduce((acc, cls) => ({...acc, [cls]: true}), {});
    
    return { ...baseClasses, ...stateClasses };
  }



}
