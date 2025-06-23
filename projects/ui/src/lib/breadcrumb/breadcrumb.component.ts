import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IconComponent} from '../icons/icon.component'

@Component({
  selector: 'flex-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
  imports: [CommonModule,IconComponent]
})
export class BreadcrumbComponent {
  @Input() items: {icon?:string | any; label?: string; url?: string }[] = [];
}
