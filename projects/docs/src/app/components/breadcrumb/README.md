# Breadcrumb

Breadcrumbs help users understand their current location within a website or application by showing the hierarchical navigation path.

## Features

- Simple path-based navigation
- Clickable links for previous steps in the navigation path
- Current page/location indicator (last item is not clickable)
- Accessible design with proper ARIA attributes

## Usage

```html
<ui-breadcrumb [items]="breadcrumbItems"></ui-breadcrumb>
```

Where `breadcrumbItems` is an array of objects with the following structure:

```typescript
interface BreadcrumbItem {
  label: string;   // Text to display
  url?: string;    // Optional URL to navigate to (if not provided, item will not be clickable)
}
```

## Input Properties

| Name  | Type                          | Description                              |
|-------|-------------------------------|------------------------------------------|
| items | `{ label: string; url?: string; }[]` | Array of breadcrumb items to display    |

## Examples

### Basic Breadcrumb

```html
<ui-breadcrumb [items]="[
  { label: 'Home', url: '/' },
  { label: 'Library', url: '/library' },
  { label: 'Data' }
]"></ui-breadcrumb>
```

### Dynamic Breadcrumb with Angular Router

```typescript
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-my-page',
  template: '<ui-breadcrumb [items]="breadcrumbItems"></ui-breadcrumb>'
})
export class MyPageComponent implements OnInit {
  breadcrumbItems: { label: string; url: string }[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.breadcrumbItems = this.createBreadcrumbs(this.activatedRoute.root);
    });
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs = []): any[] {
    const children = route.children;
    
    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'];
      if (label) {
        breadcrumbs.push({
          label: label,
          url: url
        });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
  }
}
```

## Accessibility

The breadcrumb component uses proper semantic HTML and ARIA attributes:

- Uses `<nav>` element with `aria-label="breadcrumb"` to identify it as a breadcrumb navigation
- Uses an ordered list (`<ol>`) to represent the hierarchy of the navigation
- Current/last item is visually distinguished and doesn't have a link
- Links have proper hover states for visual feedback

## Styling

The breadcrumb component has a clean, minimal design that can be customized through CSS variables:

- Font size: 14px
- Link color: #0073e6
- Current item: Bold, #4a4a4a