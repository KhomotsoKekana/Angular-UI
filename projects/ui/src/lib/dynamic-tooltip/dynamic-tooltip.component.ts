import { OverlayRef, Overlay, OverlayPositionBuilder, ConnectedPosition } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, Input, HostListener, ElementRef, ViewChild, TemplateRef, ViewContainerRef, ContentChild } from '@angular/core';
import { DynamicTooltipTriggerComponent } from './dynamic-tooltip-trigger.component';
import { TooltipService } from './dynamic-tooltip.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-dynamic-tooltip',
    templateUrl: './dynamic-tooltip.component.html',
})
export class DynamicTooltipComponent {
    @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
    @Input() tooltipVariant: 'default' | 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success' = 'secondary';
    @Input() trigger: 'hover' | 'click' = 'hover';
    @Input() maxWidth: string = '300px';
    @Input() showDelay: number = 0; // milliseconds
    @Input() hideDelay: number = 50; // milliseconds



    @ContentChild(DynamicTooltipTriggerComponent, { read: ElementRef })
    triggerRef!: ElementRef;

    @ViewChild('tooltipContent', { static: true }) tooltipTemplateRef!: TemplateRef<any>;


    private overlayRef: OverlayRef | null = null;
    private isTooltipVisible = false;
    private showTimeoutId: any = null;
    private hideTimeoutId: any = null;
    private tooltipChangeSub?: Subscription;
    private tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

    constructor(private overlay: Overlay,
        private overlayPositionBuilder: OverlayPositionBuilder,
        private viewContainerRef: ViewContainerRef,
        private tooltipService: TooltipService
    ) { }

    ngOnInit() {
        this.tooltipChangeSub = this.tooltipService.tooltipChange$.subscribe(id => {
            // If this is our tooltip ID, it means another tooltip wants to show
            if (id === this.tooltipId) {
                this.immediatelyHideTooltip();
            }
        });
    }

    ngAfterViewInit() {
        // Set up event listeners on the trigger element
        if (this.trigger === 'hover') {
            this.triggerRef.nativeElement.addEventListener('mouseenter', () => this.showTooltip());
            this.triggerRef.nativeElement.addEventListener('mouseleave', () => this.hideTooltip());
        } else if (this.trigger === 'click') {
            this.triggerRef.nativeElement.addEventListener('click', () => this.toggleTooltip());
        }

    }

    ngOnDestroy() {
        this.disposeOverlay();
        if (this.tooltipChangeSub) {
            this.tooltipChangeSub.unsubscribe();
        }
    }

    private showTooltip() {
        // Clear any existing hide timeout
        if (this.hideTimeoutId) {
            clearTimeout(this.hideTimeoutId);
            this.hideTimeoutId = null;
        }

        // Set timeout for showing
        this.showTimeoutId = setTimeout(() => {
            if (this.isTooltipVisible) return;

            // Register this tooltip as active
            this.tooltipService.registerActiveTooltip(this.tooltipId);

            const positions = this.getOverlayPosition();

            const positionStrategy = this.overlayPositionBuilder
                .flexibleConnectedTo(this.triggerRef)
                .withPositions(positions)
                .withDefaultOffsetY(8)
                .withDefaultOffsetX(8)
                .withPush(true);

            this.overlayRef = this.overlay.create({
                positionStrategy,
                hasBackdrop: this.trigger === 'click',
                backdropClass: 'cdk-overlay-transparent-backdrop',
                panelClass: [`tooltip-panel-${this.tooltipVariant}`, 'advanced-tooltip'],
                scrollStrategy: this.overlay.scrollStrategies.reposition()
            });

            const portal = new TemplatePortal(this.tooltipTemplateRef, this.viewContainerRef);
            this.overlayRef.attach(portal);

            if (this.trigger === 'click') {
                this.overlayRef.backdropClick().subscribe(() => this.hideTooltip());
            }

            this.isTooltipVisible = true;

            this.showTimeoutId = null;

            // Add mouse events to the tooltip itself for hover persistence
            if (this.trigger === 'hover' && this.overlayRef) {
                const overlayElement = this.overlayRef.overlayElement;
                overlayElement.addEventListener('mouseenter', () => this.cancelHideTooltip());
                overlayElement.addEventListener('mouseleave', () => this.hideTooltip());
            }

        }, this.showDelay);
    }

    private hideTooltip() {
        // Clear any existing show timeout
        if (this.showTimeoutId) {
            clearTimeout(this.showTimeoutId);
            this.showTimeoutId = null;
        }

        // Set timeout for hiding
        this.hideTimeoutId = setTimeout(() => {
            this.immediatelyHideTooltip();
        }, this.hideDelay);
    }

    private immediatelyHideTooltip() {
        if (this.overlayRef) {
            this.overlayRef.detach();
            this.isTooltipVisible = false;
            this.tooltipService.deregisterActiveTooltip(this.tooltipId);
        }

        if (this.hideTimeoutId) {
            clearTimeout(this.hideTimeoutId);
            this.hideTimeoutId = null;
        }
    }

    private cancelHideTooltip() {
        if (this.hideTimeoutId) {
            clearTimeout(this.hideTimeoutId);
            this.hideTimeoutId = null;
        }
    }

    private toggleTooltip() {
        if (this.isTooltipVisible) {
            this.hideTooltip();
        } else {
            this.showTooltip();
        }
    }

    private disposeOverlay() {
        // Clear any pending timeouts
        if (this.showTimeoutId) {
            clearTimeout(this.showTimeoutId);
            this.showTimeoutId = null;
        }

        if (this.hideTimeoutId) {
            clearTimeout(this.hideTimeoutId);
            this.hideTimeoutId = null;
        }

        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }

    private getOverlayPosition(): ConnectedPosition[] {
        const positions: Record<string, ConnectedPosition[]> = {
            top: [
                {
                    originX: 'center',
                    originY: 'top',
                    overlayX: 'center',
                    overlayY: 'bottom',
                },
                // Fallback positions
                {
                    originX: 'center',
                    originY: 'bottom',
                    overlayX: 'center',
                    overlayY: 'top',
                }
            ],
            bottom: [
                {
                    originX: 'center',
                    originY: 'bottom',
                    overlayX: 'center',
                    overlayY: 'top',
                }
            ],
            left: [
                {
                    originX: 'start',
                    originY: 'center',
                    overlayX: 'end',
                    overlayY: 'center',
                }
            ],
            right: [
                {
                    originX: 'end',
                    originY: 'center',
                    overlayX: 'start',
                    overlayY: 'center',
                }
            ]
        };

        return positions[this.tooltipPosition] || positions['top'];
    }

    requiresXOffset() {
        return this.tooltipPosition === 'left' || this.tooltipPosition === 'right';
    }

    requiresYOffset() {
        return this.tooltipPosition === 'top' || this.tooltipPosition === 'bottom';
    }
}