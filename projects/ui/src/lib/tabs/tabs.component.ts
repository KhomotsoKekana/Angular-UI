import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, ContentChildren, ElementRef, Input, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TabContentComponent } from './tab-content/tab-content.component';
import { TabService } from './tabs.service';
import { StandardIconComponent } from "../icon-standard/icon-standard.component";
import { IconComponent } from '../icons/icon.component';

interface Tab {
  label?: string;
  key: string;
  leadingIcon?: string;
  leadingStandardIcon?: string;
  hidden?: boolean;
  group?: string;
}

interface TabRender extends Tab {
  group?: string;
  index: number;
}


@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, IconComponent, StandardIconComponent],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent implements AfterViewInit, AfterContentInit, OnDestroy {
  @Input() tabs: Tab[] = []; // Array of tabs
  @Input() variant: 'underline' | 'pill' | 'pill-square' | 'step' = 'underline'; // Tab style variant
  @Input() lazyLoad: boolean = false; // Lazy-load setting

  private observer: IntersectionObserver | null = null;

  activeTabIndex = 0; // Track active tab index
  visitedTabs: Set<string> = new Set(); // Tracks visited tabs when lazyLoad is enabled

  constructor(private tabService: TabService, private elementRef: ElementRef) { }

  @ContentChildren(TabContentComponent) tabContents!: QueryList<TabContentComponent>;

  ngAfterContentInit(): void {
    // Ensure every tab has a matching content block
    const missingIds = this.tabs.filter(
      (tab) => !this.tabContents.some((content) => content.id === tab.key)
    );

    if (missingIds.length) {
      console.warn('Some tabs are missing content:', missingIds);
    }

    if (!this.lazyLoad) {
      // If lazyLoad is false, mark all tabs as visited
      this.visitedTabs = new Set(this.tabs.map((tab) => tab.key));
    } else {
      // Mark the first tab as visited
      this.visitedTabs.add(this.tabs[0]?.key);
    }
  }

  // Check if a tab's content should be rendered
  shouldRenderContent(tabKey: string): boolean {
    return !this.lazyLoad || this.visitedTabs.has(tabKey);
  }

  // Check if a content block matches the active tab
  isTabContentVisible(content: TabContentComponent): boolean {
    return content.id === this.tabs[this.activeTabIndex]?.key;
  }


  @ViewChildren('tab') tabElements!: QueryList<ElementRef>; // Access all tab buttons
  @ViewChild('stepLine') stepLineElement!: ElementRef; // Access all tab buttons

  activeTabStyles = { left: '0px', width: '0px' }; // Active tab indicator styles
  stepLineWidth = '0px';

  // Track focused tab
  focusedTabIndex: number | null = null;

  ngAfterViewInit(): void {

    // Create an Intersection Observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // The tab component is rendered and visible
            this.updateActiveTabStyles();
          }
        });
      },
      {
        threshold: 0.1, // Trigger when at least 10% of the component is visible
      }
    );

    // Observe the component's root element
    if (this.elementRef.nativeElement) {
      this.observer.observe(this.elementRef.nativeElement);
    }


    this.tabService.activeTab$.subscribe(label => {
      if (label) {
        const tabIndex = this.tabs.findIndex(tab => tab.key === label);
        if (tabIndex !== -1) {
          this.selectTab(tabIndex);
        }
      }
    });

    this.tabService.focusTab$.subscribe(label => {
      if (label) {
        const tabIndex = this.tabs.findIndex(tab => tab.key.toLowerCase() === label.toLowerCase());
        if (tabIndex !== -1) {
          this.focusedTabIndex = tabIndex;
          // Add focus class temporarily
          const tabElement = this.tabElements.get(tabIndex)?.nativeElement;
          if (tabElement) {
            tabElement.classList.add('before:absolute', 'before:w-3', 'before:h-3', 'before:bg-primary', 'before:rounded-full', 'before:animate-pulse', 'before:top-0', 'before:-right-1');
            setTimeout(() => {
              tabElement.classList.remove('before:absolute', 'before:w-3', 'before:h-3', 'before:bg-primary', 'before:rounded-full', 'before:animate-pulse', 'before:top-0', 'before:-right-1');
            }, 3000);
          }
          this.selectTab(tabIndex);
        }
      }
    });
  }

  // Change active tab
  selectTab(index: number): void {
    this.activeTabIndex = index;
    this.updateActiveTabStyles();

    if (this.lazyLoad) {
      // Mark the selected tab as visited
      const tabKey = this.tabs[index]?.key;
      if (tabKey) {
        this.visitedTabs.add(tabKey);
      }
    }
  }

  // Update indicator styles
  // updateActiveTabStyles(): void {
  //   const activeTab = this.tabElements.toArray()[this.activeTabIndex].nativeElement;
  //   this.activeTabStyles = {
  //     left: `${activeTab.offsetLeft}px`,
  //     width: `${activeTab.offsetWidth}px`,
  //   };
  // }

  updateActiveTabStyles(): void {

    const tabsArray = this.tabElements.toArray();


    if (!tabsArray.length) return;

    const activeTabElement = tabsArray[this.activeTabIndex].nativeElement;


    // Update underline or pill styles
    const { offsetLeft, offsetWidth } = activeTabElement;

    this.activeTabStyles.left = `${offsetLeft}px`;
    this.activeTabStyles.width = `${offsetWidth}px`;

    // Update the step line for step variant
    if (this.variant === 'step') {
      const totalWidth = activeTabElement.getBoundingClientRect().left - this.stepLineElement.nativeElement.getBoundingClientRect().left;
      this.stepLineWidth = `${totalWidth}px`;
    }
  }

  get visibleTabs() {
    return this.tabs.filter((tab, index) => !tab.hidden || index === this.activeTabIndex);
  }

  setActiveTabByLabel(label: string): void {
    const tabIndex = this.tabs.findIndex(tab => tab.key === label);
    if (tabIndex !== -1) {
      this.selectTab(tabIndex);
    } else {
      console.warn(`Tab with label "${label}" not found.`);
    }
  }

  setActiveTab(index: number): void {
    this.activeTabIndex = index;
    this.updateActiveTabStyles();
  }

  get groupedTabs(): { tabs: TabRender[]; startIndex: number }[] {
    const groups: { tabs: TabRender[]; startIndex: number }[] = [];
    let currentGroup: TabRender[] = [];
    let currentIndex = 0;

    this.tabs.forEach(tab => {
      const tabWithIndex: TabRender = { ...tab, index: currentIndex };

      //Only display visible tabs
      if (tab.hidden && tabWithIndex.index !== this.activeTabIndex) {
        return
      }


      if (!currentGroup.length || currentGroup[0].group === tab.group) {
        currentGroup.push(tabWithIndex);
      } else {
        groups.push({ tabs: [...currentGroup], startIndex: currentIndex - currentGroup.length });
        currentGroup = [tabWithIndex];
      }
      currentIndex++;
    });

    if (currentGroup.length) {
      groups.push({ tabs: currentGroup, startIndex: currentIndex - currentGroup.length });
    }

    return groups;
  }
  trackByGroup(index: number, group: { tabs: TabRender[]; startIndex: number }): number {
    return group.startIndex;
  }

  isActiveGroup(group: { tabs: TabRender[]; startIndex: number }): boolean {
    return group.tabs.some(tab => tab.index === this.activeTabIndex);
  }

  getTabIndex(indexInGroup: number, startIndex: number): number {

    return startIndex + indexInGroup;

  }

  trackByIndex(index: number, tab: TabRender): number | undefined {
    return tab ? tab.index : undefined;
  }

  ngOnDestroy(): void {
    // Cleanup the observer when the component is destroyed
    if (this.observer) {
      this.observer.disconnect();
    }
  }


}
