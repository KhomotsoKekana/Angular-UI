import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'flex-modal-footer',
    imports: [CommonModule],
    template: `
        <div class="p-3 w-full bg-yellow-50 flex items-center gap-2 justify-end text-base font-medium text-foreground border-top-1">
         <ng-content></ng-content>
        </div>
    `,
})
export class ModalFooterComponent {

}