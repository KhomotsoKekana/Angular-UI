import { CommonModule } from '@angular/common';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, Input, OnDestroy, Output, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { DropdownService } from './dropdown.service';

@Component({
  selector: 'flex-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
  // template: `<ng-content></ng-content>`
})
export class DropdownComponent implements AfterViewInit {
  @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  @Input() options: { label: string; value: any }[] = []; // Options for the dropdown
  @Input() placeholder: string = 'Select an option'; // Placeholder text
  @Input() disabled: boolean = false; // Disable dropdown
  @Input() dynamicLookup: boolean = false; // Enable dynamic lookup
  @Input() dynamicLookupLoading: boolean = false; // Loading state for dynamic lookup

  @Output() dynamicLookupValueChange = new EventEmitter<string>(); // Emits the value for dynamic lookup
  @Output() selectionChange = new EventEmitter<any>(); // Emits the selected value

  @ViewChild('trigger') trigger!: ElementRef;
  @ViewChild('menu', { static: true }) menu!: TemplateRef<any>;

  isOpen: boolean = false;

  private overlayRef!: OverlayRef;
  selectedOption?: { label: string; value: any };

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef, private dropdownService: DropdownService) { }


  ngAfterViewInit(): void {
    this.dropdownService.dropdownClicked$.subscribe(value => {
      
      if (value) {
        this.closeDropdown();;
      }

    });
  }

  toggleDropdown() {
    if (this.overlayRef) {
      this.closeDropdown();
      return;
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.trigger)
      .withPositions(this.getOverlayPosition());

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy,
    });

    this.overlayRef.attach(new TemplatePortal(this.menu, this.viewContainerRef));

    this.overlayRef.backdropClick().subscribe(() => this.closeDropdown());
  }

  selectOption(option: { label: string; value: any }) {
    this.selectedOption = option;
    this.selectionChange.emit(option.value);
    this.closeDropdown();
  }

  closeDropdown() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null!;
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

