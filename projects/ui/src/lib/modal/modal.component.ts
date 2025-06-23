import { CommonModule } from '@angular/common';
import { Component, ContentChildren, ElementRef, EventEmitter, HostListener, Input, Output, QueryList, Type, ViewChild, ViewContainerRef, AfterViewInit, ComponentRef } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { ClassCombinePipe } from '../core/class-combine.pipe';
import { ModalFooterComponent } from './v2/modal-footer.component';

@Component({
  selector: 'flex-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  providers: [ClassCombinePipe]
})
export class ModalComponent implements AfterViewInit {
  @Input() isOpen = false; // Controls modal visibility
  @Input() closeOnBackdrop = true; // Allows closing on backdrop click
  @Input() showCloseButton = true; // Displays the close button
  @Input() size: 'sm' | 'md' | 'lg' = 'md'; // Modal size
  @Input() ariaLabelledBy?: string; // ARIA label ID for accessibility
  @Input() modalClass: string = ''; // Custom modal class
  @Input() modalWidth: string = 'auto'; // Custom modal width
  @Input() modalHeight: string = 'auto'; // Custom modal width
  @Input() bodyClass: string = 'px-6 py-4'; // Custom body class
  @Input() allowClose: boolean = true;
  @Input() modalTransparent: boolean = false;
  @Input() backdropVariant: 'light' | 'dark' = 'dark'; // Backdrop variant

  // New dynamic content inputs
  @Input() contentComponent?: Type<any>;
  @Input() data?: any;

  @Output() isOpenChange = new EventEmitter<boolean>(); // Notify parent when modal opens/closes

  @ContentChildren('modal-header', { descendants: true }) modalHeaders!: QueryList<any>;
  @ContentChildren('modal-footer', { descendants: true }) modalFooters!: QueryList<any>;

  @ViewChild('dynamicContent', { read: ViewContainerRef }) dynamicContent!: ViewContainerRef;

  hasHeader = false; // Determines if the modal has a header slot
  hasFooter = false; // Determines if the modal has a footer slot

  // Store the component reference
  private contentComponentRef: ComponentRef<any> | null = null;

  constructor(private elementRef: ElementRef,
    private classCombine: ClassCombinePipe
  ) { }

  get finalModalClass() {

    let base = `relative rounded-md shadow-lg border bg-white transform transition-transform duration-300 overflow-auto ${this.modalWidth} ${this.modalHeight}`

    return this.classCombine.transform(base, this.modalClass)
  }


  ngAfterContentInit(): void {
    this.hasHeader = this.modalHeaders.length > 0;
    this.hasFooter = this.modalFooters.length > 0;
  }

  ngAfterViewInit(): void {
    // Dynamically load the provided content component if available
    if (this.contentComponent && this.dynamicContent) {
      this.contentComponentRef = this.dynamicContent.createComponent(this.contentComponent);
      if (this.data) {
        Object.assign(this.contentComponentRef.instance, this.data);
      }
    }
  }

  // Getter for the dynamic content component for the modal service
  get dynamicComponentRef(): ComponentRef<any> | null {
    return this.contentComponentRef;
  }

  closeModal(): void {
    // this.isOpen = false;
    this.isOpenChange.emit(false);
  }

  @HostListener('window:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    if (this.isOpen) {
      this.closeModal();
    }
  }

  @HostListener('document:focusin', ['$event'])
  trapFocus(event: FocusEvent): void {
    if (!this.isOpen) return;

    const modal = this.elementRef.nativeElement;
    if (!modal.contains(event.target)) {
      modal.querySelector('button, [href], input, select, textarea, [tabindex]').focus();
    }
  }
}
