// src/app/components/custom-modal-container/custom-modal-container.component.ts
import { Component, ViewChild, ChangeDetectionStrategy, HostListener, ContentChildren } from '@angular/core';
import { CdkDialogContainer, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { CdkPortalOutlet, PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { backdropFade, materialModal } from '../../lib/animations';
import { ModalHeaderComponent } from './modal-header.component';



@Component({
    selector: 'flex-custom-modal-container',
    templateUrl: './modal.component.html',
    // Add Tailwind classes directly in the template
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,       // Example using standalone component
    imports: [PortalModule, CommonModule], // Import PortalModule for CdkPortalOutlet,
    animations: [backdropFade, materialModal], // Include animations
})
export class CustomModalContainerComponent extends CdkDialogContainer {
    // Inject DialogRef to allow the container itself to close the dialog
    // This is useful for backdrop clicks or close buttons within the container's template
    constructor(
        public dialogRef: DialogRef<any>, // Generic type, or match content component's close type
        public config: DialogConfig      // Inject DialogConfig if needed (e.g., for disableClose)
    ) {
        super();
    }

    // CdkPortalOutlet is where the actual modal content component will be rendered
    @ViewChild(CdkPortalOutlet, { static: true }) portalOutlet!: CdkPortalOutlet;

    @ViewChild(ModalHeaderComponent, { static: true }) modalHeader?: ModalHeaderComponent;

    // Method to close the dialog from the container (e.g., close button)
    close(): void {
        this.dialogRef.close();
    }

    // Optional: Close on backdrop click (if not disabled)
    onBackdropClick(): void {
        if (!this.config.disableClose && !this.dialogRef.disableClose) {
            this.dialogRef.close('testing');
        }
    }
}