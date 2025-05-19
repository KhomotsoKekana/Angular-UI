import { Directive, Input, ElementRef, Renderer2, HostListener, ComponentFactoryResolver, ViewContainerRef, ComponentRef, OnInit, OnDestroy } from '@angular/core';
import { Overlay, OverlayRef, OverlayPositionBuilder, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TooltipComponent } from './tooltip.component';

@Directive({
    selector: '[appTooltip]'
})
export class TooltipDirective implements OnDestroy {
    @Input('appTooltip') text: string = '';
    @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
    @Input() tooltipVariant: 'default' | 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success' = 'secondary';
    @Input() trigger: 'hover' | 'click' = 'hover';
    @Input() bgColor: string = '#FFFFFF';
    @Input() textColor: string = '#000000';
    @Input() maxWidth: string = '200px';
    @Input() debugPosition = false;


    private overlayRef!: OverlayRef;
    private tooltipComponentRef!: ComponentRef<TooltipComponent>;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private overlay: Overlay,
        private overlayPositionBuilder: OverlayPositionBuilder
    ) { }

    private isTooltipHiddenByClick = false;

    @HostListener('mouseenter') onMouseEnter() {
        if (this.trigger === 'hover' && !this.isTooltipHiddenByClick) {
            this.showTooltip();
        }
    }

    @HostListener('mouseleave') onMouseLeave() {
        if (this.trigger === 'hover') {
            this.hideTooltip();
            this.isTooltipHiddenByClick = false;
        }
    }

    @HostListener('click') onClick() {
        if (this.tooltipComponentRef?.instance.visible) {
            this.hideTooltip();
            this.isTooltipHiddenByClick = true;
        }
    }

    ngOnDestroy(): void {
        this.hideTooltip(); // Ensure tooltip is hidden when the directive is destroyed
    }


    private showTooltip() {
        const positions = this.getOverlayPosition();

        const positionStrategy = this.overlayPositionBuilder
            .flexibleConnectedTo(this.el)
            .withPositions(positions)
            .withDefaultOffsetY(8)
            .withDefaultOffsetX(0)
            .withPush(true)
            .withFlexibleDimensions(true);

        this.overlayRef = this.overlay.create({
            positionStrategy,
            hasBackdrop: this.trigger === 'click',
            backdropClass: 'cdk-overlay-transparent-backdrop',
            panelClass: 'tooltip-panel',
            scrollStrategy: this.overlay.scrollStrategies.reposition()
        });

        // this.overlayRef.backdropClick().subscribe(() => this.closeDropdown());


        // In your positioning logic
        if (this.debugPosition) {
            console.log('Element rect:', this.el.nativeElement.getBoundingClientRect());
            console.log('Overlay position:', this.overlayRef.getConfig().positionStrategy);
        }

        // Subscribe to position changes
        positionStrategy.positionChanges.subscribe(change => {
            if (this.tooltipComponentRef) {
                // Map CDK position to our position type
                const positionMap: { [key: string]: 'top' | 'bottom' | 'left' | 'right' } = {
                    'top bottom': 'top',
                    'bottom top': 'bottom',
                    'start end': 'left',
                    'end start': 'right'
                };
                const key = `${change.connectionPair.originY} ${change.connectionPair.overlayY}`;
                this.tooltipComponentRef.instance.position = positionMap[key] || this.tooltipPosition;
            }
        });

        const tooltipPortal = new ComponentPortal(TooltipComponent);
        this.tooltipComponentRef = this.overlayRef.attach(tooltipPortal);

        // Set tooltip properties
        Object.assign(this.tooltipComponentRef.instance, {
            text: this.text,
            position: this.tooltipPosition,
            bgColor: this.bgColor,
            textColor: this.textColor,
            maxWidth: this.maxWidth,
            visible: true,
            variant: this.tooltipVariant
        });
    }

    private hideTooltip() {
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.tooltipComponentRef.instance.visible = false;
        }
    }

    private toggleTooltip() {
        if (this.tooltipComponentRef && this.tooltipComponentRef.instance.visible) {
            this.hideTooltip();
        } else {
            this.showTooltip();
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
                    offsetY: -8
                },
                // Fallback positions
                {
                    originX: 'center',
                    originY: 'bottom',
                    overlayX: 'center',
                    overlayY: 'top',
                    offsetY: 8
                }
            ],
            bottom: [
                {
                    originX: 'center',
                    originY: 'bottom',
                    overlayX: 'center',
                    overlayY: 'top',
                    offsetY: 8
                }
            ],
            left: [
                {
                    originX: 'start',
                    originY: 'center',
                    overlayX: 'end',
                    overlayY: 'center',
                    offsetX: -8,
                    offsetY: 0
                }
            ],
            right: [
                {
                    originX: 'end',
                    originY: 'center',
                    overlayX: 'start',
                    overlayY: 'center',
                    offsetX: 8,
                    offsetY: 0
                }
            ]
        };

        return positions[this.tooltipPosition] || positions['top'];
    }
}