import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'flex-modal-body',
    imports: [CommonModule],
    template: `
        <div class="p-3 w-full block text-foreground font-normal text-sm">
         <ng-content></ng-content>
        </div>
    `,
})
export class ModalBodyComponent {

}