import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewChecked,
  Renderer2,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownComponent } from "../dropdown/dropdown.component";
import { DropdownTriggerComponent } from "../dropdown/dropdown-trigger.component";
import { DropdownMenuComponent } from "../dropdown/dropdown-menu.component";
import { DropdownItemComponent } from "../dropdown/dropdown-item.component";
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { IconComponent } from '../icons/icon.component';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  hidden?: boolean; // Add hidden property
  translationKey?: string;
  hideInMobile?: boolean;
}

@Component({
  selector: 'app-tab-group',
  standalone: true,
  imports: [CommonModule, TranslateModule, IconComponent, DropdownComponent, DropdownTriggerComponent, DropdownMenuComponent, DropdownItemComponent],
  templateUrl: './tab-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabGroupComponent implements OnChanges, AfterViewChecked, AfterViewInit, OnDestroy {
  @Input() tabs: Tab[] = [];
  @Input() activeTabId: string | null = null;
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() variant: 'default' | 'minimal' | 'button' | 'pills' | 'underlined' = 'default';
  @Input() showIcons = true;
  @Input() responsive = true;

  @Output() tabChange = new EventEmitter<Tab>();

  @ViewChildren('tabButton') tabButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  indicatorStyle: { [key: string]: string } = {};

  public isMobile: boolean = false;

  private viewChecked = false;
  private observer: IntersectionObserver | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private observedButtons: Set<HTMLButtonElement> = new Set();
  private breakpointObserverSub: Subscription

  constructor(
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private hostElement: ElementRef,
    private breakpointObserver: BreakpointObserver

  ) {
    // detect screen size changes
    this.breakpointObserverSub = this.breakpointObserver.observe([
      "(max-width: 768px)"
    ]).subscribe((result: BreakpointState) => {
      if (result.matches) {
        this.isMobile = true;
        this.cdr.markForCheck();
      } else {
        this.isMobile = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Getter for visible tabs to simplify template and logic
  get visibleTabs(): Tab[] {
    return this.tabs.filter(tab => !tab.hidden && !(this.isMobile && tab.hideInMobile));
  }

  ngOnChanges(changes: SimpleChanges): void {
    let needsCheck = false;
    let emitInitialTab = false; // Flag to track if we need to emit
    const visibleTabs = this.visibleTabs;

    if ((changes['tabs'] || changes['activeTabId']) && visibleTabs.length) {
      const currentActiveIsVisible = visibleTabs.some(tab => tab.id === this.activeTabId);

      if (!this.activeTabId || !currentActiveIsVisible) {
        const firstVisibleEnabledTab = visibleTabs.find(tab => !tab.disabled);
        const newActiveTabId = firstVisibleEnabledTab ? firstVisibleEnabledTab.id : visibleTabs[0].id;

        // Check if the active tab ID actually changes before setting flags
        if (this.activeTabId !== newActiveTabId) {
          this.activeTabId = newActiveTabId;
          needsCheck = true;
          emitInitialTab = true; // Set flag to emit the newly determined tab
        }
      }
    } else if (visibleTabs.length === 0 && this.activeTabId !== null) {
      // If all tabs are hidden or removed, clear active tab and potentially emit null/undefined?
      // For now, just clear the ID. Emission might be complex here.
      this.activeTabId = null;
      needsCheck = true;
      // Decide if emitting null is desired when all tabs are gone. Let's skip for now.
    }

    if (changes['tabs'] || changes['activeTabId'] || changes['orientation'] || changes['variant']) {
      // If relevant inputs change, ensure position recalculation happens
      if (!this.viewChecked) { // Only mark for check if not already checked in this cycle
        needsCheck = true;
      }
      this.viewChecked = false;
    }

    if (needsCheck) {
      this.cdr.markForCheck();
      if (emitInitialTab && this.activeTabId) {
        // Emit the newly set initial/default tab
        const activeTab = this.visibleTabs.find(tab => tab.id === this.activeTabId);
        if (activeTab) {
          // Use setTimeout to avoid potential issues with emitting during change detection cycle
          setTimeout(() => this.tabChange.emit(activeTab));
        }
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.variant === 'pills' || this.variant === 'underlined') {
      this.setupIntersectionObserver();
      this.setupResizeObserver();

      // Listen for tab button changes (when tabs are added/removed)
      this.tabButtons.changes.subscribe(() => {
        this.updateObservedButtons();
        // Update indicator position after buttons have rendered
        setTimeout(() => this.updateIndicatorPosition());
      });
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect(); // Disconnect observer on destroy
    this.resizeObserver?.disconnect();
    this.observedButtons.clear();
  }

  ngAfterViewChecked(): void {
    // Keep existing logic, observer handles initial visibility
    if (!this.viewChecked && (this.variant === 'pills' || this.variant === 'underlined') && this.tabButtons?.length) {
      // Check if the element is currently visible before updating
      // This check might be redundant if the observer is working correctly,
      // but adds a layer of safety.
      if (this.hostElement.nativeElement.offsetParent !== null) {
        this.updateIndicatorPosition();
        this.viewChecked = true;
        // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => this.cdr.markForCheck());
      }
    }
  }

  selectTab(tab: Tab): void {
    if (tab.disabled || this.activeTabId === tab.id) {
      return;
    }

    this.activeTabId = tab.id;
    this.tabChange.emit(tab);
    this.viewChecked = false;
    this.cdr.markForCheck();

    // Update indicator position after DOM updates
    setTimeout(() => this.updateIndicatorPosition());
  }

  isActive(tabId: string): boolean {
    return this.activeTabId === tabId;
  }

  trackByTabId(index: number, tab: Tab): string {
    return tab.id;
  }

  updateIndicatorPosition(): void {
    const activeTabElement = this.tabButtons?.find(
      (el) => el.nativeElement.id === `tab-${this.activeTabId}`
    )?.nativeElement;

    if (!activeTabElement) {
      this.indicatorStyle = { display: 'none' };
      return;
    }

    const isVertical = this.orientation === 'vertical';
    const newStyle: { [key: string]: string } = {
      display: 'block',
    };

    if (isVertical) {
      newStyle['transform'] = `translateY(${activeTabElement.offsetTop}px)`;
      newStyle['height'] = `${activeTabElement.offsetHeight}px`;
      newStyle['width'] = this.variant === 'underlined' ? '2px' : '100%';
      newStyle['left'] = this.variant === 'underlined' ? '0' : '';
      newStyle['top'] = '0';
    } else {
      newStyle['transform'] = `translateX(${activeTabElement.offsetLeft}px)`;
      newStyle['width'] = `${activeTabElement.offsetWidth}px`;
      newStyle['height'] = this.variant === 'underlined' ? '2px' : '100%';
      newStyle['bottom'] = this.variant === 'underlined' ? '0' : '';
      newStyle['left'] = '0';
      newStyle['top'] = this.variant === 'pills' ? '0' : '';
    }

    this.indicatorStyle = newStyle;
  }

  getTabClasses(tab: Tab): string[] {
    const isActive = this.isActive(tab.id);

    const baseClasses = [
      'relative',
      'flex', 'items-center', 'sm:px-3', 'sm:py-2', 'px-2', 'py-1', 'transition-colors',
      'duration-200', 'ease-in-out',
      'cursor-pointer', 'focus:outline-none', 'z-10'
    ];

    const orientationClasses = this.orientation === 'vertical'
      ? ['w-full', 'text-left']
      : ['whitespace-nowrap'];

    const variantClasses = this.getVariantClasses(isActive);

    const disabledClasses = tab.disabled
      ? ['opacity-50', 'cursor-not-allowed']
      : ['hover:text-primary'];

    return [
      ...baseClasses,
      ...orientationClasses,
      ...variantClasses,
      ...disabledClasses
    ];
  }

  private getVariantClasses(isActive: boolean): string[] {
    switch (this.variant) {
      case 'default':
        return [
          'rounded-t', 'border-t', 'border-l', 'border-r',
          isActive
            ? 'bg-white font-medium border-gray-200'
            : 'bg-gray-100 hover:bg-gray-200 border-transparent'
        ];
      case 'minimal':
        return isActive
          ? ['font-medium', 'text-primary']
          : ['text-gray-600'];
      case 'pills':
        return [
          'rounded-full',
          isActive ? 'text-white' : 'text-gray-700'
        ];
      case 'button':
        return [
          'rounded-md',
          isActive ? 'text-foreground bg-primary/10 font-medium' : 'text-foreground hover:bg-primary/5'
        ];
      case 'underlined':
        return [
          'border-b-2', 'border-transparent',
          isActive ? 'text-primary font-medium' : 'text-gray-600'
        ];
      default:
        return [];
    }
  }

  getContainerClasses(): string[] {
    const base = ['relative', 'flex'];
    const orientation = this.orientation === 'vertical'
      ? ['flex-col', 'space-y-1']
      : ['flex-row', 'space-x-1', 'overflow-x-hidden'];

    const variantSpecific = [];
    if (this.variant === 'underlined' && this.orientation === 'horizontal') {
      variantSpecific.push('border-b', 'border-gray-200');
    } else if (this.variant === 'underlined' && this.orientation === 'vertical') {
      variantSpecific.push('border-l', 'border-gray-200');
    } else if (this.variant === 'default' && this.orientation === 'horizontal') {
      variantSpecific.push('border-b', 'border-gray-200');
    }

    return [...base, ...orientation, ...variantSpecific];
  }

  getIndicatorClasses(): string[] {
    const base = [
      'absolute', 'z-0',
      'transition-all', 'duration-300', 'ease-out'
    ];

    let variantStyle: string[];
    switch (this.variant) {
      case 'pills':
        variantStyle = ['bg-primary', 'rounded-full'];
        break;
      case 'button':
        variantStyle = ['bg-primary/10'];
        break;
      default:
        variantStyle = ['bg-primary'];
        break;
    }

    return [...base, ...variantStyle];
  }

  private setupIntersectionObserver(): void {
    const options = {
      root: null, // Use the viewport
      threshold: 0 // Trigger as soon as 1px is visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // When the component becomes visible
        if (entry.isIntersecting) {
          // Update position and mark for check
          // Use setTimeout to avoid potential timing issues with rendering
          setTimeout(() => {
            this.updateIndicatorPosition();
            this.viewChecked = true; // Mark as checked since we just updated
            this.cdr.markForCheck();
          });
          // Optional: Unobserve if you only need the very first time it becomes visible
          // this.observer?.unobserve(this.hostElement.nativeElement);
        } else {
          // Optional: Handle becoming hidden again if necessary
          // Maybe reset viewChecked?
          // this.viewChecked = false;
        }
      });
    }, options);

    this.observer.observe(this.hostElement.nativeElement);
  }

  // Set up resize observer to track tab button size changes
  private setupResizeObserver(): void {
    // Only create if needed and supported
    if (!this.resizeObserver && window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        // When any observed button changes size, update indicator
        if (this.viewChecked) {
          this.updateIndicatorPosition();
          this.cdr.markForCheck();
        }
      });

      // Start observing current buttons
      this.updateObservedButtons();
    }
  }

  // Update the set of buttons being observed by the ResizeObserver
  private updateObservedButtons(): void {
    if (!this.resizeObserver) return;

    // Clear current observations
    this.observedButtons.forEach(button => {
      this.resizeObserver?.unobserve(button);
    });
    this.observedButtons.clear();

    // Add new buttons to observe
    if (this.tabButtons) {
      this.tabButtons.forEach(tabButtonRef => {
        const button = tabButtonRef.nativeElement;
        this.resizeObserver?.observe(button);
        this.observedButtons.add(button);
      });
    }
  }

  get currentActiveTab() {
    return this.tabs.find(tab => tab.id === this.activeTabId);
  }
}
