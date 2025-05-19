import { Component, Input, HostListener, ElementRef } from '@angular/core';

@Component({
    selector: 'app-dynamic-tooltip-trigger',
    template: `<ng-content></ng-content>`
})
export class DynamicTooltipTriggerComponent {

    constructor(private elementRef: ElementRef) {}

    
}