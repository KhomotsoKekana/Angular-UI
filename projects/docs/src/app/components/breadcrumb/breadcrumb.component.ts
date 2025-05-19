import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../../../ui/src/lib/breadcrumb/breadcrumb.component';

@Component({
  selector: 'docs-breadcrumb',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class DocsBreadcrumbComponent {
  // Examples of breadcrumb configurations
  simpleExample = [
    { label: 'Home', url: '/' },
    { label: 'Library', url: '/library' },
    { label: 'Data' }
  ];

  multiLevelExample = [
    { label: 'Home', url: '/' },
    { label: 'Products', url: '/products' },
    { label: 'Electronics', url: '/products/electronics' },
    { label: 'Computers', url: '/products/electronics/computers' },
    { label: 'Laptops' }
  ];

  customExample = [
    { label: 'Dashboard', url: '/dashboard' },
    { label: 'User Settings', url: '/dashboard/settings' },
    { label: 'Profile' }
  ];
}
