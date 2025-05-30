import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IconComponent } from '../icons/icon.component';

@Component({
  selector: 'flex-avatar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css'
})
export class AvatarComponent {
  @Input() src?: string; // Image source
  @Input() alt: string = 'Avatar'; // Alternative text for accessibility
  @Input() size: 'sm' | 'md' | 'lg' = 'md'; // Size of the avatar
  @Input() name?: string; // Full name for fallback initials
  @Input() status?: 'online' | 'offline'; // Optional status indicator
  @Input() variant: 'primary' | 'secondary' | 'primaryGhost' = 'secondary'; // Color variant

  // Generate initials from the name
  get initials(): string {
    try {
      if (!this.name) return '';
      const nameParts = this.name.split(' ').filter(part => part);
      const getLetter = (part: string) => {
        const match = part?.match(/[A-Za-z]/);
        return match ? match[0] : '';
      };

      return nameParts.length > 1
        ? getLetter(nameParts[0]) + getLetter(nameParts[1])
        : getLetter(nameParts[0]);
    } catch (error) {
      console.error('Error generating initials:', error);
      return '';
    }
  }

  // Fallback to a default placeholder image on error
  onImageError(): void {
    this.src = 'https://via.placeholder.com/150';
  }
}
