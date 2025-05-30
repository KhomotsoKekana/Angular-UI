import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../../../ui/src/lib/input/input.component';
import { CodeBlockComponent } from '../../../../../ui/src/lib/code-block/code-block.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent,CodeBlockComponent],
  templateUrl: './input.component.html',
})
export class DocsInputComponent {
  textValue = '';
  passwordValue = '';
  emailValue = '';
  numberValue: number | null = null;
  dateValue: Date | null = null;
  
  regexValue = '';
  emailRegex = {
    regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    message: 'Please enter a valid email address'
  };
  
  onInputChange(event: any) {
    console.log('Input changed:', event);
  }
}