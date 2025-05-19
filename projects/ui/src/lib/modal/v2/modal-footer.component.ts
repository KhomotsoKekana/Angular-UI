import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-modal-footer',
    imports: [CommonModule],
    template: `
        <div class="p-3 w-full flex items-center gap-2 justify-end text-base font-medium text-foreground">
         <ng-content></ng-content>
        </div>
    `,
})
export class ModalFooterComponent {

}