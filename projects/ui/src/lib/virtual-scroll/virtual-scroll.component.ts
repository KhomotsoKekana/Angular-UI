// virtual-scroll-paginator.component.ts
import {
    Component,
    Input,
    Output,
    EventEmitter,
    TemplateRef,
    ViewChild,
    OnInit
  } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
  
  @Component({
    selector: 'flex-virtual-scroll-paginator',
    standalone: true,
    imports: [CommonModule, ScrollingModule],
    template: `
      <cdk-virtual-scroll-viewport
        [itemSize]="itemHeight"
        class="h-full w-full overflow-auto relative"
        (scrolledIndexChange)="onScroll($event)"
      >
        <ng-container *cdkVirtualFor="let item of items; let i = index; trackBy: trackByFn">
        <!-- class="border-b hover:bg-secondary cursor-pointer"
            (click)="itemClicked.emit(item)"  -->
        <div
            
          >
            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, index: i }"></ng-container>
          </div>
        </ng-container>
  
        <div
          *ngIf="isLoading"
          class="p-4 text-center text-gray-400 absolute bottom-0 left-0 w-full bg-white bg-opacity-70"
        >
          <span class="animate-pulse">Loading more...</span>
        </div>
      </cdk-virtual-scroll-viewport>
    `,
    styles: [
      `
      cdk-virtual-scroll-viewport {
        height: 100%;
        width: 100%;
        display: block;
      }
    `
    ]
  })
  export class VirtualScrollPaginatorComponent implements OnInit {
    /**
     * Full list of loaded items
     */
    @Input() items: any[] = [];
  
    /**
     * The height (in pixels) of each item in the list.
     * Required for virtual scrolling to calculate what is visible.
     */
    @Input() itemHeight = 48;
  
    /**
     * Indicates if there are more items to load (server-side paging)
     */
    @Input() hasMore = false;
  
    /**
     * Function that fetches more items. Must return a Promise<any[]>
     */
    @Input() loadMoreFn: () => Promise<any[]> = async () => [];
  
    /**
     * TemplateRef to render each item
     */
    @Input() itemTemplate!: TemplateRef<any>;
  
    /**
     * Optional trackBy function
     */
    @Input() trackByFn: (index: number, item: any) => any = (i, item) => item;
  
    /**
     * Event emitted when an item is clicked
     */
    @Output() itemClicked = new EventEmitter<any>();
  
    isLoading = false;
  
    async onScroll(index: number) {
      if (this.isLoading || !this.hasMore) return;
  
      const buffer = 10;
      if (index >= this.items.length - buffer) {
        this.isLoading = true;
        const more = await this.loadMoreFn();
        this.items.push(...more);
        this.isLoading = false;
      }
    }
  
    ngOnInit(): void {
      if (!this.itemTemplate) {
        console.warn('itemTemplate is required for virtual-scroll-paginator');
      }
    }
  }
  