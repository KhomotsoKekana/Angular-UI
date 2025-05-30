import { Component, ElementRef, forwardRef, HostBinding, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../icons/icon.component';
import { ClassCombinePipe } from '../core/class-combine.pipe';

@Component({
  selector: 'flex-input',
  standalone: true,
  imports: [IconComponent, CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
    ClassCombinePipe
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() disabled: boolean = false;
  @Input() label: string = ''; // Input label
  @Input() type: string = 'text'; // Input type
  @Input() placeholder: string = ''; // Input placeholder
  @Input() value: string = ''; // Input value
  @Input() error: string | null = null; // Error message
  @Input() leadingIcon: string | null = null; // Optional leading icon
  @Input() leadingText: string | null = null; // Optional leading icon
  @Input() trailingIcon: string | null = null; // Optional trailing icon
  @Input() trailingButton: string | null = null; // Optional trailing button text
  @Input() trailingText: string | null = null; // Optional trailing button text
  @Input() enablePasswordReveal: boolean = false;
  @Input() class: string = ''
  @Input() innerClass: string = ''
  @Input() name: string = ''
  @Input() step: string = ''
  @Input() regex?: {
    regex: string;
    message: string;
  };

  @ViewChild('inputField') inputField!: ElementRef;

  public isFocused: boolean = false; // Track if the input is focused

  clickTimeout: any;

  constructor(private classCombinePipe: ClassCombinePipe) {

  }

  handleClick() {
    this.focusInput();

    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
      this.selectInputText(); // Handle double click
    } else {
      this.clickTimeout = setTimeout(() => {
        this.clickTimeout = null;
      }, 200);
    }
  }

  handleBlur() {
    try {
      this.isFocused = false;
      this.inputField.nativeElement.selectionStart = this.inputField.nativeElement.selectionEnd;
    } catch { }
  }

  focusInput() {
    this.inputField.nativeElement.focus();
    this.isFocused = true;
  }

  // Callbacks for Angular Forms
  private onChange: (value: string | number | Date) => void = () => { };
  private onTouched: () => void = () => { };

  isPasswordVisible: boolean = false;


  @HostBinding('class')
  get hostClasses(): string {
    const base = `relative flex flex-col gap-y-0.5`;
    const wrapper = `relative flex items-center text-sm rounded-xl`;
    return `${base} ${wrapper} ${this.class}`;
  }

  get innerClasses(): string {

    //shadow-xs 
    const base = `flex items-center sm:px-3 sm:py-2 px-2 py-1.5 text-sm bg-input border border-border hover:border-primary/50 transition-colors duration-300 shadow-black/5 rounded-md relative 
     focus-within:ring-0 focus-within:border-primary cursor-text focus-within:text-primary`;

    const disabledStyles = this.disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200' : '';

    let baseStyle = this.classCombinePipe.transform(base, disabledStyles);

    return this.classCombinePipe.transform(baseStyle, this.innerClass);

    // Combine filtered base classes, disabled styles with inner classes (with ! prefix)
    // return [
    //   ...finalAdditionClasses,
    //   ...filteredDisabledClasses,
    //   ...innerClasses.map(cls => cls ? `${cls}` : '').filter(cls => cls)
    // ].join(' ');
  }

  // Write a new value from the model to the view
  writeValue(value: any): void {
    if (this.type === 'date') {
      let date: Date;
      if (value instanceof Date) {
        date = value;
      } else if (typeof value === 'string') {
        date = new Date(value);
      }
      if (date! && !isNaN(date.getTime())) {
        this.value = date.toISOString().substring(0, 10);
      } else {
        this.value = '';
      }
    } else {
      this.value = value || '';
    }
  }

  // Register a callback when the value changes
  registerOnChange(fn: (value: string | number | Date) => void): void {
    this.onChange = fn;
  }

  // Register a callback for when the input is touched
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Handle input events
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;

    const convertedValue = this.type === 'date'
      ? new Date(target.value)
      : this.type === 'number'
        ? Number(target.value)
        : target.value;

    if (this.regex && this.regex.regex) {
      const pattern = new RegExp(String.raw`${this.regex.regex}`);


      if (target.value && !pattern.test(target.value)) {


        this.error = this.regex.message;
      } else {
        this.error = null;
      }
    }

    this.onChange(convertedValue); // Notify Angular Forms
    this.onTouched(); // Notify Angular Forms that the control has been touched
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;

    if (this.isPasswordVisible) {
      this.type = 'text'
    } else {
      this.type = 'password'
    }

  }

  selectInputText(): void {
    this.inputField.nativeElement.select();
    // this.inputWrapper.nativeElement.select();
  }

}
