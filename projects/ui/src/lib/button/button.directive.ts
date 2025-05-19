import { Directive, Input, HostBinding, ElementRef, Renderer2, HostListener } from '@angular/core';
import { ClassCombinePipe } from '../core/class-combine.pipe';

type ButtonVariant = 'default' | 'primary' | 'primaryGhost' | 'secondary' | 'neutral' | 'ghost' | 'outline' | 'danger' | 'warning' | 'success';
type ButtonSize = 'xs' | 'small' | 'medium' | 'large';

@Directive({
  selector: '[flexButtonBase]',
  standalone: true,
  providers: [ClassCombinePipe],
})
export class ButtonDirective {
  @Input() variant: ButtonVariant = 'default';
  @Input() size: ButtonSize = 'small';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() buttonContentPosition: 'start' | 'center' | 'end' = 'center';
  @Input() class: string = '';
  
  isClicked = false; // Tracks whether the button is clicked
  private cachedClasses: string | null = null;
  private previousInputs: any = {};

  constructor(
    private elementRef: ElementRef, 
    private renderer: Renderer2,
    private classCombinePipe: ClassCombinePipe
  ) {}

  // Dynamically compute classes
  @HostBinding('class')
  get classes(): string {
    // Check if inputs changed
    const currentInputs = {
      variant: this.variant,
      size: this.size,
      disabled: this.disabled,
      loading: this.loading,
      class: this.class,
      isClicked: this.isClicked
    };

    if (this.cachedClasses &&
      JSON.stringify(currentInputs) === JSON.stringify(this.previousInputs)) {
      return this.cachedClasses;
    }

    const base = `inline-flex relative items-center justify-center font-medium focus:outline-none transition-colors duration-300 ease-in-out gap-2`;
    const variants: Record<string, string> = {
      neutral: "bg-card hover:bg-secondary text-foreground border border-muted-foreground",
      success: "bg-success hover:bg-success-hover text-success-foreground",
      default: "bg-zinc-900 hover:bg-zinc-700 text-primary-foreground focus:ring-2 focus:ring-slate-400",
      primary: 'bg-primary hover:bg-primary/50 hover:border-transparent text-primary-foreground border border-primary/50',
      secondary: 'bg-gray-200 text-foreground hover:bg-gray-300 focus:ring-2 focus:ring-gray-400',
      danger: 'bg-danger text-primary-foreground hover:bg-danger-hover',
      warning: 'bg-warning text-primary-foreground hover:bg-warning-hover',
      ghost: 'bg-transparent text-foreground shadow-none hover:bg-gray-200 focus:ring-2 focus:ring-gray-400',
      outline: 'bg-transparent text-foreground border shadow-none hover:bg-gray-200 focus:ring-2 focus:ring-gray-400',
      primaryGhost: 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/10'
    };

    const sizes: Record<string, string> = {
      xs: 'text-xs py-0.5 px-2 sm:h-7',
      small: 'text-sm py-1.5 px-3 sm:h-9',
      medium: 'text-base py-3 px-3 h-10',
      large: 'text-lg py-4 px-8 h-12',
    };

    const disabledStyles = this.disabled || this.loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer';
    const clickedStyle = this.isClicked ? 'rounded-2xl' : 'rounded-md';

    let finalClass = `${base} ${variants[this.variant]} ${sizes[this.size]} ${disabledStyles}`;
    finalClass = `${finalClass} ${clickedStyle}`;

    this.previousInputs = { ...currentInputs };
    const transformedClass = this.classCombinePipe.transform(finalClass, this.class);
    this.cachedClasses = transformedClass;
    return transformedClass;
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.isClicked = true; // Add the 'rounded-full' style
      setTimeout(() => {
        this.isClicked = false; // Revert back after a short delay
      }, 200); // Adjust duration as needed
    }
  }
}