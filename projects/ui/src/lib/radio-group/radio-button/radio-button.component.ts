import { Component, Input } from '@angular/core';
import { RadioGroupComponent } from '../radio-group.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-radio-button',
    templateUrl: './radio-button.component.html',
    standalone: true,
    imports: [CommonModule]
})
export class RadioButtonComponent {
    @Input() value: any; // Value of the radio button
    @Input() label: string = ''; // Label text
    @Input() description?: string; // Optional description
    @Input() disabled: boolean = false; // Disable radio button

    constructor(private radioGroup: RadioGroupComponent) { }

    // Check if this button is selected
    get checked(): boolean {
        return this.radioGroup.value === this.value;
    }

    // Select this option
    selectOption(): void {
        if (!this.disabled) {
            this.radioGroup.select(this.value);
        }
    }
}