import { Component } from '@angular/core';
import { BadgeComponent } from '../../../../../ui/src/lib/badge/badge.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [BadgeComponent, CommonModule],
  templateUrl: './badge.component.html',
})
export class DocsBadgeComponent {
  closeHandler() {
    console.log('Badge closed!');
  }
}