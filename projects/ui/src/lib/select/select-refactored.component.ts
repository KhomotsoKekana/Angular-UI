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
  selector: 'app-select-refactored',
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
          <span *ngIf="!selectedItem && !loading"
            class="text-gray-600 text-xs w-full text-start select-none flex items-center gap-2">
            {{ placeholder}}
          </span>
          <span *ngIf="!selectedItem && loading" class="flex items-center gap-0.5 text-muted-foreground text-sm">
            <span class="animate-bounce [animation-delay:-0.3s]">.</span>
            <span class="animate-bounce [animation-delay:-0.15s]">.</span>
            <span class="animate-bounce">.</span>
          </span>
          <span *ngIf="selectedItem"
            class="text-foreground font-normal text-xs capitalize w-full text-start select-none flex items-center gap-2">
            {{selectedItem.text }}
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
        </div>
      </ng-template>

      <!-- Dropdown Directive -->
      <div appDropdown
           [triggerElement]="{ nativeElement: trigger }"
           [dropdownTemplate]="menu"
           [placement]="placement"
           [disabled]="disabled"
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
      useExisting: forwardRef(() => SelectRefactoredComponent),
      multi: true
    },
    ClassCombinePipe
  ]
})
export class SelectRefactoredComponent extends SelectBase implements AfterViewInit, AfterContentInit, OnDestroy {
  @Output() selectionChange = new EventEmitter<any>();
  @Output() change = new EventEmitter<any>();
  
  isOpen: boolean = false;
  selectedItem: any = null;
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

  selectItem(item: any): void {
    if (this.disabled || item.disabled) return;

    const text = item.label ? item.label : item.elementRef.nativeElement.textContent.trim().toLowerCase();

    this.selectedItem = {
      key: item.key,
      text,
    };

    this.items.forEach(i => i.selected = false); // Deselect all items
    item.selected = true; // Select the clicked item

    this.dropdown?.closeDropdown(); // Close the dropdown
    this.onChange(item.key); // Update ngModel
    this.onTouched(); // Mark the control as touched
    this.selectionChange.emit({ value: item.key }); // Emit the selected key
    this.change.emit({ value: item.key }); // Emit change event
  }

  override onSearch(): void {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.searchValueChange.emit(this.searchQuery);
      this.filterItems();
    }, 300);
  }

  protected override updateSelection(value: any): void {
    // Reset all items
    this.items?.forEach(i => i.selected = false);
    
    // Find the item that matches the value
    const selectedItem = this.items?.find(item => item.key === value);
    if (selectedItem) {
      selectedItem.selected = true;
      
      // Update selected item data
      const textContent = selectedItem.elementRef.nativeElement.textContent;
      this.selectedItem = {
        key: value,
        text: selectedItem.label ? selectedItem.label : textContent ? textContent.trim().toLowerCase() : '',
      };
    } else {
      this.selectedItem = null;
    }
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
      const sub = item.select.subscribe(() => this.selectItem(item));
      this.itemSubscriptions.push(sub);
    });

    // Subscribe to item changes
    const changeSub = this.items.changes.subscribe(() => {
      this.items.forEach(item => {
        const sub = item.select.subscribe(() => this.selectItem(item));
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
