import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopoverComponent } from '../../../../../ui/src/lib/popover/popover.component';
import { PopoverTriggerComponent } from '../../../../../ui/src/lib/popover/popover-trigger.component';
import { PopoverContentComponent } from '../../../../../ui/src/lib/popover/popover-content.component';
import { ButtonComponent } from '../../../../../ui/src/lib/button/button.component';
import { IconComponent } from '../../../../../ui/src/lib/icons/icon.component';
import { CodeBlockComponent } from '../../../../../ui/src/lib/code-block/code-block.component';

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    PopoverComponent, 
    PopoverTriggerComponent, 
    PopoverContentComponent,
    ButtonComponent,
    IconComponent,
    CodeBlockComponent
  ],
  templateUrl: './popover.component.html',
})
export class DocsPopoverComponent {
  // Control state for examples
  basicPopoverOpen = false;
  placementPopoverOpen = false;
  customizedPopoverOpen = false;
  
  // Selected value for placement demo
  selectedPlacement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  
  // Toggle for showing/hiding arrows
  showArrow = true;
  
  // Toggle for close button visibility
  showCloseButton = false;
  
  // Control backdrop closing behavior
  backdropClose = true;
  
  // Example event handlers
  onPopoverOpen() {
    console.log('Popover opened');
  }
  
  onPopoverClose() {
    console.log('Popover closed');
  }
}