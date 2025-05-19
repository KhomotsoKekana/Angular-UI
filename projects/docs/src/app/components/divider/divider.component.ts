import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerComponent } from '../../../../../ui/src/lib/divider/divider.component';

@Component({
  standalone: true,
  imports: [CommonModule, DividerComponent],
  templateUrl: './divider.component.html',
})
export class DocsDividerComponent {}
