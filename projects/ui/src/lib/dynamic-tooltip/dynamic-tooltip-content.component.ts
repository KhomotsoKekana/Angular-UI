import { Component, Input, HostListener, ElementRef } from '@angular/core';

@Component({
    selector: 'flex-dynamic-tooltip-content',
    template: `<ng-content></ng-content>`
})
export class DynamicTooltipContentComponent {

    constructor(private elementRef: ElementRef) {}

    
}