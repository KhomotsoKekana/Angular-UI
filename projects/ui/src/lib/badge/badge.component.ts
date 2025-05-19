import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css'
})
export class BadgeComponent {
  @Input() variant: 'success' | 'warning' | 'error' | 'neutral' | 'info' | 'primary' = 'neutral'; // Badge type
  @Input() size: 'xs'|'sm' | 'md' | 'lg' = 'sm'; // Badge size
  @Input() closable: boolean = false; // Whether the badge has a close button
  @Output() onClose = new EventEmitter<void>(); // Event emitted when the badge is closed
  @Input() isWrapper: boolean = false; // Whether the badge wraps a component
  @Input() text: string | number = ''; // Badge text

  closeBadge(event: Event): void {
    event.stopPropagation(); // Prevent triggering parent click handlers
    this.onClose.emit(); // Emit close event
  }
}
