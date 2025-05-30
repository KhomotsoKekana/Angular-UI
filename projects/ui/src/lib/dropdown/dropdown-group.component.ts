import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { DropdownGroupTriggerComponent } from './dropdown-group-trigger.component';
import { CommonModule } from '@angular/common';
import { DropdownService } from './dropdown.service';

@Component({
  selector: 'flex-dropdown-group',
  imports: [CommonModule],
  template: `
    <div class="relative group" #groupTrigger>
      <!-- Trigger -->
      <ng-content select="flex-dropdown-group-trigger"></ng-content>

      <!-- Sub-Dropdown -->
      <div
        *ngIf="isOpen"
        #subDropdown
        class="absolute bg-white shadow-lg rounded border z-50 w-48 p-0.5 animate-slide-down"
        [ngStyle]="{
          left: position === 'right' ? '100%' : 'auto',
          right: position === 'left' ? '100%' : 'auto',
          top:this.top
        }"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class DropdownGroupComponent implements AfterViewInit {
  @Input() position: 'left' | 'right' = 'right'; // Default dropdown position
  isOpen: boolean = false;
  top: number = 0;

  @ViewChild('groupTrigger', { static: true }) groupTrigger!: ElementRef;

  // Content child for the trigger
  @ContentChild(DropdownGroupTriggerComponent) trigger!: DropdownGroupTriggerComponent;

  @HostListener('mouseenter') onMouseEnter() {
    this.calculatePosition();
    this.isOpen = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.isOpen = false;
  }

  constructor(private dropdownService: DropdownService) { }

  ngAfterViewInit(): void {
    this.dropdownService.dropdownClicked$.subscribe(value => {

      if (value) {
        this.isOpen = false;
      }

    });
  }

  private calculatePosition() {
    const rect = this.groupTrigger.nativeElement.getBoundingClientRect();
    const screenWidth = window.innerWidth;

    this.position = rect.right + 200 > screenWidth ? 'left' : 'right';
    this.top = 0;
  }
}