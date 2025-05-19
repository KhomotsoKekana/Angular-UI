import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { HeaderLeftComponent } from './header-left.component';
import { HeaderCenterComponent } from './header-center.component';
import { HeaderRightComponent } from './header-right.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HeaderComponent,
    HeaderLeftComponent,
    HeaderCenterComponent,
    HeaderRightComponent
  ],
  exports: [
    HeaderComponent,
    HeaderLeftComponent,
    HeaderCenterComponent,
    HeaderRightComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderModule {}