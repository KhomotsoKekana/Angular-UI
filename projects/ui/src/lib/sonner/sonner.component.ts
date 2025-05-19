import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SonnerService } from './sonner.service';

@Component({
  selector: 'flex-sonner',
  standalone: true,
  imports: [CommonModule],
  template: '', // Empty template as we're using overlay
  styleUrl: './sonner.component.css'
})
export class SonnerComponent {
  private sonnerService = inject(SonnerService);
  
  // showToast(message: string, description?: string) {
  //   return this.sonnerService.showToast(message, description);
  // }
  
  // showSuccess(message: string, description?: string) {
  //   return this.sonnerService.showSuccess(message, description);
  // }
  
  // showError(message: string, description?: string) {
  //   return this.sonnerService.showError(message, description);
  // }
  
  // showWarning(message: string, description?: string) {
  //   return this.sonnerService.showWarning(message, description);
  // }
  
  // showInfo(message: string, description?: string) {
  //   return this.sonnerService.showInfo(message, description);
  // }
  
  dismissAll() {
    this.sonnerService.dismissAll();
  }
}
