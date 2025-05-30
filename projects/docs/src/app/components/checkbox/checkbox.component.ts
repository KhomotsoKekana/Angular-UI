import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from '../../../../../ui/src/lib/checkbox/checkbox.component';
import { CodeBlockComponent } from "../../../../../ui/src/lib/code-block/code-block.component";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, CheckboxComponent, CodeBlockComponent],
  templateUrl: './checkbox.component.html',
})
export class DocsCheckboxComponent {
  checked = false;
  formModelValue = false;
  
  onCheckboxChange(event: { checked: boolean }) {
    console.log('Checkbox changed:', event.checked);
  }
}