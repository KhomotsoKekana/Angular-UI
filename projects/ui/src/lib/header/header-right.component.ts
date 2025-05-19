import { Component } from '@angular/core';

@Component({
  selector: 'app-header-right',
  standalone:true,
  template: `
    <div class="flex items-center justify-end gap-x-6">
      <ng-content></ng-content>
    </div>
  `,
})
export class HeaderRightComponent {}