import { AfterContentInit, Component, ContentChild, HostBinding, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tab-content',
  standalone: true,
  template: `<ng-template #content><ng-content></ng-content></ng-template>`
})
export class TabContentComponent implements AfterContentInit{
  @Input() id: string = ''; // Unique ID for the tab content
  @Input() class: string = '';

  @HostBinding('class')
  get hostClasses(): string {
    return `${this.class}`;
  }


  @ViewChild('content', { static: true }) templateRef!: TemplateRef<any>; // Template for the content

  ngAfterContentInit(): void {
    if (!this.templateRef) {
      console.error(`TabContentComponent with id "${this.id}" has no TemplateRef.`);
    }
  }

}
