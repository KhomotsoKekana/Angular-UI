import { Component } from '@angular/core';
import { IconComponent } from '../icons/icon.component';

@Component({
  selector: 'app-dropdown-group-trigger',
  template: `
    <div class="flex relative w-full h-full items-center justify-between px-4 py-2 gap-x-2 text-sm text-gray-700 cursor-pointer hover:bg-primary/10 border-l-2 hover:text-primary border-transparent hover:border-primary">
     <div class="flex items-center gap-x-2"> <ng-content></ng-content></div>
      <app-icon icon="chevronRight" class="h-4 w-4"></app-icon>
    </div>
  `,
  imports: [IconComponent],
})
export class DropdownGroupTriggerComponent {}

//   @HostBinding('class') 
//   get hostClasses() 
//   {
//     let base = "flex relative w-full h-full items-center px-4 py-2 gap-x-2 text-sm text-gray-700 cursor-pointer hover:bg-cyan-50 rounded-lg";

//     return base + ' ' + this.class;
//   }
