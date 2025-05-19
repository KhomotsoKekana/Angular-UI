import { Component, HostListener, Output, EventEmitter, ContentChild, TemplateRef, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-popover-trigger',
  standalone:true,
  template: `<ng-content></ng-content>`,
})
export class PopoverTriggerComponent {
  @Output() clicked = new EventEmitter<void>();
  @ContentChild(TemplateRef, { static: true }) template!: TemplateRef<any>;
  @Input() class:string = '';

  @HostBinding('class') get hostClass() {

    let base = "flex items-center justify-center cursor-pointer rounded-md";

    return `${base} ${this.class}`;

  }

  handleClick(): void {
    this.clicked.emit();
  }
}