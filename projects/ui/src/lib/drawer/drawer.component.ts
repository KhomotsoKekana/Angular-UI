import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  Renderer2,
  ViewChild,
  AfterViewInit,
  SimpleChanges
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconComponent } from '../icons/icon.component';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: '{{transformEnter}}' }),
        animate('500ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: 'translateX(0)' }))
      ], { params: { transformEnter: 'translateX(100%)' } }),
      transition(':leave', [
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ transform: '{{transformLeave}}' }))
      ], { params: { transformLeave: 'translateX(100%)' } })
    ])
  ]
})
export class DrawerComponent {
  @Input() isOpen = false;
  @Input() preload = false;
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'right';
  @Input() size = 450; // Default width/height
  @Input() minSize = 150; // Prevents the drawer from becoming too small
  @Input() maxSize = 800; // Prevents excessive expansion
  @Input() resizable = false;
  @Input() enableBackdrop = true;
  @Input() innerClass = 'p-6';
  @Input() focusOnHover = false;
  @Output() closeDrawer = new EventEmitter<void>();
  @ViewChild('drawer') drawerRef!: ElementRef;
  @ViewChild('resizer') resizerRef!: ElementRef;
  @ViewChild('drawerContent') drawerContentRef!: ElementRef;


  isResizing = false;
  startPos = 0;
  startSize = 0;

  // Property to track mouse over iframe state
  isMouseOverIframe = false;

  constructor(private renderer: Renderer2) { }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    if (this.isOpen) {
      this.close();
    }
  }

  close() {
    this.isOpen = false;
    this.closeDrawer.emit();
  }

  private iframeListenersInitialized = false;

  ngOnChanges(changes: SimpleChanges) {
    // Check if drawer is opening and resizable
    if (changes['isOpen']?.currentValue && this.resizable) {
      // Use requestAnimationFrame instead of setTimeout for better performance
      requestAnimationFrame(() => {
        this.setupResizing();

        // Only add iframe listeners once when backdrop is disabled
        if (!this.enableBackdrop && !this.iframeListenersInitialized) {
          this.setupIframeListeners();
          this.iframeListenersInitialized = true;
        }
      });
    }
  }

  setupIframeListeners() {
    if(this.focusOnHover){
    // Add hover event listeners to the drawer content directly
    if (this.drawerContentRef?.nativeElement) {
      // Add mouseenter event
      this.renderer.listen(this.drawerContentRef.nativeElement, 'mouseenter', () => {
      this.isMouseOverIframe = true;
      });
      
      // Add mouseleave event
      this.renderer.listen(this.drawerContentRef.nativeElement, 'mouseleave', () => {
      this.isMouseOverIframe = false;
      });
    }

    if (this.resizerRef?.nativeElement) {
      // Add mouseenter event
      this.renderer.listen(this.resizerRef.nativeElement, 'mouseenter', () => {
      this.isMouseOverIframe = true;
      });
      
      // Add mouseleave event
      this.renderer.listen(this.resizerRef.nativeElement, 'mouseleave', () => {
      this.isMouseOverIframe = false;
      });
    }
  }
  }

  // Getter to determine if backdrop should be shown
  get showBackdrop() {
    return this.isOpen && (this.enableBackdrop || this.isMouseOverIframe);
  }

  setupResizing() {
    const drawer = this.drawerRef.nativeElement;
    const resizer = this.resizerRef.nativeElement;

    const mouseMoveHandler = (event: MouseEvent) => {
      if (!this.isResizing) return;
      event.preventDefault();

      let newSize: number;
      const delta = this.position === 'left' || this.position === 'right'
        ? event.clientX - this.startPos
        : event.clientY - this.startPos;

      switch (this.position) {
        case 'left':
          newSize = this.startSize + delta;
          break;
        case 'right':
          newSize = this.startSize - delta;
          break;
        case 'top':
          newSize = this.startSize + delta;
          break;
        case 'bottom':
          newSize = this.startSize - delta;
          break;
      }

      // Clamp the size between min and max
      newSize = Math.max(this.minSize, Math.min(this.maxSize, newSize));

      // Further clamp newSize to the viewport dimensions
      const viewportLimit = (this.position === 'left' || this.position === 'right')
        ? window.innerWidth
        : window.innerHeight;
      newSize = Math.min(newSize, viewportLimit);

      // Throttle style updates via requestAnimationFrame to avoid issues when dragging quickly
      const prop = (this.position === 'left' || this.position === 'right') ? 'width' : 'height';
      requestAnimationFrame(() => {
        drawer.style[prop] = `${newSize}px`;
      });
    };

    const mouseUpHandler = () => {
      this.isResizing = false;
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    this.renderer.listen(resizer, 'pointerdown', (event: PointerEvent) => {
      event.preventDefault();
      resizer.setPointerCapture(event.pointerId);
      this.isResizing = true;
      this.startPos = (this.position === 'left' || this.position === 'right') ? event.clientX : event.clientY;
      this.startSize = (this.position === 'left' || this.position === 'right')
        ? drawer.offsetWidth
        : drawer.offsetHeight;

      // Disable animations during resize
      drawer.style.transition = 'none';
      document.body.style.userSelect = 'none';
      document.addEventListener('pointermove', mouseMoveHandler);
      document.addEventListener('pointerup', mouseUpHandler);
    });
  }

  getTransform(direction: string) {
    return {
      top: 'translateY(-100%)',
      bottom: 'translateY(100%)',
      left: 'translateX(-100%)',
      right: 'translateX(100%)'
    }[direction];
  }

  resetSize() {
    this.drawerRef.nativeElement.style.width = `${this.size}px`;
    this.drawerRef.nativeElement.style.height = `${this.size}px`;
  }

  get showDrawer() {
    return this.isOpen || this.preload;
  }

}