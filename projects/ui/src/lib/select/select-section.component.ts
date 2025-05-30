import { Component, Input, ContentChildren, QueryList, AfterContentInit, ContentChild, TemplateRef, ViewChild } from '@angular/core';
import { SelectItemComponent } from './select-item.component';

@Component({
  selector: 'flex-select-section',
  standalone: true,
  template: `
   <div class="py-2">
  <h3 class="px-3 py-2 text-sm font-medium text-gray-900">{{ title }}</h3>
  <ng-content></ng-content>
</div>
  `,
})
export class SelectSectionComponent {
  @Input() title: string = ''; // Section title
  @ContentChildren(SelectItemComponent) items!: QueryList<SelectItemComponent>; // Child items

  @ViewChild('sectionTemplate') template!: TemplateRef<any>; // Expose template for dynamic rendering

  // ngAfterContentInit(): void {
  //   this.template = (this as any)._elementRef.nativeElement.childNodes[0]
  //     .templateRef; // Captures the section's template for dynamic rendering
  // }
}