import { Component, Input } from '@angular/core';

@Component({
  selector: 'flex-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {
  @Input() items: { label: string; url?: string }[] = [];
}
