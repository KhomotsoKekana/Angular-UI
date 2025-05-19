import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, ColumnTemplateDirective, Column, PageEvent, Sort } from '../../../../../ui/src/lib/data-table/data-table.component';

@Component({
  standalone: true,
  imports: [CommonModule, DataTableComponent, ColumnTemplateDirective],
  templateUrl: './data-table.component.html',
})
export class DocsDataTableComponent {
  // Sample data for the table
  tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Guest', status: 'Active' },
    { id: 6, name: 'Diana Miller', email: 'diana@example.com', role: 'Admin', status: 'Inactive' },
    { id: 7, name: 'Edward Davis', email: 'edward@example.com', role: 'User', status: 'Active' },
    { id: 8, name: 'Fiona Clark', email: 'fiona@example.com', role: 'Editor', status: 'Active' },
    { id: 9, name: 'George Hall', email: 'george@example.com', role: 'Guest', status: 'Inactive' },
    { id: 10, name: 'Hannah Lee', email: 'hannah@example.com', role: 'Admin', status: 'Active' },
    { id: 11, name: 'Ian White', email: 'ian@example.com', role: 'User', status: 'Active' },
    { id: 12, name: 'Julia Green', email: 'julia@example.com', role: 'Editor', status: 'Inactive' }
  ];

  // Column definitions
  tableColumns: Column[] = [
    { name: 'id', header: 'ID', sortable: true, filterable: true },
    { name: 'name', header: 'Name', sortable: true, filterable: true },
    { name: 'email', header: 'Email', sortable: true, filterable: true },
    { name: 'role', header: 'Role', sortable: true, filterable: true },
    { name: 'status', header: 'Status', sortable: true, filterable: true }
  ];

  // For server-side example
  loading = false;
  serverData = this.tableData.slice(0, 5);
  totalItems = this.tableData.length;
  currentPage = 0;
  pageSize = 5;

  onPageChange(event: PageEvent): void {
    console.log('Page changed:', event);
    if (event.pageIndex !== this.currentPage || event.pageSize !== this.pageSize) {
      this.loading = true;
      this.currentPage = event.pageIndex;
      this.pageSize = event.pageSize;
      
      // Simulate server delay
      setTimeout(() => {
        const start = this.currentPage * this.pageSize;
        this.serverData = this.tableData.slice(start, start + this.pageSize);
        this.loading = false;
      }, 500);
    }
  }

  onSortChange(event: Sort): void {
    console.log('Sort changed:', event);
    // Implement server-side sorting logic here
  }

  onFilterChange(event: any): void {
    console.log('Filter changed:', event);
    // Implement server-side filtering logic here
  }

  onRowClick(row: any): void {
    console.log('Row clicked:', row);
  }
}