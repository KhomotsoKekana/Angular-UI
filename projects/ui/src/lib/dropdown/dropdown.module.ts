import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './dropdown.component';
import { DropdownMenuComponent } from './dropdown-menu.component';
import { DropdownTriggerComponent } from './dropdown-trigger.component';
import { DropdownGroupComponent } from './dropdown-group.component';
import { DropdownGroupTriggerComponent } from './dropdown-group-trigger.component';
import { DropdownItemComponent } from './dropdown-item.component';
import { DropdownSectionComponent } from './dropdown-section.component';
import { DropdownService } from './dropdown.service';

@NgModule({
    imports: [
        CommonModule,
        DropdownComponent,
        DropdownMenuComponent,
        DropdownTriggerComponent,
        DropdownGroupComponent,
        DropdownGroupTriggerComponent,
        DropdownItemComponent,
        DropdownSectionComponent
    ],
    declarations: [
    ],
    exports: [
        DropdownComponent,
        DropdownMenuComponent,
        DropdownTriggerComponent,
        DropdownGroupComponent,
        DropdownGroupTriggerComponent,
        DropdownItemComponent,
        DropdownSectionComponent
    ]
})
export class DropdownModule {}