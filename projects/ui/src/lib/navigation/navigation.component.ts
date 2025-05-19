import { Component, ContentChild, ElementRef, HostBinding, Renderer2 } from '@angular/core';
import { MainSidebarComponent } from "../main-sidebar/main-sidebar.component";
import { MainSidebarContentComponent } from "../main-sidebar/main-sidebar-content/main-sidebar-content.component";

@Component({
  selector: 'app-custom-navigator',
  templateUrl: './navigation.component.html',
  imports: [],
})
export class NavigationComponent {
  @ContentChild(MainSidebarComponent) sidebar!: MainSidebarComponent;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterContentInit(): void {
    if (this.sidebar) {
      // this.updateLayout();
      // this.sidebar.widthChange.subscribe(() => this.updateLayout());
    }
  }

  private updateLayout(): void {
    const sidebarWidth = this.sidebar.getCurrentWidth();

    const contentElement = this.el.nativeElement.querySelector(
      'app-main-sidebar-content'
    );

    this.renderer.setStyle(
      contentElement,
      'width',
      `calc(100% - ${sidebarWidth}px)`
    );
  }
}