import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { InputComponent } from "../input/input.component";
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'flex-otp-input',
  imports: [CommonModule],
  templateUrl: './otp-input.component.html',
  styleUrl: './otp-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpInputComponent),
      multi: true,
    },
  ],
})
export class OtpInputComponent {
  @Input() length: number = 6; // Number of OTP inputs
  @Input() disabled: boolean = false; // Disable the input fields
  // @Input() placeholder: string = '•'; // Placeholder for empty inputs

  @Input() placeholder: string = ''; // Placeholder for empty inputs
  @Input() className: string = '';
  @Output() otpChange: EventEmitter<string> = new EventEmitter<string>();

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  otpValues: string[] = Array(this.length).fill(''); // Array to hold OTP values

  // Callbacks for Angular Forms
  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  // Handle input change
  // onInput(event: Event, index: number): void {

  //   const target = event.target as HTMLInputElement;
  //   const value = target.value;

  //   if (value && value.length === 1) {
  //     this.otpValues[index] = value; // Set value
  //     this.emitOtp(); // Emit updated OTP
  //     if (index + 1 != this.length) {
  //       this.focusNextInput(index); // Focus on the next field
  //     }
  //   } else if (!value) {
  //     this.otpValues[index] = ''; // Clear value
  //     this.emitOtp(); // Emit updated OTP
  //   }
  // }

  onInput(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (value.length > 1) {
      // Only allow single character input
      target.value = value.charAt(0);
    }

    this.otpValues[index] = target.value; // Update the value for the specific index
    this.emitOtp(); // Emit the updated OTP
    this.onChange(this.otpValues.join('')); // Notify Angular Forms about the change
    this.onTouched();

    if (value && index < this.length - 1) {
      this.focusNextInput(index); // Move focus to the next input
    }
  }

  // Handle backspace
  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpValues[index] && index > 0) {
      this.focusPreviousInput(index); // Focus on the previous field
    }
  }

  // Focus on the next input field
  private focusNextInput(index: number): void {
    const inputsArray = this.otpInputs.toArray();
    const nextInput = inputsArray[index + 1].nativeElement;

    if (nextInput) {
      nextInput.focus(); // No need for `nativeElement`
    }
  }

  // Focus on the previous input field
  private focusPreviousInput(index: number): void {
    const inputsArray = this.otpInputs.toArray();
    const previousInput = inputsArray[index - 1].nativeElement;
    if (previousInput) {
      previousInput.focus(); // No need for `nativeElement`
    }
  }

  // Emit the OTP as a single string
  private emitOtp(): void {
    this.otpChange.emit(this.otpValues.join(''));
  }

  // Add trackBy function for performance and correct field tracking
  trackByIndex(index: number): number {
    return index;
  }

  // ControlValueAccessor Methods

  writeValue(value: string): void {
    if (value) {
      this.otpValues = value.split('').slice(0, this.length);
    } else {
      this.otpValues = Array(this.length).fill('');
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
