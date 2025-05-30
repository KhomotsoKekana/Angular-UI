import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../../../../ui/src/lib/spinner/spinner.component';
import { CodeBlockComponent } from '../../../../../ui/src/lib/code-block/code-block.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent,CodeBlockComponent],
  templateUrl: './spinner.component.html',
})
export class DocsSpinnerComponent {
  selectedSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  selectedColor: 'blue' | 'green' | 'red' | 'gray' | 'yellow' | 'primary' = 'blue';
  selectedSpeed: 'slow' | 'normal' | 'fast' = 'normal';
  selectedVariant: 'default' | 'linear' = 'default';
  
  sizes: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl'> = [
    'xs', 'sm', 'md', 'lg', 'xl'
  ];
  
  colors: Array<'blue' | 'green' | 'red' | 'gray' | 'yellow' | 'primary'> = [
    'blue', 'green', 'red', 'gray', 'yellow', 'primary'
  ];
  
  speeds: Array<'slow' | 'normal' | 'fast'> = [
    'slow', 'normal', 'fast'
  ];
  
  variants: Array<'default' | 'linear'> = [
    'default', 'linear'
  ];
  
  isLoading: boolean = true;
  
  toggleLoading(): void {
    this.isLoading = !this.isLoading;
  }
}