import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'flex-accordion-item',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="border-border overflow-hidden">
  <!-- Header -->
  <div
    class="flex justify-between items-center px-1 py-2 cursor-pointer hover:text-primary text-foreground rounded"
    [ngClass]="{ 'bg-secondary': isOpen, 'bg-transparent': !isOpen }"
    (click)="toggle()"
  >
    <div class="flex flex-col">
      <span class="font-medium select-none text-sm">{{ title }}</span>
      <span class="font-normal text-muted-foreground select-none text-[10px]">{{ subTitle }}</span>
    </div>
    <svg
      class="w-4 h-4 transition-transform duration-300"
      [ngClass]="{ 'rotate-180': isOpen }"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </div>

  <!-- Content -->
  <div
    #contentWrapper
    class="overflow-hidden transition-[max-height] duration-300 ease-in-out"
    [ngStyle]="{ '--accordion-content-height': contentHeight + 'px' }"
    [ngClass]="{
      'animate-accordionOpen border-b border-border': isOpen,
      'animate-accordionClose': !isOpen
    }"
  >
    <div class="px-2 py-4 bg-transparent" #content>
      <ng-content></ng-content>
    </div>
  </div>
</div>
  `,
})
export class AccordionItemComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() title: string = '';
  @Input() subTitle: string = '';
  @Input() defaultOpen: boolean = false;

  isOpen = false;
  contentHeight = 0;

  @ViewChild('content') content!: ElementRef;
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.isOpen && this.content) {
          this.contentHeight = this.content.nativeElement.scrollHeight;
        }
      });
      this.resizeObserver.observe(this.content.nativeElement);
    }
  }

  ngOnInit() {
    if (this.defaultOpen)
      this.isOpen = true
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  toggle(): void {
    const contentElement = this.content.nativeElement;

    if (!this.isOpen) {
      // Opening: Measure content height and set it
      this.contentHeight = contentElement.scrollHeight;
      this.isOpen = true;
    } else {
      // Closing: Trigger animation by keeping height for a short duration
      this.contentHeight = contentElement.scrollHeight; // Retain height for smooth transition
      setTimeout(() => {
        this.contentHeight = 0; // Transition to 0px
        this.isOpen = false;
      }, 0);
    }
  }
}