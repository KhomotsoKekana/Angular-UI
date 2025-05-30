import { Component } from '@angular/core';

@Component({
  selector: 'flex-header-left',
  standalone:true,
  template: `
    <div class="flex items-center gap-x-4 overflow-hidden h-14 p-1">
      <ng-content></ng-content>
    </div>
  `,
})
export class HeaderLeftComponent {}