import { ElementRef, EventEmitter, Input, Output, QueryList, TemplateRef, Directive } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { SelectItemComponent } from '../../select/select-item.component';
import { SelectSectionComponent } from '../../select/select-section.component';
import { SelectActionItemComponent } from '../../select/select-action-item.component';

@Directive()
export abstract class SelectBase implements ControlValueAccessor {
  @Input() placeholder: string = 'Select an option';
  @Input() enableSearch: boolean = false;
  @Input() isDynamicSearch: boolean = false;
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() innerClass: string = '';
  @Input() icon: string = '';
  @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  @Input() label: string = '';

  @Output() searchValueChange = new EventEmitter<string>();
  @Output() onClose = new EventEmitter<void>();

  searchQuery: string = '';
  
  abstract trigger: ElementRef;
  abstract menu: TemplateRef<any>;
  abstract searchInput: ElementRef;
  abstract sections: QueryList<SelectSectionComponent>;
  abstract items: QueryList<SelectItemComponent>;
  abstract actionItems: QueryList<SelectActionItemComponent>;

  // To be implemented by derivatives
  protected onChange: (value: any) => void = () => {};
  protected onTouched: () => void = () => {};
  protected _pendingValue: any = null;

  writeValue(value: any): void {
    this._pendingValue = value !== undefined && value !== null ? value : null;
    this.applyValueIfItemsLoaded();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Filter items based on search query
   */
  filterItems(): void {
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

  /**
   * Handle search input changes
   */
  onSearch(): void {
    this.searchValueChange.emit(this.searchQuery);
    this.filterItems();
  }

  /**
   * Apply value to component if items are already loaded
   */
  protected applyValueIfItemsLoaded(): void {
    if (this._pendingValue !== null && this.items && this.items.length > 0) {
      this.updateSelection(this._pendingValue);
      this._pendingValue = null;
    }
  }

  /**
   * Abstract method to be implemented by derivatives
   * Updates the selection based on the specified value
   */
  protected abstract updateSelection(value: any): void;
}
