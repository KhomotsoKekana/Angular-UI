import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icons/icon.component';

@Component({
  selector: 'app-custom-paginator',
  templateUrl: './paginator.component.html',
  imports: [CommonModule, FormsModule, IconComponent],
})
export class CustomPaginatorComponent {
  @Input() totalItems: number = 0; // Total number of items
  @Input() pageSize: number = 5; // Items per page
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50, 75, 100]; // Dropdown options for rows per page

  @Output() pageChange = new EventEmitter<{ pageIndex: number; pageSize: number, previousPageIndex: number }>();

  pageIndex: number = 0; // Current page index
  previousPageIndex: number = 0; // Previous page index

  // Total pages
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  // Go to the first page
  firstPage(): void {
    this.pageIndex = 0;
    this.emitPageChange();
  }

  // Go to the last page
  lastPage(): void {
    this.pageIndex = this.totalPages - 1;
    this.emitPageChange();
  }

  // Go to the previous page
  previousPage(): void {
    if (this.pageIndex > 0) {
      this.previousPageIndex = this.pageIndex;
      this.pageIndex--;
      this.emitPageChange();
    }
  }

  // Go to the next page
  nextPage(): void {
    if (this.pageIndex < this.totalPages - 1) {
      this.previousPageIndex = this.pageIndex;
      this.pageIndex++;
      this.emitPageChange();
    }
  }

  // Set a custom page index
  goToPage(pageIndex: number): void {
    if (pageIndex >= 0 && pageIndex < this.totalPages) {
      this.pageIndex = pageIndex;
      this.emitPageChange();
    }
  }

  // Set the total number of items
  // setLength(length: number): void {
  //   this.totalItems = length;
  //   if (this.pageIndex >= this.totalPages) {
  //     this.pageIndex = this.totalPages - 1;
  //   }
  //   this.emitPageChange();
  // }

  // Emit the page change event
  private emitPageChange(): void {
    this.pageChange.emit({
      pageIndex: this.pageIndex,
      previousPageIndex: this.previousPageIndex,
      pageSize: this.pageSize
    });
  }

  // Handle page size change
  onPageSizeChange(event: any): void {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.pageIndex = 0; // Reset to the first page
    this.emitPageChange();
  }
}