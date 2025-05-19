import { CommonModule } from '@angular/common';
import { Component, ContentChild, ElementRef, Input, TemplateRef, ViewChild, Renderer2, AfterViewInit, OnDestroy, HostListener, OnChanges, SimpleChanges, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { PopoverTriggerComponent } from './popover-trigger.component';
import { PopoverContentComponent } from './popover-content.component';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { IconComponent } from '../icons/icon.component';

@Component({
  selector: 'app-popover',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.css'
})
export class PopoverComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  @Input() showCloseButton: boolean = false;
  @Input() showArrow: boolean = false;
  @Input() offset: number = 10; // Distance between trigger and content
  @Input() isOpen?: boolean; // Optional external control
  @Input() triggerId!: string; // ID of the trigger button
  @Input() backdropClose: boolean = true; // Close popover on backdrop click

  @Input() bgColor: string = '#FFFFFF'; // Tooltip background color (default white)

  @Input() disabled = false; // Disable the popover
  @Output() close = new EventEmitter<void>();
  @Output() open = new EventEmitter<void>();

  private triggerElement: HTMLElement | null = null;
  private overlayRef!: OverlayRef;
  private _isOpen: boolean = false; // Internal state if parent state is not provided

  public popoverWidth: number = 0;

  @ViewChild('trigger') trigger!: ElementRef; // Reference to the trigger element
  @ViewChild('content') content!: TemplateRef<any>; // Reference to the content element

  private scrollContainer!: HTMLElement | Window;
  private scrollListener!: () => void;
  private documentClickListener!: () => void;

  constructor(private renderer: Renderer2, private overlay: Overlay, private viewContainerRef: ViewContainerRef) { }

  // New getter: returns parent's isOpen if provided, else internal _isOpen.
  get effectiveIsOpen(): boolean {
    return this.isOpen !== undefined ? this.isOpen : this._isOpen;
  }

  ngAfterViewInit(): void {
    // Initialize if parent wants it open initially
    setTimeout(() => {
      if (this.isOpen) {
        this.openPopover();
      }
    });

    // Other initialization code...
    this.findTriggerElement();
    this.detectScrollContainer();
  }

  private findTriggerElement(): void {
    if (this.triggerId) {
      this.triggerElement = document.getElementById(this.triggerId);
    } else {
      this.triggerElement = this.trigger.nativeElement;
    }
  }

  ngOnDestroy(): void {
    // Remove listeners to prevent memory leaks
    if (this.scrollListener) this.scrollListener();
    if (this.documentClickListener) this.documentClickListener();
    this.closePopover(); // Ensure cleanup on destroy
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen !== undefined) {
      if (this.isOpen) {
        this.openPopover();
      } else {
        this.closePopover();
      }
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    if (this.effectiveIsOpen && this.overlayRef?.hasAttached()) {
      this.overlayRef.updatePosition(); // Use CDK's position update
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event): void {
    if (this.effectiveIsOpen && this.overlayRef?.hasAttached()) {
      this.overlayRef.updatePosition(); // Use CDK's position update
    }
  }

  detectScrollContainer(): void {
    try {
      let parent: HTMLElement | null = this.trigger.nativeElement.parentElement;
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
        if (this.effectiveIsOpen) {
          this.overlayRef.updatePosition();
        }
      });
    } catch (e) { }
  }

  get placementClass(): string {
    switch (this.placement) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2';
    }
  }

  updatePopoverPosition(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.updatePosition();
      return; // Already open and attached, just update position
    }

    this.findTriggerElement();
    if (!this.triggerElement || !this.content) return;

    const triggerRect = this.triggerElement.getBoundingClientRect();
    this.popoverWidth = triggerRect.width;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.triggerElement)
      .withPositions(this.getOverlayPosition())
      .withPush(true);

    // const positionStrategy = this.overlay
    //   .position()
    //   .flexibleConnectedTo(this.triggerElement)
    //   .withPositions([{
    //     originX: 'start',
    //     originY: 'bottom',
    //     overlayX: 'start',
    //     overlayY: 'top',
    //   }])
    //   .withPush(true)

    this.overlayRef = this.overlay.create({
      hasBackdrop: this.backdropClose,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });

    this.overlayRef.attach(new TemplatePortal(this.content, this.viewContainerRef));

    if (this.backdropClose) {
      this.overlayRef.backdropClick().subscribe(() => this.togglePopover());
    }

    this.open.emit();
  }

  openPopover(): void {
    if (this.disabled) return;

    // Only return early if overlay is already attached
    if (this.overlayRef?.hasAttached()) return;

    if (this.isOpen === undefined) { // internally-controlled
      this._isOpen = true;
    }
    this.updatePopoverPosition();
  }

  togglePopover(): void {
    if (this.disabled) return;

    if (this.effectiveIsOpen) {
      this.closePopover();
    } else {
      this.openPopover();
    }
  }

  emitToggleRequest(): void {
    if (this.disabled) return;

    if (this.effectiveIsOpen) {
      this.close.emit();
    } else {
      this.open.emit();
    }
  }

  closePopover(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
    if (this.isOpen === undefined) { // internally-controlled
      this._isOpen = false;
    }
    this.close.emit();
  }

  get arrowClasses(): string {
    switch (this.placement) {
      case 'top':
        return '-bottom-1 left-1/2 -translate-x-1/2';
      case 'bottom':
        return '-top-1 left-1/2 -translate-x-1/2';
      case 'left':
        return '-right-1 top-1/2 -translate-y-1/2';
      case 'right':
        return '-left-1 top-1/2 -translate-y-1/2';
      default:
        return '-bottom-1 left-1/2 -translate-x-1/2';
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
}
