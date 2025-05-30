import { CommonModule } from '@angular/common';
import { AfterContentChecked, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, Host, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'flex-select-item',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div
    (click)="onSelect()"
    [ngClass]="disabled ? 'text-muted-foreground' : 'hover:text-primary hover:bg-primary/10 cursor-pointer'"
    class="px-2 py-1.5 sm:px-3 sm:py-2 antialiased font-normal flex items-center gap-x-2 text-xs select-none"
  >
    <div class="w-2 flex-shrink-0 mr-2">
      <svg *ngIf="selected" class="w-4 h-4 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <ng-content></ng-content>
  </div>`,
})
export class SelectItemComponent {
  @Input() key: any;
  @Input() label: string = '';
  @Input() selected = false;
  @Input() disabled = false;
  @Input() actionItem: boolean = false;

  @Output() select = new EventEmitter<any>();

  hidden = false;

  constructor(public elementRef: ElementRef, private ref: ChangeDetectorRef) { }

  onSelect() {
    this.select.emit(this.key);
  }
}