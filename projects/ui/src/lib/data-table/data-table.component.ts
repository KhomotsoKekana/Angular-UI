import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, TemplateRef, ContentChildren, QueryList, Directive, HostBinding } from '@angular/core';
import { InputComponent } from "../input/input.component";
import { SelectComponent } from "../select/select.component";
import { SelectItemComponent } from "../select/select-item.component";
import { ButtonComponent } from "../button/button.component";
import { FormsModule } from '@angular/forms';
import { IllustrationNoData } from "../illustrations/no-data-illustration.component";
import { SkeletonComponent } from "../skeleton/skeleton.component";
import { TranslateModule } from '@ngx-translate/core';

// Add this directive to mark column templates
@Directive({
    selector: '[appColumnTemplate]',
    standalone: true
})
export class ColumnTemplateDirective {
    @Input() columnName!: string;
    constructor(public template: TemplateRef<any>) { }
}

export interface Column {
    name: string;       // Property name in data object
    header: string;     // Display name for column
    sortable?: boolean;
    filterable?: boolean;
    cell?: (element: any) => string; // Optional formatter
    templateRef?: string; // Reference to a template name for custom rendering
    width?: string;      // Optional width specification (e.g. '100px', '10%', etc.)
    translateHeader?: boolean; // Optional flag to translate the header,
    align?: 'left' | 'center' | 'right'; // New alignment property
    hideOnSmall?: boolean; // New property to hide column on small screens

}

export interface TableFilter {
    column: string;
    value: string;
}

export interface PageEvent {
    pageIndex: number;
    pageSize: number;
    length: number;
}

export interface Sort {
    active: string;
    direction: 'asc' | 'desc' | '';
}

@Component({
    selector: 'flex-data-table',
    imports: [CommonModule, InputComponent, SelectComponent, SelectItemComponent, ButtonComponent, FormsModule, IllustrationNoData, SkeletonComponent, TranslateModule],
    templateUrl: './data-table.component.html',
    standalone: true,
})
export class DataTableComponent implements OnInit, OnChanges {
    @ContentChildren(ColumnTemplateDirective)
    columnTemplates!: QueryList<ColumnTemplateDirective>;

    private templateMap = new Map<string, TemplateRef<any>>();

    @Input() data: any[] = [];
    @Input() columns: Column[] = [];
    @Input() isServerSide = false;
    @Input() totalItems = 0;
    @Input() pageIndex: number = 0;
    @Input() pageSize = 10;
    @Input() pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    @Input() loading = false;
    @Input() rowClickable = false;

    @Output() pageChange = new EventEmitter<PageEvent>();
    @Output() sortChange = new EventEmitter<Sort>();
    @Output() filterChange = new EventEmitter<TableFilter[]>();
    @Output() rowClick = new EventEmitter<any>();

    displayedColumns: string[] = [];
    activeFilters: { [key: string]: string } = {};
    filteredData: any[] = [];
    paginatedData: any[] = [];

    currentSort: Sort = { active: '', direction: '' };
    currentPage = 0;

    @HostBinding('class')
    get hostClasses(): string {
        return 'flex flex-col h-full overflow-hidden relative';
    }

    ngOnInit(): void {
        this.currentPage = this.pageIndex; // Initialize from input
        this.displayedColumns = this.columns.map(column => column.name);
        this.updateView();
    }

    ngOnChanges(changes: SimpleChanges): void {

        let needsViewUpdate = false;
        let pageIndexChanged = false;

        // Update internal currentPage if pageIndex input changes
        if (changes['pageIndex']) {
            if (this.currentPage !== this.pageIndex) {
                this.currentPage = this.pageIndex;
                pageIndexChanged = true;
                // For server-side, data will follow, so no immediate view update needed based *only* on index change.
                // For client-side, an index change *does* require a view update.
                if (!this.isServerSide) {
                    needsViewUpdate = true;
                }
            }
        }

        // If data changes, update the view
        if (changes['data']) {
            needsViewUpdate = true;
            // Client-side data change should reset page, unless index was also explicitly set
            if (!this.isServerSide && !pageIndexChanged) {
                this.currentPage = 0;
            }
        }

        if (changes['columns']) {
            this.displayedColumns = this.columns.map(column => column.name);
            needsViewUpdate = true;
        }

        // Remove the logic where the child tries to adjust currentPage based on totalItems for server-side.
        // The parent is now responsible via the pageIndex input.

        if (needsViewUpdate) {
            this.updateView();
        }
    }

    ngAfterContentInit() {
        this.columnTemplates.forEach(item => {
            this.templateMap.set(item.columnName, item.template);
        });
    }

    hasCustomTemplate(columnName: string): boolean {
        return this.templateMap.has(columnName);
    }

    getTemplateRef(columnName: string): TemplateRef<any> | null {
        return this.templateMap.get(columnName) || null;
    }

    updateView(): void {
        if (!this.isServerSide) {
            this.filteredData = this.applyClientFilters(this.data);
            this.filteredData = this.applyClientSort(this.filteredData);
            this.paginatedData = this.applyClientPagination(this.filteredData);
        } else {
            this.paginatedData = this.data;
        }
    }

    // Pagination methods
    onPageChange(requestedPageIndex: number): void {
        const pageEvent: PageEvent = {
            pageIndex: requestedPageIndex,
            pageSize: this.pageSize,
            length: this.isServerSide ? this.totalItems : this.filteredData.length // Use correct length
        };
        this.pageChange.emit(pageEvent); // Let parent handle state and data fetching

        // If client-side, update internal state and view immediately
        if (!this.isServerSide || this.currentPage !== requestedPageIndex) {
            this.currentPage = requestedPageIndex;
            this.updateView();
        }
    }

    onPageSizeChange(newPageSize: number): void {
        this.pageSize = newPageSize;
        const newPageIndex = 0; // Always go to first page on size change

        const pageEvent: PageEvent = {
            pageIndex: newPageIndex,
            pageSize: this.pageSize,
            length: this.isServerSide ? this.totalItems : this.filteredData.length // Use correct length
        };
        this.pageChange.emit(pageEvent); // Let parent handle state and data fetching

        // If client-side, update internal state and view immediately
        if (!this.isServerSide) {
            this.currentPage = newPageIndex;
            this.updateView();
        }
    }

    // Sorting methods
    toggleSort(columnName: string): void {
        if (!this.columns.find(c => c.name === columnName)?.sortable) {
            return;
        }

        let direction: 'asc' | 'desc' | '' = 'asc';

        if (this.currentSort.active === columnName) {
            direction = this.currentSort.direction === 'asc' ? 'desc' :
                this.currentSort.direction === 'desc' ? '' : 'asc';
        }

        this.currentSort = { active: columnName, direction };

        if (this.isServerSide) {
            this.sortChange.emit(this.currentSort);
        } else {
            this.updateView();
        }
    }

    // Filtering methods
    applyFilter(column: string, filterValue: string): void {
        if (filterValue.trim() === '') {
            delete this.activeFilters[column];
        } else {
            this.activeFilters[column] = filterValue.trim().toLowerCase();
        }

        if (this.isServerSide) {
            const filters = Object.entries(this.activeFilters).map(([column, value]) => ({
                column,
                value
            }));

            this.filterChange.emit(filters);
            this.currentPage = 0;
        } else {
            this.currentPage = 0;
            this.updateView();
        }
    }

    clearFilters(): void {
        this.activeFilters = {};

        if (this.isServerSide) {
            this.filterChange.emit([]);
        } else {
            this.updateView();
        }

        this.currentPage = 0;
    }

    // Client-side data handling methods
    private applyClientFilters(data: any[]): any[] {
        if (!data || !Array.isArray(data)) {
            return [];
        }

        if (Object.keys(this.activeFilters).length === 0) {
            return [...data];
        }

        return data.filter(item =>
            Object.keys(this.activeFilters).every(column => {
                const value = this.getNestedProperty(item, column);
                return value !== undefined &&
                    value !== null &&
                    value.toString().toLowerCase().includes(this.activeFilters[column]);
            })
        );

    }

    private applyClientSort(data: any[]): any[] {
        if (!this.currentSort.active || !this.currentSort.direction) {
            return [...data];
        }

        return [...data].sort((a, b) => {
            const valueA = this.getNestedProperty(a, this.currentSort.active);
            const valueB = this.getNestedProperty(b, this.currentSort.active);

            if (valueA === valueB) return 0;

            const comparison = valueA < valueB ? -1 : 1;
            return this.currentSort.direction === 'asc' ? comparison : -comparison;
        });
    }

    private applyClientPagination(data: any[]): any[] {
        const startIndex = this.currentPage * this.pageSize;
        return data.slice(startIndex, startIndex + this.pageSize);
    }

    private getNestedProperty(obj: any, path: string): any {
        return path.split('.').reduce((o, i) => o ? o[i] : undefined, obj);
    }

    getFormattedCellValue(element: any, column: Column): string {
        return column.cell ? column.cell(element) : this.getNestedProperty(element, column.name)?.toString() || '';
    }

    // Pagination calculation helpers
    get totalPages(): number {
        const length = this.isServerSide ? this.totalItems : this.filteredData.length;
        return Math.ceil(length / this.pageSize);
    }

    get pageNumbers(): number[] {
        const count = this.totalPages;
        return Array.from({ length: count }, (_, i) => i);
    }

    // Helper methods for template
    getObjectKeys(obj: any): string[] {
        return Object.keys(obj);
    }

    minValue(a: number, b: number): number {
        return Math.min(a, b);
    }

    maxValue(a: number, b: number): number {
        return Math.max(a, b);
    }

    onInputFilter(column: string, event: any): void {
        const value = event.target.value;
        this.applyFilter(column, value);
    }

    onSelectPageSize(event: any): void {
        const value = Number(event.value);
        this.onPageSizeChange(value);
    }

    getVisiblePages(): number[] {
        const start = Math.max(0, this.currentPage - 2);
        const end = Math.min(this.totalPages, this.currentPage + 3);
        return this.pageNumbers.slice(start, end);
    }

    // Add this with your other methods
    onRowClick(row: any, event: MouseEvent): void {
        // Prevent row click when clicking on interactive elements
        if (
            (event.target as HTMLElement).closest('button, input, select, a') !== null
        ) {
            return;
        }
        this.rowClick.emit(row);
    }

    getColumnAlignClass(column: Column): string {
        switch (column.align) {
            case 'center': return 'text-center justify-center';
            case 'right': return 'text-right justify-end';
            case 'left':
            default: return 'text-left justify-start';
        }
    }

    // Add trackBy functions for ngFor optimizations
    trackByColumn(index: number, column: Column): string {
        return column.name;
    }

    trackByRow(index: number, row: any): number {
        // Using index as row identifier if unique id is not available.
        return index;
    }

    trackByIndex(index: number, item: any): number {
        return index;
    }

    trackByPageSize(index: number, size: number): number {
        return size;
    }

    getColumnVisibilityClass(column: Column): string {
        return column.hideOnSmall ? 'hidden sm:table-cell' : '';
    }
}