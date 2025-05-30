import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[flexDropdown]',
    standalone: true,
})
export class DropdownDirective implements AfterViewInit, OnDestroy {
    @Input() triggerElement!: ElementRef;
    @Input() dropdownTemplate!: TemplateRef<any>;
    @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
    @Input() disabled: boolean = false;
    @Input() keepOpenOnItemClick: boolean = false; // For multi-select, keep open after selection

    @Output() opened = new EventEmitter<void>();
    @Output() closed = new EventEmitter<void>();

    isOpen: boolean = false;
    overlayRef!: OverlayRef;
    menuWidth: number = 0;
    private backdropSubscription?: Subscription;
    private documentClickListener!: () => void;
    private scrollContainer!: HTMLElement | Window;
    private scrollListener!: () => void;

    constructor(
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef,
        private renderer: Renderer2,
        private elementRef: ElementRef
    ) { }

    ngAfterViewInit(): void {
        this.detectScrollContainer();
    }

    ngOnDestroy(): void {
        if (this.scrollListener) this.scrollListener();
        if (this.documentClickListener) this.documentClickListener();
        this.cleanUpSubscriptions();
        if (this.overlayRef) {
            this.overlayRef.dispose();
        }
    }

    toggle(): void {
        if (this.disabled) return;

        this.isOpen = !this.isOpen;

        if (this.overlayRef) {
            this.closeDropdown();
            return;
        }

        this.openDropdown();
    }

    openDropdown(): void {
        if (this.disabled || this.overlayRef) return;

        // Add click handler to close dropdown when clicking outside
        this.documentClickListener = this.renderer.listen(
            'document',
            'click',
            (event: MouseEvent) => {
                const target = event.target as HTMLElement;
                const clickedInside = this.triggerElement?.nativeElement.contains(target);
                const clickedOnMenu = this.overlayRef?.overlayElement?.contains(target);

                if (this.isOpen && !clickedInside && !clickedOnMenu) {
                    this.closeDropdown();
                }
            }
        );

        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(this.triggerElement)
            .withPositions(this.getOverlayPosition());

        const triggerRect = this.triggerElement.nativeElement.getBoundingClientRect();
        this.menuWidth = triggerRect.width;

        this.overlayRef = this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'cdk-overlay-transparent-backdrop',
            positionStrategy,
        });

        this.overlayRef.attach(new TemplatePortal(this.dropdownTemplate, this.viewContainerRef));
        this.backdropSubscription = this.overlayRef.backdropClick().subscribe(() => this.closeDropdown());

        this.opened.emit();
    }

    closeDropdown(): void {
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null!;
            this.isOpen = false;

            this.cleanUpSubscriptions();
            this.closed.emit();
        }
    }

    private cleanUpSubscriptions(): void {
        if (this.backdropSubscription) {
            this.backdropSubscription.unsubscribe();
            this.backdropSubscription = undefined;
        }
    }

    private getOverlayPosition(): ConnectedPosition[] {
        return {
            bottom: [{ originX: 'center' as 'center', originY: 'bottom' as 'bottom', overlayX: 'center' as 'center', overlayY: 'top' as 'top' }],
            top: [{ originX: 'center' as 'center', originY: 'top' as 'top', overlayX: 'center' as 'center', overlayY: 'bottom' as 'bottom' }],
            left: [{ originX: 'start' as 'start', originY: 'center' as 'center', overlayX: 'end' as 'end', overlayY: 'center' as 'center' }],
            right: [{ originX: 'end' as 'end', originY: 'center' as 'center', overlayX: 'start' as 'start', overlayY: 'center' as 'center' }],
        }[this.placement];
    }
    private detectScrollContainer(): void {
        try {
            let parent: HTMLElement | null = this.triggerElement.nativeElement.parentElement;
            while (parent) {
                const overflowY = window.getComputedStyle(parent).overflowY;
                if (overflowY === 'scroll' || overflowY === 'auto') {
                    this.scrollContainer = parent;
                    break;
                }
                parent = parent.parentElement;
            }

            // Default to window if no scrollable container found
            this.scrollContainer = this.scrollContainer || window;

            // Add scroll listener
            this.scrollListener = this.renderer.listen(this.scrollContainer, 'scroll', () => {
                if (this.isOpen && this.overlayRef?.hasAttached()) {
                    this.overlayRef.updatePosition();
                }
            });
        } catch (e) { }
    }
}
