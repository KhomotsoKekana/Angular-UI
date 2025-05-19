import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../../ui/src/lib/header/header.component';
import { HeaderCenterComponent } from "../../../../../ui/src/lib/header/header-center.component";
import { HeaderLeftComponent } from "../../../../../ui/src/lib/header/header-left.component";
import { HeaderRightComponent } from "../../../../../ui/src/lib/header/header-right.component";

@Component({
  standalone: true,
  imports: [CommonModule, HeaderComponent, HeaderCenterComponent, HeaderLeftComponent, HeaderRightComponent],
  templateUrl: './header.component.html',
})
export class DocsHeaderComponent {}
