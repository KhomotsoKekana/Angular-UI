import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkeletonComponent } from '../../../../../ui/src/lib/skeleton/skeleton.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonComponent],
  templateUrl: './skeleton.component.html',
})
export class DocsSkeletonComponent {
  isLoading = true;
  
  // Width options for the examples
  selectedWidth = 'w-full';
  
  // Height options for the examples
  selectedHeight = 'h-6';
  
  // Rounded options for the examples
  selectedRounded = 'rounded';
  
  // Toggle loading state demonstration
  toggleLoading(): void {
    this.isLoading = !this.isLoading;
  }
}