import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-radio-group',
  standalone: true,
  imports: [],
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.css'
})
export class RadioGroupComponent {
  @Input() value: any; // Selected value
  @Output() valueChange = new EventEmitter<any>(); // Emit changes to parent

  // Handle selection
  select(value: any): void {
    this.value = value;
    this.valueChange.emit(this.value); // Emit updated value
  }
}
