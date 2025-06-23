import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../../../ui/src/lib/breadcrumb/breadcrumb.component';
import { CodeBlockComponent } from '../../../../../ui/src/lib/code-block/code-block.component';
import { IconComponent } from '../../../../../ui/src/lib/icons/icon.component';
//import {home,library,data} from '../../../../../ui/src/lib/icons/icon.component';

@Component({
  selector: 'docs-breadcrumb',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent,CodeBlockComponent,IconComponent],
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

  simpleIconExample = [
    { icon: 'home', url: '/' },
    { icon: 'bookOpen', url: '/library' },
    { icon: 'settings' }
  ];

    simpleIconLabelExample = [
    { label:'home', icon: 'home', url: '/' },
    { label:'library', icon: 'bookOpen', url: '/library' },
    { label:'Settings', icon: 'settings' }
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
