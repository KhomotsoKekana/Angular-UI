import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomPaginatorComponent } from '../../../../../ui/src/lib/paginator/paginator.component';
import { ButtonComponent } from '../../../../../ui/src/lib/button/button.component';

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    CustomPaginatorComponent,
    ButtonComponent
  ],
  templateUrl: './paginator.component.html',
})
export class DocsPaginatorComponent {
  // Basic Paginator
  currentPage = 0;
  currentPageSize = 10;

  // Paginator with Options
  optionsCurrentPage = 0;
  optionsCurrentPageSize = 5;

  // Paginator with Initial Page Set
  initialCurrentPage = 0;
  initialCurrentPageSize = 20;

  @ViewChild('initialPagePaginator') initialPagePaginator!: CustomPaginatorComponent;

  onPageChange(event: { pageIndex: number, pageSize: number, previousPageIndex: number }) {
    this.currentPage = event.pageIndex;
    this.currentPageSize = event.pageSize;
    console.log('Basic Paginator PageChange:', event);
  }

  onPageChangeWithOptions(event: { pageIndex: number, pageSize: number, previousPageIndex: number }) {
    this.optionsCurrentPage = event.pageIndex;
    this.optionsCurrentPageSize = event.pageSize;
    console.log('Options Paginator PageChange:', event);
  }

  onPageChangeInitial(event: { pageIndex: number, pageSize: number, previousPageIndex: number }) {
    this.initialCurrentPage = event.pageIndex;
    this.initialCurrentPageSize = event.pageSize;
    console.log('Initial Paginator PageChange:', event);
  }

  goToInitialPage(pageNumber: number) {
    // Convert to 0-based index before calling
    if (this.initialPagePaginator) {
      this.initialPagePaginator.goToPage(pageNumber - 1);
    }
  }
}
