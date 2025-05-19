import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-modal-header',
    imports: [CommonModule],
    template: `
        <div class="p-3 w-full flex items-center text-base font-medium {{getVariantClass()}}">
         <ng-content></ng-content>
        </div>
    `,
})
export class ModalHeaderComponent {

    @Input() variant: 'default' | 'warning' | 'success' | 'danger' = 'default'


    getVariantClass() {
        switch (this.variant) {
            case 'warning':
                return 'text-warning';
            case 'success':
                return 'text-success';
            case 'danger':
                return 'text-destructive';
            default:
                return 'text-foreground';
        }
    }

}