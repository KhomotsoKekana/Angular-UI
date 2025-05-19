import { Component, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-popover-content',
  standalone: true,
  template: `<div class="h-full overflow-hidden flex flex-col">
    <ng-content></ng-content>
</div>`,
})
export class PopoverContentComponent {
}