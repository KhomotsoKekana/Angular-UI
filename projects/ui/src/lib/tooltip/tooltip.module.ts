import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip.directive';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
    imports: [CommonModule, TooltipComponent, TooltipDirective,OverlayModule, PortalModule],
    exports: [TooltipComponent, TooltipDirective]
})
export class TooltipModule { }