import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from '../../../../../ui/src/lib/checkbox/checkbox.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, CheckboxComponent],
  templateUrl: './checkbox.component.html',
})
export class DocsCheckboxComponent {
  checked = false;
  formModelValue = false;
  
  onCheckboxChange(event: { checked: boolean }) {
    console.log('Checkbox changed:', event.checked);
  }
}