import { Component } from '@angular/core';

@Component({
  selector: 'flex-header-center',
  standalone:true,
  template: `
    <div class="flex items-center justify-center gap-x-4">
      <ng-content></ng-content>
    </div>
  `,
})
export class HeaderCenterComponent {}