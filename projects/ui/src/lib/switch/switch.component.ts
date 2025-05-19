import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.css'
})
export class SwitchComponent {
  @Input() checked: boolean = false; // Switch state
  @Input() disabled: boolean = false; // Disable interaction
  @Output() checkedChange = new EventEmitter<boolean>(); // Emit changes to parent

  toggleSwitch(): void {
    if (this.disabled) return; // Do nothing if disabled
    this.checked = !this.checked; // Toggle state
    this.checkedChange.emit(this.checked); // Emit updated state
  }
}
