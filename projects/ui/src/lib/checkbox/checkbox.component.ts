import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() checked: boolean = false; // Checkbox state
  @Input() id: string = 'checkbox'; // Unique ID for the checkbox
  @Output() change = new EventEmitter<{ checked: boolean; }>(); // Emit changes to the parent component

  // Callbacks for ControlValueAccessor
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  // Handle checkbox change
  onChangeEvent(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.checked = isChecked;
    this.change.emit({ checked: this.checked }); // Emit the change as an object for $event.checked
    this.onChange(isChecked); // Notify Angular forms
    this.onTouched(); // Mark as touched
  }

  // For custom label click handling
  onLabelClick(): void {
    this.checked = !this.checked; // Toggle the checked state
    this.change.emit({ checked: this.checked }); // Emit the change as an object for $event.checked
    this.onChange(this.checked); // Notify Angular forms
    this.onTouched(); // Mark as touched
  }

  // ControlValueAccessor Methods
  writeValue(value: boolean): void {
    this.checked = value; // Update the checkbox state
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn; // Register change callback
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn; // Register touched callback
  }

  setDisabledState?(isDisabled: boolean): void {
    // Optionally handle the disabled state
  }
}