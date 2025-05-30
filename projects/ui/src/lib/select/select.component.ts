import { AfterViewInit, Component, ContentChildren, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, Output, QueryList, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { SelectItemComponent } from './select-item.component';
import { CommonModule } from '@angular/common';
import { SelectSectionComponent } from './select-section.component';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { SelectActionItemComponent } from './select-action-item.component';
import { Subscription } from 'rxjs';
import { IconComponent } from '../icons/icon.component';
import { ClassCombinePipe } from '../core/class-combine.pipe';

@Component({
  selector: 'flex-select',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectItemComponent, IconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    },
    ClassCombinePipe
  ]
})
export class SelectComponent implements AfterViewInit, OnDestroy {
  @Input() placeholder: string = 'Select an option';
  @Input() enableSearch: boolean = false; // Enables the search bar
  @Input() isDynamicSearch: boolean = false; // Enables dynamic search
  @Input() loading: boolean = false; // Loading state
  @Input() disabled: boolean = false; // Disables the dropdown
  @Input() innerClass: string = ''; // Inner class
  @Input() icon: string = ''; // Icon name
  @Output() selectionChange = new EventEmitter<any>();

  @Output() searchValueChange = new EventEmitter<any>(); // Add change event emitter
  @Output() change = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();
  @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  @Input() label: string = ''; // Label for the select component

  isOpen: boolean = false; // Dropdown state
  selectedItem: any = null; // Tracks selected item
  searchQuery: string = ''; // Search term for filtering
  @ViewChild('trigger') trigger!: ElementRef; // Reference to the trigger element
  @ViewChild('menu') menu!: TemplateRef<any>; // Reference to the dropdown menu
  @ViewChild('searchInput') searchInput!: ElementRef; // Reference to the search input


  @ContentChildren(SelectSectionComponent)
  sections!: QueryList<SelectSectionComponent>; // For sections

  @ContentChildren(SelectItemComponent, { descendants: true })
  items!: QueryList<SelectItemComponent>; // For standalone items
  @ContentChildren(SelectActionItemComponent, { descendants: true })
  actionItems!: QueryList<SelectActionItemComponent>; // For standalone items

  private scrollContainer!: HTMLElement | Window;
  private scrollListener!: () => void;
  private documentClickListener!: () => void;
  position = { top: 0, left: 0 };
  menuWidth: number = 0;
  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };
  private overlayRef!: OverlayRef;
  private searchDebounce: any;

  private backdropSubscription?: Subscription;
  private itemSubscriptions: Subscription[] = [];
  private actionItemSubscriptions: Subscription[] = [];
  private _pendingValue: any = null;


  get innerClasses(): string {
    //shadow-xs shadow-black/5
    const base = `flex items-center text-sm bg-input border border-border hover:bg-input/50  rounded-md relative 
      cursor-pointer`;

    const disabledStyles = this.disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none hover:bg-gray-200' : '';

    const openStyles = this.isOpen ? 'border border-primary' : '';

    let baseStyles = this.classCombinePipe.transform(this.classCombinePipe.transform(base, disabledStyles), openStyles);

    return this.classCombinePipe.transform(baseStyles, this.innerClass);
  }

  toggleDropdown(): void {

    this.isOpen = !this.isOpen;

    if (this.overlayRef) {
      this.closeDropdown();
      return;
    }

    // Ensure previous subscriptions are unsubscribed
    this.cleanUpSubscriptions();

    // Add click handler to close dropdown when clicking outside
    this.documentClickListener = this.renderer.listen(
      'document',
      'click',
      (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const clickedInside = this.trigger.nativeElement.contains(target);
        const clickedOnMenu = this.overlayRef?.overlayElement?.contains(target);

        if (this.isOpen && !clickedInside && !clickedOnMenu) {
          this.closeDropdown();
        }
      }
    );

    if (this.isOpen && this.enableSearch) {
      setTimeout(() => {
        // Wait for overlay to be fully rendered before focusing
        const searchInput = this.searchInput?.nativeElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100); // Add a small delay to ensure the overlay is fully rendered
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.trigger)
      .withPositions(this.getOverlayPosition());

    const triggerRect = this.trigger.nativeElement.getBoundingClientRect();
    this.menuWidth = triggerRect.width;

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy,
    });

    this.overlayRef.attach(new TemplatePortal(this.menu, this.viewContainerRef));

    this.backdropSubscription = this.overlayRef.backdropClick().subscribe(() => this.closeDropdown());


    if (this.isOpen) {

      this.items.forEach(item => {
        const sub = item.select.subscribe(() => this.selectItem(item));
        this.itemSubscriptions.push(sub);
      });

      this.items.changes.subscribe(() => {
        this.items.forEach(item => {
          const sub = item.select.subscribe(() => this.selectItem(item));
          this.itemSubscriptions.push(sub);
        });
      });

      this.actionItems.forEach(item => {
        const sub = item.select.subscribe(() => {
          this.closeDropdown();
        });
        this.actionItemSubscriptions.push(sub);
      });

      this.actionItems.changes.subscribe(() => {
        this.actionItems.forEach(item => {
          const sub = item.select.subscribe(() => {
            this.closeDropdown();
          });
          this.actionItemSubscriptions.push(sub);
        });
      });
    }
  }

  selectItem(item: any): void {

    const text = item.label ? item.label : item.elementRef.nativeElement.textContent.trim().toLowerCase();

    this.selectedItem = {
      key: item.key,
      text,
    };

    this.items.forEach(i => i.selected = false); // Deselect all items
    item.selected = true; // Select the clicked item

    this.closeDropdown(); // Close the dropdown
    this.onChange(item.key); // Update ngModel
    this.onTouched(); // Mark the control as touched
    this.selectionChange.emit({ value: item.key }); // Emit the selected key
    this.change.emit({ value: item.key }); // Emit change event

    // this.change.emit(item); // Emit change event

  }

  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this._pendingValue = value; // Store for later if needed

      // If items have loaded, update the selection immediately
      if (this.items && this.items.length > 0) {
        this.updateSelection(value);
      }
      // Note: We'll handle the case where items don't exist in ngAfterContentInit
    } else {
      this._pendingValue = null;
      this.selectedItem = null;
      if (this.items) {
        this.items.forEach(item => item.selected = false);
      }
    }
  }

  private updateSelection(value: any): void {
    // Find the item that matches the value
    this.items.forEach(i => i.selected = false); // Deselect all items
    this.selectedItem = this.items.find(item => item.key === value) || null;
    if (this.selectedItem) {
      this.selectedItem.selected = true;
      // Safely get the text from the element's native element once it is available
      const textContent = this.selectedItem.elementRef.nativeElement.textContent;
      this.selectedItem.text = this.selectedItem.label ? this.selectedItem.label : textContent ? textContent.trim().toLowerCase() : '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }


  constructor(private renderer: Renderer2, public elementRef: ElementRef, private overlay: Overlay, private viewContainerRef: ViewContainerRef, public classCombinePipe: ClassCombinePipe) { }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    if (this.scrollListener) this.scrollListener();
    if (this.documentClickListener) this.documentClickListener();
    this.cleanUpSubscriptions();
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }
  }


  ngAfterContentInit(): void {
    // Apply any pending selection value from writeValue
    if (this._pendingValue !== null && this.items && this.items.length > 0) {
      this.updateSelection(this._pendingValue);
      this._pendingValue = null;
    }

    // Set up subscription to handle both initial load and changes
    this.items.changes.subscribe(() => {
      this.filterItems();

      // Apply pending value when items change or become available
      if (this._pendingValue !== null && this.items.length > 0) {
        this.updateSelection(this._pendingValue);
        this._pendingValue = null;
      }

      this.items.forEach(item => {
        item.select.subscribe(() => this.selectItem(item));
      });
    });
  }

  filterItems() {

    if (!this.items || this.isDynamicSearch) return;

    let hasVisibleItems = false;

    this.items.forEach(item => {
      const text = item.elementRef.nativeElement.textContent.trim().toLowerCase();
      const query = this.searchQuery.trim().toLowerCase();

      // Set the hidden property based on whether it matches the search query
      item.hidden = !text.includes(query);

      // Track if we have any visible items
      if (!item.hidden) {
        hasVisibleItems = true;
      }

      // Apply display style directly to handle layout
      if (item.elementRef && item.elementRef.nativeElement) {
        item.elementRef.nativeElement.style.display = item.hidden ? 'none' : '';
      }
    });
  }

  onSearch() {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.searchValueChange.emit(this.searchQuery);
    }, 300);
  }

  closeDropdown() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null!;
      this.isOpen = false;
      this.searchQuery = '';
      setTimeout(() => this.onClose.emit(), 250)

      this.cleanUpSubscriptions();
    }
  }

  private cleanUpSubscriptions(): void {
    if (this.backdropSubscription) {
      this.backdropSubscription.unsubscribe();
      this.backdropSubscription = undefined;
    }
    this.itemSubscriptions.forEach(sub => sub.unsubscribe());
    this.itemSubscriptions = [];
    this.actionItemSubscriptions.forEach(sub => sub.unsubscribe());
    this.actionItemSubscriptions = [];
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
