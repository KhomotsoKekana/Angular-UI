import { Component } from '@angular/core';
import { BadgeComponent } from '../../../../../ui/src/lib/badge/badge.component';
import { CommonModule } from '@angular/common';
import { CodeBlockComponent } from "../../../../../ui/src/lib/code-block/code-block.component";

@Component({
  standalone: true,
  imports: [BadgeComponent, CommonModule, CodeBlockComponent],
  templateUrl: './badge.component.html',
})
export class DocsBadgeComponent {
  closeHandler() {
    console.log('Badge closed!');
  }
}