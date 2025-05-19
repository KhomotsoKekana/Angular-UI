import { Component, Input } from '@angular/core';
import { HeaderLeftComponent } from './header-left.component';
import { HeaderCenterComponent } from './header-center.component';
import { HeaderRightComponent } from './header-right.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Input() class: string = ''; // Allows overriding styles

}
