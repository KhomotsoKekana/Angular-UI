import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioGroupComponent } from '../../../../../ui/src/lib/radio-group/radio-group.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RadioGroupComponent],
  templateUrl: './radio-group.component.html',
})
export class DocsRadioGroupComponent {
  selectedOption1: string = 'option1';
  selectedOption2: string = '';
  selectedSize: string = 'medium';
  selectedColor: string = 'orange';
  
  // Options for basic example
  options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];
  
  // Options for inline example
  inlineOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];
  
  // Options for color example
  colorOptions = [
    { value: 'red', label: 'Red' },
    { value: 'orange', label: 'Orange' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
    { value: 'purple', label: 'Purple' }
  ];
  
  // Options for disabled example
  disabledOptions = [
    { value: 'enabled1', label: 'Enabled option', disabled: false },
    { value: 'disabled1', label: 'Disabled option', disabled: true },
    { value: 'enabled2', label: 'Another enabled option', disabled: false }
  ];
  
  onSelectionChange(value: string): void {
    console.log('Selection changed:', value);
  }
}