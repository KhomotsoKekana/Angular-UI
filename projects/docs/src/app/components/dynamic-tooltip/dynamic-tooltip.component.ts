import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicTooltipComponent } from '../../../../../ui/src/lib/dynamic-tooltip/dynamic-tooltip.component';
import { DynamicTooltipTriggerComponent } from '../../../../../ui/src/lib/dynamic-tooltip/dynamic-tooltip-trigger.component';
import { DynamicTooltipContentComponent } from '../../../../../ui/src/lib/dynamic-tooltip/dynamic-tooltip-content.component';
import { ButtonComponent } from '../../../../../ui/src/lib/button/button.component'; // If you use flex-button or similar

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTooltipComponent,
    DynamicTooltipTriggerComponent,
    DynamicTooltipContentComponent,
    ButtonComponent // Ensure this is imported if used in the HTML template
  ],
  templateUrl: './dynamic-tooltip.component.html',
})
export class DocsDynamicTooltipComponent {
  // You can add properties here if you need to control aspects of the tooltips dynamically from the TS.
  // For example, to dynamically change tooltip text or settings.
}
