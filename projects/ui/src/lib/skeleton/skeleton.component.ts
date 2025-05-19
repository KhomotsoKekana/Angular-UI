import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.css'
})
export class SkeletonComponent {
  @Input() class: string = ''; // Accept custom Tailwind classes
  @Input() type: 'donut-chart' | 'default' = 'default'

  get defaultClasses(): string {
    return 'bg-gray-300 animate-pulse';
  }
}
