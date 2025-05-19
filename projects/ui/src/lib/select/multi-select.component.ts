import { AfterContentInit, AfterViewInit, Component, ContentChildren, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, Output, QueryList, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { SelectItemComponent } from './select-item.component';
import { CommonModule } from '@angular/common';
import { SelectSectionComponent } from './select-section.component';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IconComponent } from '../icons/icon.component';
import { ClassCombinePipe } from '../core/class-combine.pipe';
import { DropdownDirective } from '../core/dropdown/dropdown.directive';
import { SelectBase } from '../core/select/select-base.model';
import { SelectActionItemComponent } from './select-action-item.component';
import { Overlay } from '@angular/cdk/overlay';
import { ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectItemComponent, IconComponent, DropdownDirective],
  template: `
    <div #trigger class="relative w-full flex flex-col gap-y-1">
      <!-- Label -->
      <label *ngIf="label" class="text-xs font-medium text-foreground select-none antialiased">
        {{ label }}
      </label>

      <!-- Trigger Button -->
      <div [class]="innerClasses">
        <div class="px-2">
          <app-icon *ngIf="icon" [icon]="icon" class="h-3 w-3 text-muted-foreground"></app-icon>
        </div>
        <div 
          *ngIf="!enableSearch || (enableSearch && !isOpen)"
          class="flex items-center justify-between pe-3 sm:py-2 py-1.5 w-full h-full" 
          (click)="toggleDropdown()">
          <span *ngIf="selectedItems.length === 0 && !loading"
            class="text-gray-600 text-xs w-full text-start select-none flex items-center gap-2">
            {{ placeholder}}
          </span>
          <span *ngIf="selectedItems.length === 0 && loading" class="flex items-center gap-0.5 text-muted-foreground text-sm">
            <span class="animate-bounce [animation-delay:-0.3s]">.</span>
            <span class="animate-bounce [animation-delay:-0.15s]">.</span>
            <span class="animate-bounce">.</span>
          </span>
          <span *ngIf="selectedItems.length > 0"
            class="text-foreground font-normal text-xs capitalize w-full text-start select-none flex items-center gap-2">
            {{ selectedItemsText }}
          </span>
          <svg class="w-4 h-4 text-gray-500 absolute right-2 transition-all duration-150" 
               xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path class="transition-all duration-200" stroke-linecap="round" stroke-linejoin="round" 
                  [attr.d]="isOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'" />
          </svg>
        </div>

        <!-- Search input when search is enabled and dropdown is open -->
        <input *ngIf="enableSearch && isOpen" type="text" 
               class="pe-3 py-2 w-full h-full rounded-md outline-none border border-transparent text-xs"
               #searchInput [(ngModel)]="searchQuery" (input)="onSearch()" 
               placeholder="Search..." (click)="$event.stopPropagation()" />
      </div>

      <!-- Dropdown Menu -->
      <ng-template #menu>
        <div
          class="bg-white border border-border my-2 rounded shadow-surround max-h-60 overflow-y-auto px-0"
          [ngClass]="{
            'animate-slide-down':placement === 'bottom',
            'animate-slide-up':placement === 'top'
          }"
          [style.width.px]="menuWidth">
          <ng-content></ng-content>
          
          <!-- Selected Items Actions -->
          <div class="border-t border-border p-2 flex justify-between">
            <button 
              class="text-xs text-primary hover:underline cursor-pointer"
              (click)="selectAll()"
              [class.text-gray-400]="maxSelection !== null && items.length > maxSelection"
              [title]="maxSelection !== null && items.length > maxSelection ? 'Limited by maxSelection: ' + maxSelection : ''">
              Select All
            </button>
            <button 
              *ngIf="selectedItems.length > 0"
              class="text-xs text-red-500 hover:underline cursor-pointer"
              (click)="clearSelection()">
              Clear Selection
            </button>
          </div>
        </div>
      </ng-template>

      <!-- Dropdown Directive -->
      <div appDropdown
           [triggerElement]="this.trigger"
           [dropdownTemplate]="menu"
           [placement]="placement"
           [disabled]="disabled"
           [keepOpenOnItemClick]="true"
           (opened)="onDropdownOpen()"
           (closed)="onDropdownClose()">
      </div>
    </div>
  `,
  styles: [`
    .animate-slide-down {
      animation: slideDown 0.2s ease-out;
    }
    
    .animate-slide-up {
      animation: slideUp 0.2s ease-out;
    }
    
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    },
    ClassCombinePipe
  ]
})
export class MultiSelectComponent extends SelectBase implements AfterViewInit, AfterContentInit, OnDestroy {
  @Input() maxSelectionDisplay: number = 2; // Max number of selected items to display before showing "+X more"
  @Input() maxSelection: number | null = null; // Max number of items that can be selected, null for unlimited
  
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() change = new EventEmitter<any[]>();
  
  isOpen: boolean = false;
  selectedItems: Array<{key: any, text: string}> = [];
  menuWidth: number = 0;
  
  @ViewChild('trigger') override trigger!: ElementRef;
  @ViewChild('menu') override menu!: TemplateRef<any>;
  @ViewChild('searchInput') override searchInput!: ElementRef;
  @ViewChild(DropdownDirective) dropdown!: DropdownDirective;
  
  @ContentChildren(SelectSectionComponent)
  override sections!: QueryList<SelectSectionComponent>;

  @ContentChildren(SelectItemComponent, { descendants: true })
  override items!: QueryList<SelectItemComponent>;
  
  @ContentChildren(SelectActionItemComponent, { descendants: true })
  override actionItems!: QueryList<SelectActionItemComponent>;

  private itemSubscriptions: Subscription[] = [];
  private actionItemSubscriptions: Subscription[] = [];
  private searchDebounce: any;

  constructor(
    private renderer: Renderer2, 
    public elementRef: ElementRef, 
    private overlay: Overlay, 
    private viewContainerRef: ViewContainerRef,
    public classCombinePipe: ClassCombinePipe
  ) { 
    super();
  }

  get innerClasses(): string {
    const base = `flex items-center text-sm bg-input border border-border hover:bg-input/50 rounded-md relative 
      cursor-pointer`;

    const disabledStyles = this.disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none hover:bg-gray-200' : '';
    const openStyles = this.isOpen ? 'border border-primary' : '';

    let baseStyles = this.classCombinePipe.transform(this.classCombinePipe.transform(base, disabledStyles), openStyles);
    return this.classCombinePipe.transform(baseStyles, this.innerClass);
  }

  get selectedItemsText(): string {
    if (this.selectedItems.length === 0) return '';
    
    if (this.selectedItems.length <= this.maxSelectionDisplay) {
      return this.selectedItems.map(item => item.text).join(', ');
    } else {
      return `${this.selectedItems.slice(0, this.maxSelectionDisplay).map(item => item.text).join(', ')} +${this.selectedItems.length - this.maxSelectionDisplay} more`;
    }
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    
    if (this.dropdown) {
      this.dropdown.toggle();
      this.isOpen = this.dropdown.isOpen;
      
      if (this.isOpen && this.enableSearch) {
        setTimeout(() => {
          const searchInput = this.searchInput?.nativeElement;
          if (searchInput) {
            searchInput.focus();
          }
        }, 100);
      }
      
      if (this.isOpen) {
        this.setupItemSubscriptions();
      }
    }
  }

  onDropdownOpen(): void {
    this.isOpen = true;
    const triggerRect = this.trigger.nativeElement.getBoundingClientRect();
    this.menuWidth = triggerRect.width;
    this.setupItemSubscriptions();
  }

  onDropdownClose(): void {
    this.isOpen = false;
    this.searchQuery = '';
    this.onClose.emit();
    this.cleanUpSubscriptions();
  }

  toggleItem(item: any): void {
    if (this.disabled || item.disabled) return;

    const text = item.label ? item.label : item.elementRef.nativeElement.textContent.trim().toLowerCase();
    const key = item.key;
    
    const index = this.selectedItems.findIndex(i => i.key === key);
    
    if (index >= 0) {
      // Already selected, remove it
      this.selectedItems.splice(index, 1);
      item.selected = false;
    } else {
      // Not selected, add it if we haven't reached max selection
      if (this.maxSelection === null || this.selectedItems.length < this.maxSelection) {
        this.selectedItems.push({ key, text });
        item.selected = true;
      }
    }
    
    // Update form control value
    this.onChange(this.selectedItems.map(item => item.key));
    this.onTouched();
    
    // Emit events
    this.selectionChange.emit(this.selectedItems.map(item => item.key));
    this.change.emit(this.selectedItems.map(item => item.key));
  }

  selectAll(): void {
    if (this.disabled) return;
    
    // Filter visible and non-disabled items
    const selectableItems = this.items.filter(item => !item.hidden && !item.disabled);
    
    // Apply max selection if needed
    const itemsToSelect = this.maxSelection !== null 
      ? selectableItems.slice(0, this.maxSelection) 
      : selectableItems;
    
    // Clear current selection
    this.clearSelection();
    
    // Select items
    itemsToSelect.forEach(item => {
      const text = item.label ? item.label : item.elementRef.nativeElement.textContent.trim().toLowerCase();
      this.selectedItems.push({ key: item.key, text });
      item.selected = true;
    });
    
    // Update form control value
    this.onChange(this.selectedItems.map(item => item.key));
    this.onTouched();
    
    // Emit events
    this.selectionChange.emit(this.selectedItems.map(item => item.key));
    this.change.emit(this.selectedItems.map(item => item.key));
  }

  clearSelection(): void {
    // Deselect all items
    this.items?.forEach(item => item.selected = false);
    this.selectedItems = [];
    
    // Update form control value
    this.onChange(this.selectedItems.map(item => item.key));
    this.onTouched();
    
    // Emit events
    this.selectionChange.emit(this.selectedItems.map(item => item.key));
    this.change.emit(this.selectedItems.map(item => item.key));
  }

  override onSearch(): void {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.searchValueChange.emit(this.searchQuery);
      this.filterItems();
    }, 300);
  }

  protected override updateSelection(values: any[]): void {
    if (!Array.isArray(values)) {
      console.error('MultiSelect expects an array of values');
      return;
    }
    
    // Reset selection
    this.selectedItems = [];
    this.items?.forEach(item => item.selected = false);
    
    if (values.length === 0) return;
    
    // Update selected items and selection state
    values.forEach(value => {
      const item = this.items?.find(i => i.key === value);
      if (item) {
        const text = item.label ? item.label : item.elementRef.nativeElement.textContent.trim().toLowerCase();
        this.selectedItems.push({ key: value, text });
        item.selected = true;
      }
    });
  }

  ngAfterViewInit(): void {
    // Initialization code if needed
  }

  ngAfterContentInit(): void {
    // Apply any pending selection from writeValue
    this.applyValueIfItemsLoaded();

    // Setup item subscriptions
    this.items.changes.subscribe(() => {
      this.filterItems();
      this.applyValueIfItemsLoaded();
    });
  }

  ngOnDestroy(): void {
    this.cleanUpSubscriptions();
  }

  private setupItemSubscriptions(): void {
    this.cleanUpSubscriptions();
    
    // Subscribe to item selections
    this.items.forEach(item => {
      const sub = item.select.subscribe(() => this.toggleItem(item));
      this.itemSubscriptions.push(sub);
    });

    // Subscribe to item changes
    const changeSub = this.items.changes.subscribe(() => {
      this.items.forEach(item => {
        const sub = item.select.subscribe(() => this.toggleItem(item));
        this.itemSubscriptions.push(sub);
      });
    });
    this.itemSubscriptions.push(changeSub);

    // Subscribe to action items
    this.actionItems.forEach(item => {
      const sub = item.select.subscribe(() => {
        this.dropdown?.closeDropdown();
      });
      this.actionItemSubscriptions.push(sub);
    });

    // Subscribe to action item changes
    const actionChangeSub = this.actionItems.changes.subscribe(() => {
      this.actionItems.forEach(item => {
        const sub = item.select.subscribe(() => {
          this.dropdown?.closeDropdown();
        });
        this.actionItemSubscriptions.push(sub);
      });
    });
    this.actionItemSubscriptions.push(actionChangeSub);
  }

  private cleanUpSubscriptions(): void {
    this.itemSubscriptions.forEach(sub => sub.unsubscribe());
    this.itemSubscriptions = [];
    this.actionItemSubscriptions.forEach(sub => sub.unsubscribe());
    this.actionItemSubscriptions = [];
  }
}
