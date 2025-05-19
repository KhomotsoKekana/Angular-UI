import { Component, Input, HostListener, ElementRef } from '@angular/core';

@Component({
    selector: 'app-dynamic-tooltip-content',
    template: `<ng-content></ng-content>`
})
export class DynamicTooltipContentComponent {

    constructor(private elementRef: ElementRef) {}

    
}