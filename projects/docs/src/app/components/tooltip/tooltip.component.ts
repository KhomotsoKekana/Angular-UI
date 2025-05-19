import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipComponent } from '../../../../../ui/src/lib/tooltip/tooltip.component';
import { ButtonComponent } from '../../../../../ui/src/lib/button/button.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, TooltipComponent, ButtonComponent],
  templateUrl: './tooltip.component.html',
})
export class DocsTooltipComponent {
  selectedPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  selectedVariant: 'default' | 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success' = 'default';
  customBgColor: string = '#FFFFFF';
  customTextColor: string = '#000000';
  customMaxWidth: string = '200px';
  
  positions: Array<'top' | 'bottom' | 'left' | 'right'> = [
    'top', 'bottom', 'left', 'right'
  ];
  
  variants: Array<'default' | 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success'> = [
    'default', 'primary', 'secondary', 'ghost', 'outline', 'danger', 'success'
  ];
  
  // Helper method to control tooltip visibility in demos
  toggleTooltip(tooltip: TooltipComponent): void {
    tooltip.visible = !tooltip.visible;
  }
}