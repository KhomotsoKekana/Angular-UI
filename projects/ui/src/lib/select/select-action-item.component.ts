import { CommonModule } from '@angular/common';
import { Component, ContentChild, ElementRef, EventEmitter, HostListener, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'flex-select-action-item',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div
  (click)="onClick()"
  [class.hidden]="hidden"
  [ngClass]="disabled ? 'text-muted-foreground' : 'text-primary hover:bg-primary/10 cursor-pointer'"
  class="px-3 py-2 antialiased font-normal rounded flex items-center gap-x-2 text-xs"
>
  <ng-content></ng-content>
</div>`, // Allows embedding custom content
})
export class SelectActionItemComponent {
  @Input() disabled = false;

  @Output() select = new EventEmitter<void>();

  hidden = false;

  constructor(public elementRef: ElementRef) { }

  onClick() {
    this.select.emit();
  }

}